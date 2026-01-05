import React, { useState, useEffect } from 'react';
import { useInventory } from '../contexts/InventoryContext';
import { User, UserRole } from '../types';
import { 
  Users, Shield, Database, Activity, Plus, Trash2, Edit2, Save, X, 
  Download, Upload, CheckCircle, AlertTriangle, Globe, Monitor 
} from 'lucide-react';

const Settings = () => {
  const { 
    users, saveUser, deleteUser, 
    whitelist, addToWhitelist, removeFromWhitelist, 
    exportData, importData, sessions
  } = useInventory();

  const [activeTab, setActiveTab] = useState('users');
  const [currentIp, setCurrentIp] = useState('Loading...');

  // User Form
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<Partial<User>>({ username: '', password: '', name: '', role: UserRole.USER, isActive: true });

  // Whitelist Form
  const [wlIp, setWlIp] = useState('');
  const [wlDesc, setWlDesc] = useState('');

  // Import State
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string>('');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => setCurrentIp(data.ip))
        .catch(() => setCurrentIp('Unknown'));
  }, []);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData: User = {
        id: editingUser ? editingUser.id : Date.now().toString(),
        username: userForm.username!,
        password: userForm.password, // Pass empty if editing and not changing
        name: userForm.name!,
        role: userForm.role || UserRole.USER,
        isActive: userForm.isActive ?? true,
        lastLogin: editingUser?.lastLogin
    };
    await saveUser(userData);
    setIsUserModalOpen(false);
  };

  const openUserModal = (user?: User) => {
      if (user) {
          setEditingUser(user);
          setUserForm({ ...user, password: '' }); // Don't show password
      } else {
          setEditingUser(null);
          setUserForm({ username: '', password: '', name: '', role: UserRole.USER, isActive: true });
      }
      setIsUserModalOpen(true);
  };

  const handleWhitelistSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await addToWhitelist(wlIp, wlDesc, 'Admin');
        setWlIp('');
        setWlDesc('');
      } catch (err: any) {
          alert(err.message);
      }
  };

  const handleImport = () => {
      if (!window.confirm('Warning: This will overwrite all current data. Are you sure?')) return;
      const success = importData(importText);
      setImportStatus(success ? 'Success! Reloading...' : 'Failed: Invalid JSON');
      if(success) {
          setTimeout(() => window.location.reload(), 1000);
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              if (ev.target?.result) setImportText(ev.target.result as string);
          };
          reader.readAsText(file);
      }
  };

  const renderTabButton = (id: string, label: string, icon: any) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`flex items-center px-4 py-3 font-medium transition-colors ${activeTab === id ? 'bg-blue-600 text-white rounded-lg shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg'}`}
      >
          {React.createElement(icon, { className: "w-4 h-4 mr-2" })}
          {label}
      </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">System Settings</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage users, security, and data.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 flex flex-col space-y-2 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm h-fit">
              {renderTabButton('users', 'User Management', Users)}
              {renderTabButton('security', 'Security & Whitelist', Shield)}
              {renderTabButton('data', 'Data Backup', Database)}
              {renderTabButton('info', 'System Info', Activity)}
          </div>

          {/* Content */}
          <div className="flex-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm min-h-[500px]">
              
              {/* --- USERS TAB --- */}
              {activeTab === 'users' && (
                  <div>
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Users</h3>
                          <button onClick={() => openUserModal()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
                              <Plus className="w-4 h-4 mr-2" /> Add User
                          </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                            <thead className="bg-gray-50 dark:bg-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Last Login</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{u.username}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{u.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300"><span className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">{u.role}</span></td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {u.isActive ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                            <button onClick={() => openUserModal(u)} className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400"><Edit2 className="w-4 h-4"/></button>
                                            <button onClick={() => deleteUser(u.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400"><Trash2 className="w-4 h-4"/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                      </div>
                  </div>
              )}

              {/* --- SECURITY TAB --- */}
              {activeTab === 'security' && (
                  <div>
                      <div className="mb-8 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-lg">
                          <h4 className="flex items-center font-bold text-orange-800 dark:text-orange-200 mb-2">
                             <AlertTriangle className="w-5 h-5 mr-2" /> IP Whitelist Mode
                          </h4>
                          <p className="text-sm text-orange-700 dark:text-orange-300">
                              Adding IPs here will restrict login access ONLY to these IPs. 
                              Current IP: <strong>{currentIp}</strong>. 
                              Ensure you add your current IP before logging out!
                          </p>
                      </div>

                      <div className="flex gap-4 mb-6">
                          <input 
                            type="text" 
                            placeholder="IP Address (e.g., 192.168.1.1)" 
                            value={wlIp}
                            onChange={(e) => setWlIp(e.target.value)}
                            className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg p-2"
                          />
                          <input 
                            type="text" 
                            placeholder="Description (e.g., Office WiFi)" 
                            value={wlDesc}
                            onChange={(e) => setWlDesc(e.target.value)}
                            className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg p-2"
                          />
                          <button onClick={handleWhitelistSubmit} className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700 font-medium">Add IP</button>
                      </div>

                      <div className="mb-8">
                          <h4 className="font-bold text-gray-800 dark:text-white mb-4">Allowed IPs</h4>
                          {whitelist.length === 0 ? (
                              <p className="text-gray-400 italic">No restrictions. All IPs allowed.</p>
                          ) : (
                              <ul className="space-y-2">
                                  {whitelist.map(w => (
                                      <li key={w.id} className="flex justify-between items-center bg-gray-50 dark:bg-slate-700 p-3 rounded-lg border border-gray-100 dark:border-slate-600">
                                          <div>
                                              <span className="font-mono font-bold text-gray-800 dark:text-white mr-3">{w.ip}</span>
                                              <span className="text-sm text-gray-500 dark:text-gray-400">{w.description}</span>
                                          </div>
                                          <button onClick={() => removeFromWhitelist(w.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4"/></button>
                                      </li>
                                  ))}
                              </ul>
                          )}
                      </div>

                      <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                           <h4 className="font-bold text-gray-800 dark:text-white mb-4">Recent Active Sessions</h4>
                           <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700 text-sm">
                                  <thead>
                                      <tr>
                                          <th className="text-left py-2">User</th>
                                          <th className="text-left py-2">IP Address</th>
                                          <th className="text-left py-2">Time</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {sessions.map(s => (
                                          <tr key={s.id}>
                                              <td className="py-2 text-gray-900 dark:text-white">{s.userName}</td>
                                              <td className="py-2 text-gray-600 dark:text-gray-300 font-mono">{s.ipAddress}</td>
                                              <td className="py-2 text-gray-500 dark:text-gray-400">{new Date(s.loginTime).toLocaleString()}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                           </div>
                      </div>
                  </div>
              )}

              {/* --- DATA TAB --- */}
              {activeTab === 'data' && (
                  <div className="space-y-8">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                          <h4 className="flex items-center text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">
                             <Download className="w-5 h-5 mr-2" /> Export / Backup
                          </h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                              Download a complete JSON snapshot of the database. Useful for backups or migrating to another device.
                          </p>
                          <button onClick={exportData} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm font-medium">
                              Download All Data
                          </button>
                      </div>

                      <div className="bg-gray-50 dark:bg-slate-700/30 p-6 rounded-xl border border-gray-200 dark:border-slate-600">
                          <h4 className="flex items-center text-lg font-bold text-gray-800 dark:text-white mb-2">
                             <Upload className="w-5 h-5 mr-2" /> Import / Restore
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                              Restore data from a JSON file. <strong>Warning: This replaces existing data.</strong>
                          </p>
                          
                          <div className="flex gap-4 mb-4">
                               <input type="file" accept=".json" onChange={handleFileUpload} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                          </div>
                          
                          <textarea 
                             rows={5} 
                             value={importText} 
                             onChange={(e) => setImportText(e.target.value)} 
                             className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg p-3 font-mono text-xs mb-4"
                             placeholder="Or paste JSON content here..."
                          />

                          <button onClick={handleImport} className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 shadow-sm font-medium" disabled={!importText}>
                              Restore Data
                          </button>
                          {importStatus && <p className="mt-2 text-sm font-bold text-green-600">{importStatus}</p>}
                      </div>
                  </div>
              )}

              {/* --- INFO TAB --- */}
              {activeTab === 'info' && (
                  <div className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">Network Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center"><Globe className="w-4 h-4 mr-2"/> Public IP Address</p>
                              <p className="text-xl font-mono font-bold text-gray-800 dark:text-white">{currentIp}</p>
                          </div>
                          <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center"><Monitor className="w-4 h-4 mr-2"/> User Agent</p>
                              <p className="text-sm font-mono text-gray-800 dark:text-white break-words">{navigator.userAgent}</p>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b dark:border-slate-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingUser ? 'Edit User' : 'New User'}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X />
              </button>
            </div>
            <form onSubmit={handleUserSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input required type="text" value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} className="w-full bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 rounded-lg shadow-sm border p-2 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password {editingUser && '(Leave blank to keep current)'}</label>
                <input type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 rounded-lg shadow-sm border p-2 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input required type="text" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 rounded-lg shadow-sm border p-2 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value as UserRole})} className="w-full bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 rounded-lg shadow-sm border p-2 dark:text-white">
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.USER}>User (Employee)</option>
                    <option value={UserRole.CUSTOMER}>Customer</option>
                </select>
              </div>
              <div className="flex items-center">
                  <input type="checkbox" checked={userForm.isActive} onChange={e => setUserForm({...userForm, isActive: e.target.checked})} className="mr-2" />
                  <label className="text-sm text-gray-700 dark:text-gray-300">Active Account</label>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;