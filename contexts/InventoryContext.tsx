
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Product, StockLevel, StockTransaction, TransactionType, DashboardStats, 
  PurchaseOrder, POStatus, Customer, User, IpWhitelist, ActiveSession, Message, CustomerProduct
} from '../types';
import { storageService } from '../services/storageService';

interface InventoryContextType {
  products: Product[];
  stockLevels: StockLevel[];
  transactions: StockTransaction[];
  purchaseOrders: PurchaseOrder[];
  customers: Customer[];
  customerProducts: CustomerProduct[]; // New
  users: User[];
  whitelist: IpWhitelist[];
  sessions: ActiveSession[];
  messages: Message[];
  
  refreshData: () => void;
  getDashboardStats: () => DashboardStats;
  processTransaction: (type: TransactionType, productId: string, quantity: number, userId: string, notes?: string) => Promise<void>;
  
  saveProduct: (product: Product) => Promise<void>;
  
  savePO: (po: PurchaseOrder) => Promise<void>;
  updatePOStatus: (id: string, status: POStatus) => Promise<void>;
  deletePO: (id: string) => Promise<void>;
  
  saveCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  importCustomerProducts: (items: CustomerProduct[]) => Promise<void>; // New

  // Messaging
  sendMessage: (msg: Message) => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;

  // System
  saveUser: (user: User) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addToWhitelist: (ip: string, description: string, by: string) => Promise<void>;
  removeFromWhitelist: (id: string) => Promise<void>;
  exportData: () => void;
  importData: (json: string) => boolean;
}

const InventoryContext = createContext<InventoryContextType>(null!);

export const InventoryProvider = ({ children }: { children?: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerProducts, setCustomerProducts] = useState<CustomerProduct[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [whitelist, setWhitelist] = useState<IpWhitelist[]>([]);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const refreshData = useCallback(() => {
    setProducts(storageService.getProducts());
    setStockLevels(storageService.getStockLevels());
    setTransactions(storageService.getTransactions());
    setPurchaseOrders(storageService.getPOs());
    setCustomers(storageService.getCustomers());
    setCustomerProducts(storageService.getCustomerProducts()); // New
    setUsers(storageService.getUsers());
    setWhitelist(storageService.getWhitelist());
    setSessions(storageService.getSessions());
    setMessages(storageService.getMessages());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const getDashboardStats = (): DashboardStats => {
    const totalStock = stockLevels.reduce((acc, curr) => acc + curr.quantity, 0);
    const totalValue = stockLevels.reduce((acc, curr) => {
      const prod = products.find(p => p.id === curr.productId);
      return acc + (curr.quantity * (prod?.cost || 0));
    }, 0);

    let lowStockCount = 0;
    products.forEach(p => {
      const prodStock = stockLevels
        .filter(s => s.productId === p.id)
        .reduce((sum, s) => sum + s.quantity, 0);
      if (prodStock <= p.minStockLevel) lowStockCount++;
    });

    return {
      totalProducts: products.length,
      totalStock,
      lowStockCount,
      totalValue
    };
  };

  const processTransaction = async (type: TransactionType, productId: string, quantity: number, userId: string, notes?: string) => {
    storageService.createTransaction(type, productId, quantity, userId, notes);
    refreshData();
  };

  const saveProduct = async (product: Product) => {
    storageService.saveProduct(product);
    refreshData();
  };

  const savePO = async (po: PurchaseOrder) => {
    storageService.savePO(po);
    refreshData();
  };

  const updatePOStatus = async (id: string, status: POStatus) => {
    storageService.updatePOStatus(id, status);
    refreshData();
  };

  const deletePO = async (id: string) => {
    storageService.deletePO(id);
    refreshData();
  };

  const saveCustomer = async (customer: Customer) => {
    storageService.saveCustomer(customer);
    refreshData();
  };

  const deleteCustomer = async (id: string) => {
    storageService.deleteCustomer(id);
    refreshData();
  };

  const importCustomerProducts = async (items: CustomerProduct[]) => {
      storageService.importCustomerProducts(items);
      refreshData();
  };

  // --- Messaging ---
  const sendMessage = async (msg: Message) => {
      storageService.saveMessage(msg);
      refreshData();
  };

  const markMessageRead = async (id: string) => {
      storageService.markMessageRead(id);
      refreshData();
  };

  // --- System Methods ---
  const saveUser = async (user: User) => {
      storageService.saveUser(user);
      refreshData();
  };

  const deleteUser = async (id: string) => {
      storageService.deleteUser(id);
      refreshData();
  };

  const addToWhitelist = async (ip: string, description: string, by: string) => {
      storageService.addToWhitelist(ip, description, by);
      refreshData();
  };

  const removeFromWhitelist = async (id: string) => {
      storageService.removeFromWhitelist(id);
      refreshData();
  };

  const exportData = () => {
      const json = storageService.getAllData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const importData = (json: string): boolean => {
      const success = storageService.importData(json);
      if (success) refreshData();
      return success;
  };

  return (
    <InventoryContext.Provider value={{
      products, stockLevels, transactions, purchaseOrders, customers, users, whitelist, sessions, messages, customerProducts,
      refreshData, getDashboardStats, processTransaction, saveProduct,
      savePO, updatePOStatus, deletePO, saveCustomer, deleteCustomer, importCustomerProducts,
      sendMessage, markMessageRead,
      saveUser, deleteUser, addToWhitelist, removeFromWhitelist, exportData, importData
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
