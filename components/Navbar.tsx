
import React, { useState, useRef, useEffect } from 'react';
import { User, Operation, Product } from '../types';
import { Menu, Bell, Search, ChevronDown, Sun, Moon, LogOut, TrendingUp, Clock, Package, CreditCard, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  user: User;
  onMenuClick: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout?: () => void;
  searchTerm?: string;
  onSearch?: (term: string) => void;
  stats?: {
    totalValue: number;
    pendingCount: number;
    recentOperations: Operation[];
    products: Product[]; // Needed to calculate operation values
  };
  onNavigate?: (view: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onMenuClick, isDarkMode, toggleTheme, onLogout, searchTerm, onSearch, stats, onNavigate }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Mock notifications state for "Mark all read"
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, title: 'Low Stock Alert', desc: 'Wireless Headphones below reorder point (15 remaining)', time: '10m ago', type: 'alert' },
    { id: 2, title: 'Receipt Completed', desc: 'WH/IN/0001 validated by Sarah', time: '1h ago', type: 'success' },
    { id: 3, title: 'New Order', desc: 'Delivery order #1234 needs packing', time: '2h ago', type: 'info' },
  ]);

  const handleMarkAllRead = () => {
    setNotificationsList([]);
    setIsNotificationsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper to calculate operation value based on products
  const getOperationValue = (op: Operation) => {
    if (!stats?.products) return 0;
    return op.lines.reduce((acc, line) => {
      const product = stats.products.find(p => p.id === line.productId);
      return acc + (line.demand * (product?.unitPrice || 0));
    }, 0);
  };

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-colors duration-300">
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 text-muted hover:bg-black/5 dark:hover:bg-white/5 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        
        {/* Desktop Search */}
        <div className="hidden md:flex items-center relative w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search inventory, orders, SKUs..." 
            value={searchTerm || ''}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-md border border-border bg-bg focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm transition-all placeholder-muted text-text"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-muted hover:text-primary transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative p-2 text-muted hover:text-primary transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5 ${isNotificationsOpen ? 'bg-primary/10 text-primary' : ''}`}
          >
            <Bell size={20} />
            {notificationsList.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-surface"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in-up">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold text-text">Notifications</h3>
                {notificationsList.length > 0 && (
                   <button onClick={handleMarkAllRead} className="text-xs text-primary font-medium cursor-pointer hover:underline">Mark all read</button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notificationsList.length > 0 ? (
                  notificationsList.map((notif) => (
                    <div key={notif.id} className="p-4 border-b border-border last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-3 items-start">
                      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notif.type === 'alert' ? 'bg-danger' : notif.type === 'success' ? 'bg-accent' : 'bg-primary'}`} />
                      <div>
                        <p className="text-sm font-medium text-text leading-none mb-1">{notif.title}</p>
                        <p className="text-xs text-muted mb-1">{notif.desc}</p>
                        <p className="text-[10px] text-muted/70 uppercase">{notif.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted text-sm">
                    No new notifications
                  </div>
                )}
              </div>
              <div className="p-3 bg-black/5 dark:bg-white/5 text-center border-t border-border">
                <button 
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    if(onNavigate) onNavigate('PENDING_ORDERS');
                  }}
                  className="text-xs font-medium text-text hover:text-primary transition-colors"
                >
                  View all activity
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-border hidden sm:block mx-2"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 p-1.5 rounded-lg transition-colors ${isProfileOpen ? 'bg-black/5 dark:bg-white/5' : ''}`}
          >
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-8 h-8 rounded-full object-cover border border-border"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-text">{user.name}</p>
              <p className="text-xs text-muted">{user.role}</p>
            </div>
            <ChevronDown size={16} className={`text-muted hidden sm:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-96 bg-surface border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-up ring-1 ring-black/5">
              
              {/* Header */}
              <div className="p-6 border-b border-border bg-black/5 dark:bg-white/5">
                <div className="flex items-center gap-4">
                  <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full border-4 border-surface shadow-sm object-cover"/>
                  <div>
                    <h3 className="font-bold text-lg text-text">{user.name}</h3>
                    <p className="text-sm text-muted">{user.email}</p>
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Investments & Stats */}
              <div className="p-4 grid grid-cols-2 gap-3 border-b border-border bg-surface">
                <div className="p-3 rounded-xl bg-accent/5 border border-accent/10">
                  <div className="flex items-center gap-2 text-accent mb-1">
                    <TrendingUp size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Investments</span>
                  </div>
                  <p className="text-lg font-bold text-text">₹{(stats?.totalValue || 0).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-muted">Total Inventory Value</p>
                </div>
                <div className="p-3 rounded-xl bg-warning/5 border border-warning/10">
                   <div className="flex items-center gap-2 text-warning mb-1">
                    <Clock size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
                  </div>
                  <p className="text-lg font-bold text-text">{stats?.pendingCount || 0} Orders</p>
                  <p className="text-xs text-muted">Requires Action</p>
                </div>
              </div>

              {/* Recent Transactions / Orders */}
              <div className="p-0">
                 <div className="px-4 py-3 border-b border-border bg-black/5 dark:bg-white/5 flex justify-between items-center">
                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                      <CreditCard size={14}/> Recent Transactions
                    </h4>
                    <button 
                      onClick={() => {
                         setIsProfileOpen(false);
                         if(onNavigate) onNavigate('OPERATIONS');
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      View All
                    </button>
                 </div>
                 <div className="max-h-[240px] overflow-y-auto">
                    {stats?.recentOperations.map(op => (
                      <div key={op.id} className="px-4 py-3 border-b border-border last:border-0 hover:bg-black/5 dark:hover:bg-white/5 flex justify-between items-center group cursor-pointer transition-colors">
                         <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${op.type === 'Receipt' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                               {op.type === 'Receipt' ? <Package size={16}/> : <CreditCard size={16}/>}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text">{op.reference}</p>
                              <p className="text-xs text-muted">{op.contact}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className={`text-sm font-bold ${op.type === 'Receipt' ? 'text-danger' : 'text-accent'}`}>
                              {op.type === 'Receipt' ? '-' : '+'} ₹{getOperationValue(op).toLocaleString('en-IN')}
                            </p>
                            <p className="text-[10px] text-muted">{op.status}</p>
                         </div>
                      </div>
                    ))}
                    {(!stats?.recentOperations || stats.recentOperations.length === 0) && (
                      <div className="p-4 text-center text-sm text-muted">No recent activity</div>
                    )}
                 </div>
              </div>

              {/* Footer */}
              <div className="p-2 border-t border-border bg-surface">
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/5 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
