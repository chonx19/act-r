
import { 
  Product, StockLevel, StockTransaction, User, UserRole, TransactionType, PurchaseOrder, POStatus, Customer, ActiveSession, IpWhitelist, Message, CustomerProduct
} from '../types';

// Cleared initial products as requested
const INITIAL_PRODUCTS: Product[] = [];

// Cleared initial stock as requested
const INITIAL_STOCK: StockLevel[] = [];

const INITIAL_USERS: User[] = [
  { id: '1', username: 'chana19', password: 'chana19', name: 'Admin (Chana)', role: UserRole.ADMIN, isActive: true },
  { id: '2', username: 'employee', password: 'employee', name: 'Employee', role: UserRole.USER, isActive: true },
  { id: '3', username: 'customer', password: 'customer', name: 'Customer User', role: UserRole.CUSTOMER, isActive: true, linkedCustomerId: 'CUST001' },
];

// Update keys to '_v10' to force fresh empty state for products
const STORAGE_KEYS = {
  PRODUCTS: 'act_products_v10',
  STOCK: 'act_stock_v10',
  TRANSACTIONS: 'act_transactions_v10',
  USERS: 'act_users_v10',
  POS: 'act_pos_v10',
  CUSTOMERS: 'act_customers_v10',
  SESSIONS: 'act_sessions_v10',
  WHITELIST: 'act_whitelist_v10',
  MESSAGES: 'act_messages_v10',
  CUSTOMER_PRODUCTS: 'act_customer_products_v10', // New Key
};

const get = <T>(key: string, defaultVal: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultVal;
};

const set = <T>(key: string, val: T): void => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const storageService = {
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      set(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      set(STORAGE_KEYS.STOCK, INITIAL_STOCK);
      set(STORAGE_KEYS.TRANSACTIONS, []);
      set(STORAGE_KEYS.POS, []);
      set(STORAGE_KEYS.CUSTOMERS, []);
      set(STORAGE_KEYS.USERS, INITIAL_USERS);
      set(STORAGE_KEYS.SESSIONS, []);
      set(STORAGE_KEYS.WHITELIST, []);
      set(STORAGE_KEYS.MESSAGES, []);
      set(STORAGE_KEYS.CUSTOMER_PRODUCTS, []);
    }
  },

  // --- Products ---
  getProducts: (): Product[] => get(STORAGE_KEYS.PRODUCTS, []),
  saveProduct: (product: Product) => {
    const products = get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) products[index] = product; else products.push(product);
    set(STORAGE_KEYS.PRODUCTS, products);
  },
  deleteProduct: (id: string) => {
    const products = get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    set(STORAGE_KEYS.PRODUCTS, products.filter(p => p.id !== id));
  },

  // --- Stock & Transactions ---
  getStockLevels: (): StockLevel[] => get(STORAGE_KEYS.STOCK, []),
  getTransactions: (): StockTransaction[] => get(STORAGE_KEYS.TRANSACTIONS, []),
  createTransaction: (
    type: TransactionType, 
    productId: string, 
    quantity: number, 
    userId: string, 
    notes?: string
  ) => {
    const transactions = get<StockTransaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    const stock = get<StockLevel[]>(STORAGE_KEYS.STOCK, []);
    
    // Find stock by product only
    const currentStockIndex = stock.findIndex(s => s.productId === productId);
    let currentQty = currentStockIndex >= 0 ? stock[currentStockIndex].quantity : 0;

    if (type === TransactionType.OUT) {
      if (currentQty < quantity) throw new Error(`สินค้าในคลังไม่เพียงพอ (มีอยู่: ${currentQty})`);
      currentQty -= quantity;
    } else {
      currentQty += quantity;
    }
    
    if (currentQty < 0) throw new Error("การทำรายการจะทำให้สต็อกติดลบ");

    if (currentStockIndex >= 0) {
      stock[currentStockIndex].quantity = currentQty;
    } else {
      stock.push({ productId, quantity: currentQty });
    }
    set(STORAGE_KEYS.STOCK, stock);

    // --- Generate Document Number (Format: ACT[TYPE]YY-MM-DD-###) ---
    let typePrefix = 'DOC';
    if(type === TransactionType.IN) typePrefix = 'IN';
    if(type === TransactionType.OUT) typePrefix = 'OUT';
    if(type === TransactionType.ADJ) typePrefix = 'ADJ';

    const now = new Date();
    const yy = now.getFullYear().toString().slice(-2); 
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const dd = now.getDate().toString().padStart(2, '0');
    
    const datePrefix = `ACT${typePrefix}${yy}-${mm}-${dd}-`;
    
    const dailyCount = transactions.filter(t => t.documentNumber.startsWith(datePrefix)).length + 1;
    const runningNum = dailyCount.toString().padStart(3, '0');
    
    const docNum = `${datePrefix}${runningNum}`;

    const newTx: StockTransaction = {
      id: Date.now().toString(),
      documentNumber: docNum,
      date: new Date().toISOString(),
      type,
      productId,
      quantity,
      userId,
      notes
    };

    transactions.unshift(newTx);
    set(STORAGE_KEYS.TRANSACTIONS, transactions);
    return newTx;
  },

  // --- Purchase Orders (Kanban) ---
  getPOs: (): PurchaseOrder[] => {
    const list = get<PurchaseOrder[]>(STORAGE_KEYS.POS, []);
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const activeList = list.filter(p => {
      if (p.status === 'CANCELLED' && p.deletedAt) {
        const deleteDate = new Date(p.deletedAt);
        return deleteDate.getTime() >= thirtyDaysAgo.getTime();
      }
      return true;
    });

    if (activeList.length !== list.length) {
      set(STORAGE_KEYS.POS, activeList);
    }
    return activeList;
  },
  savePO: (po: PurchaseOrder) => {
    const list = get<PurchaseOrder[]>(STORAGE_KEYS.POS, []);
    const index = list.findIndex(p => p.id === po.id);
    if (index >= 0) list[index] = po; else list.push(po);
    set(STORAGE_KEYS.POS, list);

    // --- Auto-save Items to Customer History ---
    if (po.customerName && po.items.length > 0) {
        let historyList = get<CustomerProduct[]>(STORAGE_KEYS.CUSTOMER_PRODUCTS, []);
        
        // 1. Remove existing entries for this PO (to allow updates/corrections)
        historyList = historyList.filter(cp => cp.poId !== po.id);

        // 2. Add current items
        po.items.forEach(item => {
            historyList.push({
                id: Date.now().toString() + Math.random(),
                customerName: po.customerName,
                productName: item.name,
                price: item.unitPrice,
                unit: item.unit,
                lastQuotedDate: po.startDate || new Date().toISOString(),
                poId: po.id,
                poNumber: po.poNumber,
                quantity: item.quantity
            });
        });

        // Sort by date desc
        historyList.sort((a, b) => new Date(b.lastQuotedDate).getTime() - new Date(a.lastQuotedDate).getTime());

        set(STORAGE_KEYS.CUSTOMER_PRODUCTS, historyList);
    }
  },
  updatePOStatus: (id: string, status: POStatus) => {
    const list = get<PurchaseOrder[]>(STORAGE_KEYS.POS, []);
    const item = list.find(p => p.id === id);
    if (item) {
      item.status = status;
      if (status === 'CANCELLED') {
        item.deletedAt = new Date().toISOString();
      } else {
        item.deletedAt = undefined;
      }
      set(STORAGE_KEYS.POS, list);
    }
  },
  deletePO: (id: string) => {
    const list = get<PurchaseOrder[]>(STORAGE_KEYS.POS, []);
    set(STORAGE_KEYS.POS, list.filter(p => p.id !== id));
    
    // Also remove history for this PO? 
    // Usually history should persist, but if permanent delete, maybe remove history too?
    // User requested "Like recording that PO". If PO is deleted, maybe history should stay if it was "sold"?
    // For now, let's keep history even if PO is deleted, unless user manually cleans it.
    // Or if strictly linked:
    // const historyList = get<CustomerProduct[]>(STORAGE_KEYS.CUSTOMER_PRODUCTS, []);
    // set(STORAGE_KEYS.CUSTOMER_PRODUCTS, historyList.filter(h => h.poId !== id));
  },

  // --- Customers ---
  getCustomers: (): Customer[] => get(STORAGE_KEYS.CUSTOMERS, []),
  saveCustomer: (customer: Customer) => {
    const list = get<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    const index = list.findIndex(c => c.id === customer.id);
    if (index >= 0) list[index] = customer; else list.push(customer);
    set(STORAGE_KEYS.CUSTOMERS, list);
  },
  deleteCustomer: (id: string) => {
    const list = get<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    set(STORAGE_KEYS.CUSTOMERS, list.filter(c => c.id !== id));
  },

  // --- Customer Products (History) ---
  getCustomerProducts: (): CustomerProduct[] => get(STORAGE_KEYS.CUSTOMER_PRODUCTS, []),
  saveCustomerProduct: (cp: CustomerProduct) => {
      const list = get<CustomerProduct[]>(STORAGE_KEYS.CUSTOMER_PRODUCTS, []);
      const index = list.findIndex(i => i.id === cp.id);
      if (index >= 0) list[index] = cp; else list.push(cp);
      set(STORAGE_KEYS.CUSTOMER_PRODUCTS, list);
  },
  importCustomerProducts: (newItems: CustomerProduct[]) => {
      const list = get<CustomerProduct[]>(STORAGE_KEYS.CUSTOMER_PRODUCTS, []);
      // Merge: For import, we might just append all, or check for duplicates?
      // Simple append for log style
      const combined = [...list, ...newItems];
      // Sort
      combined.sort((a, b) => new Date(b.lastQuotedDate).getTime() - new Date(a.lastQuotedDate).getTime());
      set(STORAGE_KEYS.CUSTOMER_PRODUCTS, combined);
  },

  // --- Messages (New) ---
  getMessages: (): Message[] => get(STORAGE_KEYS.MESSAGES, []),
  saveMessage: (msg: Message) => {
      const list = get<Message[]>(STORAGE_KEYS.MESSAGES, []);
      list.unshift(msg);
      set(STORAGE_KEYS.MESSAGES, list);
  },
  markMessageRead: (id: string) => {
      const list = get<Message[]>(STORAGE_KEYS.MESSAGES, []);
      const msg = list.find(m => m.id === id);
      if(msg) {
          msg.isRead = true;
          set(STORAGE_KEYS.MESSAGES, list);
      }
  },

  // --- User Management ---
  getUsers: (): User[] => get(STORAGE_KEYS.USERS, INITIAL_USERS),
  saveUser: (user: User) => {
    const list = get<User[]>(STORAGE_KEYS.USERS, []);
    const index = list.findIndex(u => u.id === user.id);
    if (index >= 0) {
        if (!user.password) {
            user.password = list[index].password;
        }
        list[index] = user;
    } else {
        list.push(user);
    }
    set(STORAGE_KEYS.USERS, list);
  },
  deleteUser: (id: string) => {
    const list = get<User[]>(STORAGE_KEYS.USERS, []);
    set(STORAGE_KEYS.USERS, list.filter(u => u.id !== id));
  },

  // --- IP Whitelist ---
  getWhitelist: (): IpWhitelist[] => get(STORAGE_KEYS.WHITELIST, []),
  addToWhitelist: (ip: string, description: string, by: string) => {
    const list = get<IpWhitelist[]>(STORAGE_KEYS.WHITELIST, []);
    if (list.some(i => i.ip === ip)) throw new Error('IP Address already exists in whitelist');
    list.push({
        id: Date.now().toString(),
        ip,
        description,
        addedBy: by,
        addedAt: new Date().toISOString()
    });
    set(STORAGE_KEYS.WHITELIST, list);
  },
  removeFromWhitelist: (id: string) => {
      const list = get<IpWhitelist[]>(STORAGE_KEYS.WHITELIST, []);
      set(STORAGE_KEYS.WHITELIST, list.filter(i => i.id !== id));
  },

  // --- Sessions ---
  getSessions: (): ActiveSession[] => get(STORAGE_KEYS.SESSIONS, []),
  createSession: (user: User, ip: string) => {
      const sessions = get<ActiveSession[]>(STORAGE_KEYS.SESSIONS, []);
      const newSession: ActiveSession = {
          id: Date.now().toString(),
          userId: user.id,
          userName: user.username,
          ipAddress: ip,
          userAgent: navigator.userAgent,
          loginTime: new Date().toISOString()
      };
      sessions.unshift(newSession);
      if(sessions.length > 50) sessions.pop();
      set(STORAGE_KEYS.SESSIONS, sessions);
  },

  // --- Auth ---
  login: async (username: string, password: string, clientIp: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const whitelist = get<IpWhitelist[]>(STORAGE_KEYS.WHITELIST, []);
    if (whitelist.length > 0) {
        const allowed = whitelist.some(w => w.ip === clientIp || w.ip === '0.0.0.0');
        if (!allowed) {
            throw new Error(`Access Denied: Your IP (${clientIp}) is not whitelisted.`);
        }
    }
    const users = get<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        if (!user.isActive) throw new Error('Account is disabled');
        user.lastLogin = new Date().toISOString();
        const index = users.findIndex(u => u.id === user.id);
        users[index] = user;
        set(STORAGE_KEYS.USERS, users);
        return user;
    }
    return null;
  },

  // --- Data ---
  getAllData: () => {
      const data: any = {};
      Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
          data[key] = get(storageKey, null);
      });
      return JSON.stringify(data);
  },
  importData: (jsonData: string) => {
      try {
          const data = JSON.parse(jsonData);
          Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
              if (data[key]) {
                  set(storageKey, data[key]);
              }
          });
          return true;
      } catch (e) {
          console.error("Import failed", e);
          return false;
      }
  }
};
