
import React, { useState, useEffect, useRef } from 'react';
import { ViewState, Product, User } from './types';
import { MOCK_USER, MOCK_KPIS, MOCK_PRODUCTS, MOCK_MOVE_HISTORY, MOCK_OPERATIONS, GLOBAL_STYLES } from './constants';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { KPICard } from './components/KPICard';
import { InventoryTable } from './components/InventoryTable';
import { OperationsTable } from './components/OperationsTable';
import { MoveHistoryTable } from './components/MoveHistoryTable';
import { MoveHistoryKanban } from './components/MoveHistoryKanban';
import { PendingOrdersView } from './components/PendingOrdersView';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Logo } from './components/Logo';
import { ChatBot } from './components/ChatBot';
import { Clock, ArrowLeftRight, Box, Lock, Search, List, LayoutGrid, User as UserIcon, Save, X, Upload, Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LOGIN);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<User>(MOCK_USER);
  
  // Login / Signup State
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  
  // Settings state
  const [settingsTab, setSettingsTab] = useState<'profile' | 'warehouse' | 'location'>('profile');
  const [profileForm, setProfileForm] = useState({
    name: MOCK_USER.name,
    email: MOCK_USER.email,
    avatarUrl: MOCK_USER.avatarUrl || '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Stock State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Operations State
  const [operationsFilter, setOperationsFilter] = useState<'all' | 'receipt' | 'delivery'>('all');

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Category Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Derive categories
  const uniqueCategories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Sync profile form when user changes
  useEffect(() => {
    setProfileForm({
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || '',
    });
  }, [user]);

  const handleSaveProfile = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser(prev => ({
        ...prev,
        name: profileForm.name,
        email: profileForm.email,
        avatarUrl: profileForm.avatarUrl
      }));
      setIsLoading(false);
    }, 600);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Move History state
  const [historyViewMode, setHistoryViewMode] = useState<'list' | 'kanban'>('list');

  // Inject Global Styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = GLOBAL_STYLES;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle Dark Mode Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    if (isSignUp && !signupName) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (isSignUp) {
        // If signing up, update the mock user with the new details
        setUser({
          ...MOCK_USER,
          name: signupName,
          email: loginEmail,
          // Keep mock avatar or set a default
        });
      }
      setCurrentView(ViewState.DASHBOARD);
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    // Clear credentials on logout to ensure security
    setLoginEmail('');
    setLoginPassword('');
    setSignupName('');
    setIsSignUp(false); // Reset to login view
    setCurrentView(ViewState.LOGIN);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleEditStock = (product: Product) => {
    setEditingProduct(product);
    setEditForm({ ...product });
  };

  const handleAddNewProduct = () => {
     // Create a blank product template
     const newProduct: Product = {
       id: '', // Will be generated on save
       sku: '',
       name: '',
       category: 'General',
       stockLevel: 0,
       available: 0,
       reorderPoint: 10,
       unitPrice: 0,
       status: 'Out of Stock',
       lastUpdated: new Date().toISOString().split('T')[0]
     };
     setEditingProduct(newProduct);
     setEditForm(newProduct);
  };

  const handleSaveStock = () => {
    if (!editingProduct) return;
    
    if (editingProduct.id === '') {
        // Creating new product
        const newId = (Math.max(...products.map(p => parseInt(p.id) || 0)) + 1).toString();
        const newProduct = {
            ...editingProduct,
            ...editForm,
            id: newId,
            lastUpdated: new Date().toISOString().split('T')[0]
        } as Product;
        
        // Determine status based on stock level
        if (newProduct.stockLevel <= 0) newProduct.status = 'Out of Stock';
        else if (newProduct.stockLevel <= newProduct.reorderPoint) newProduct.status = 'Low Stock';
        else newProduct.status = 'In Stock';

        setProducts([...products, newProduct]);
    } else {
        // Updating existing product
        const updatedProducts = products.map(p => 
            p.id === editingProduct.id 
              ? { 
                  ...p, 
                  ...editForm,
                  lastUpdated: new Date().toISOString().split('T')[0]
                } as Product 
              : p
          );
          setProducts(updatedProducts);
    }
    
    // Close modal
    setEditingProduct(null);
    setEditForm({});
  };

  // Search Logic
  const getFilteredProducts = () => {
    let filtered = products;

    // Filter by Category
    if (selectedCategory !== 'All') {
        filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (!searchTerm) return filtered;
    const term = searchTerm.toLowerCase();
    return filtered.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.sku.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  };

  const getFilteredOperations = (ops: typeof MOCK_OPERATIONS) => {
    if (!searchTerm) return ops;
    const term = searchTerm.toLowerCase();
    return ops.filter(op => 
      op.reference.toLowerCase().includes(term) || 
      op.contact.toLowerCase().includes(term) ||
      op.status.toLowerCase().includes(term)
    );
  };

  const getFilteredHistory = () => {
    if (!searchTerm) return MOCK_MOVE_HISTORY;
    const term = searchTerm.toLowerCase();
    return MOCK_MOVE_HISTORY.filter(h => 
      h.product.toLowerCase().includes(term) ||
      h.reference.toLowerCase().includes(term) ||
      h.from.toLowerCase().includes(term) ||
      h.to.toLowerCase().includes(term)
    );
  };


  // Calculate Stats for Navbar
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.unitPrice * p.stockLevel), 0);
  const pendingOrdersCount = MOCK_OPERATIONS.filter(op => op.status !== 'Done' && op.status !== 'Cancelled').length;
  const recentOperations = MOCK_OPERATIONS.slice(0, 4);

  // KPI Calculation Logic with Dynamic Updates
  const lowStockCount = products.filter(p => p.stockLevel <= p.reorderPoint).length;

  const dashboardKPIs = MOCK_KPIS.map(kpi => {
    if (kpi.id === '2') {
      return { 
        ...kpi, 
        value: lowStockCount.toString(), 
        isLowStock: lowStockCount > 0 
      };
    }
    if (kpi.id === '4') {
       // Ensure dashboard total valuation matches real calculation
       return {
         ...kpi,
         value: `₹${totalInventoryValue.toLocaleString('en-IN')}`
       }
    }
    return kpi;
  });

  if (currentView === ViewState.LOGIN) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg p-4 transition-colors duration-300">
        <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-lg border border-border transition-colors duration-300">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-6 p-3 bg-primary/5 rounded-2xl shadow-sm border border-primary/10">
              <Logo className="w-16 h-16 text-primary" size={64} />
            </div>
            <h1 className="text-3xl font-bold text-text font-brand tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">StockMaster</h1>
            <p className="text-sm font-medium text-primary mt-1 tracking-wide uppercase text-[10px] bg-primary/10 px-2 py-0.5 rounded-full">
               Precision Inventory Control & Real-Time Analytics
            </p>
            <p className="text-muted text-sm mt-4">
              {isSignUp ? 'Create a new account' : 'Sign in to access your inventory'}
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {isSignUp && (
              <Input 
                label="Full Name" 
                type="text" 
                placeholder="John Doe" 
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required={isSignUp}
              />
            )}
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="you@company.com" 
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required 
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required 
            />
            <Button type="submit" className="w-full" isLoading={isLoading} disabled={!loginEmail || !loginPassword || (isSignUp && !signupName)}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

           <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted mb-2">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </p>
              <button 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setLoginEmail('');
                  setLoginPassword('');
                  setSignupName('');
                }}
                className="text-primary font-medium hover:underline text-sm"
              >
                {isSignUp ? 'Sign In to existing account' : 'Create a new account'}
              </button>
           </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-text font-brand">Hello, {user.name}</h2>
              <p className="text-muted">Overview of your inventory status</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardKPIs.map((kpi) => (
                <KPICard key={kpi.id} kpi={kpi} />
              ))}
            </div>

            {/* Recent Products */}
            <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text">Recent Products</h3>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentView(ViewState.STOCK)}>View All</Button>
                </div>
                <InventoryTable products={products.slice(0, 5)} />
            </div>

            {/* Features Section */}
            <div className="mt-8 pt-8 border-t border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <button 
                    onClick={() => setCurrentView(ViewState.STOCK)}
                    className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group text-left w-full cursor-pointer"
                >
                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Clock size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-text mb-2 group-hover:text-primary transition-colors">Real-Time Sync</h3>
                    <p className="text-sm text-muted leading-relaxed">
                    Instant inventory updates across all channels. Never oversell with our sub-second latency tracking engine.
                    </p>
                </button>

                {/* Feature 2 */}
                <button 
                    onClick={() => setCurrentView(ViewState.MOVE_HISTORY)}
                    className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group text-left w-full cursor-pointer"
                >
                    <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-5 group-hover:scale-110 transition-transform duration-300">
                    <ArrowLeftRight size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-text mb-2 group-hover:text-accent transition-colors">Granular Audit</h3>
                    <p className="text-sm text-muted leading-relaxed">
                    Complete transparency with detailed movement history. Track every item from receipt to delivery.
                    </p>
                </button>

                {/* Feature 3 */}
                <button 
                    onClick={() => setCurrentView(ViewState.OPERATIONS)}
                    className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group text-left w-full cursor-pointer"
                >
                    <div className="h-12 w-12 bg-primary-700/10 rounded-xl flex items-center justify-center text-primary-700 mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Box size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-text mb-2 group-hover:text-primary-700 transition-colors">Multi-Warehouse</h3>
                    <p className="text-sm text-muted leading-relaxed">
                    Scale effortlessly. Manage stock across infinite locations and zones with intelligent routing.
                    </p>
                </button>
                </div>
            </div>
          </div>
        );
      
      case ViewState.STOCK:
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-text">Stock Management</h2>
                <p className="text-muted">Manage your product inventory</p>
              </div>
              <Button onClick={handleAddNewProduct} leftIcon={<Box size={18} />}>Add Product</Button>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-2 overflow-x-auto pb-2">
               {uniqueCategories.map(cat => (
                 <button
                   key={cat}
                   onClick={() => setSelectedCategory(cat)}
                   className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                     selectedCategory === cat 
                       ? 'bg-primary text-white shadow-md' 
                       : 'bg-surface text-muted border border-border hover:border-primary/50 hover:text-primary'
                   }`}
                 >
                   {cat}
                 </button>
               ))}
            </div>

            <InventoryTable 
              products={getFilteredProducts()} 
              onEditStock={handleEditStock}
            />
          </div>
        );
      
      case ViewState.OPERATIONS:
        const allOps = MOCK_OPERATIONS.filter(op => operationsFilter === 'all' || op.type.toLowerCase() === operationsFilter);
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                  <h2 className="text-2xl font-bold text-text">Operations</h2>
                  <p className="text-muted">Manage receipts and deliveries</p>
               </div>
               <div className="flex gap-2 bg-surface p-1 rounded-lg border border-border">
                  <button 
                    onClick={() => setOperationsFilter('all')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${operationsFilter === 'all' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setOperationsFilter('receipt')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${operationsFilter === 'receipt' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'}`}
                  >
                    Receipts
                  </button>
                  <button 
                    onClick={() => setOperationsFilter('delivery')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${operationsFilter === 'delivery' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'}`}
                  >
                    Deliveries
                  </button>
               </div>
            </div>
            
            <OperationsTable 
              operations={getFilteredOperations(allOps)} 
            />
          </div>
        );

      case ViewState.PENDING_ORDERS:
        return <PendingOrdersView />;

      case ViewState.SETTINGS:
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Header / Tabs */}
            <div className="flex items-center gap-8 border-b border-border pb-0 overflow-x-auto">
               <div className="flex gap-6 min-w-max">
                  <button 
                    onClick={() => setSettingsTab('profile')} 
                    className={`pb-3 text-lg font-brand transition-colors flex items-center gap-2 ${
                      settingsTab === 'profile' 
                        ? 'text-danger border-b-2 border-danger font-bold' 
                        : 'text-muted hover:text-text'
                    }`}
                  >
                    <UserIcon size={18} />
                    Profile
                  </button>
                  <button 
                    onClick={() => setSettingsTab('warehouse')} 
                    className={`pb-3 text-lg font-brand transition-colors ${
                      settingsTab === 'warehouse' 
                        ? 'text-danger border-b-2 border-danger font-bold' 
                        : 'text-muted hover:text-text'
                    }`}
                  >
                    Warehouse
                  </button>
                  <button 
                    onClick={() => setSettingsTab('location')} 
                    className={`pb-3 text-lg font-brand transition-colors ${
                      settingsTab === 'location' 
                        ? 'text-danger border-b-2 border-danger font-bold' 
                        : 'text-muted hover:text-text'
                    }`}
                  >
                    Location
                  </button>
               </div>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6 max-w-3xl shadow-sm">
              
              {settingsTab === 'profile' && (
                <div className="space-y-8 animate-fade-in">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xl text-danger font-brand font-bold">My Profile</h3>
                      <Button onClick={handleSaveProfile} isLoading={isLoading} leftIcon={<Save size={18} />} className="bg-danger hover:bg-red-600">
                        Save Changes
                      </Button>
                   </div>
                   
                   <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex flex-col items-center gap-4">
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleFileUpload}
                        />
                        <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                          <img 
                            src={profileForm.avatarUrl || 'https://via.placeholder.com/150'} 
                            alt="Profile Preview" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-surface shadow-md transition-opacity duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                             <Upload size={24} className="text-white mb-1" />
                             <span className="text-white text-xs font-medium">Change</span>
                          </div>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={triggerFileInput}
                          leftIcon={<ImageIcon size={14} />}
                          className="border-danger/30 text-danger hover:bg-danger/5"
                        >
                          Upload New Photo
                        </Button>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <Input 
                            label="Display Name" 
                            value={profileForm.name} 
                            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                            className="border-danger/30 focus:border-danger focus:ring-danger/20" 
                          />
                          <Input 
                            label="Email Address" 
                            type="email"
                            value={profileForm.email} 
                            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                            className="border-danger/30 focus:border-danger focus:ring-danger/20" 
                          />
                           <Input 
                            label="Or link via URL" 
                            value={profileForm.avatarUrl} 
                            onChange={(e) => setProfileForm({...profileForm, avatarUrl: e.target.value})}
                            placeholder="https://example.com/avatar.jpg"
                            helperText="Upload a photo above or enter a direct image URL."
                            className="border-danger/30 focus:border-danger focus:ring-danger/20" 
                          />
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {settingsTab === 'warehouse' && (
                 <div className="space-y-6 animate-fade-in">
                    <h3 className="text-xl text-danger font-brand font-bold">Warehouse</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="text-danger font-medium md:col-span-1">Name:</label>
                        <div className="md:col-span-2">
                          <Input placeholder="Main Warehouse" className="border-danger/30 focus:border-danger focus:ring-danger/20" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="text-danger font-medium md:col-span-1">Short Code:</label>
                        <div className="md:col-span-2">
                          <Input placeholder="WH" className="border-danger/30 focus:border-danger focus:ring-danger/20" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="text-danger font-medium md:col-span-1">Address:</label>
                        <div className="md:col-span-2">
                          <Input placeholder="123 Warehouse St, Ind. Zone" className="border-danger/30 focus:border-danger focus:ring-danger/20" />
                        </div>
                      </div>
                    </div>
                 </div>
              )}

              {settingsTab === 'location' && (
                 <div className="space-y-6 animate-fade-in">
                    <h3 className="text-xl text-danger font-brand font-bold">Location</h3>
                    <div className="space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="text-danger font-medium md:col-span-1">Name:</label>
                        <div className="md:col-span-2">
                          <Input placeholder="Stock Shelf 1" className="border-danger/30 focus:border-danger focus:ring-danger/20" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="text-danger font-medium md:col-span-1">Short Code:</label>
                        <div className="md:col-span-2">
                          <Input placeholder="WH/STOCK/1" className="border-danger/30 focus:border-danger focus:ring-danger/20" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="text-danger font-medium md:col-span-1">Warehouse:</label>
                        <div className="md:col-span-2">
                          <Input placeholder="WH" className="border-danger/30 focus:border-danger focus:ring-danger/20" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1"></div>
                        <div className="md:col-span-2">
                           <p className="text-muted text-sm italic">This holds the multiple locations of warehouse, rooms etc..</p>
                        </div>
                      </div>
                    </div>
                 </div>
              )}
            </div>
          </div>
        );

      case ViewState.MOVE_HISTORY:
        return (
           <div className="space-y-4 h-[calc(100vh-140px)] flex flex-col animate-fade-in">
             <div className="flex flex-col md:flex-row md:items-center justify-between border border-danger/40 rounded-xl p-4 bg-surface shadow-sm gap-4"> 
               <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-brand text-danger font-bold">Move History</h2>
               </div>
               <div className="flex items-center gap-3">
                  <div className="relative group w-full md:w-auto">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-danger group-focus-within:text-danger/80" />
                      <input 
                        className="pl-10 h-10 rounded-lg border-2 border-danger/30 bg-transparent focus:border-danger focus:ring-0 text-sm w-full md:w-64 text-text placeholder-muted/70 transition-all" 
                        placeholder="Search history..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
                  <div className="h-8 w-px bg-danger/20 mx-1 hidden md:block"></div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setHistoryViewMode('list')}
                      className={`p-2 rounded-lg border-2 transition-all ${historyViewMode === 'list' ? 'bg-danger text-white border-danger' : 'text-danger border-danger/30 hover:bg-danger/5'}`}
                      title="List View"
                    >
                      <List size={20}/>
                    </button>
                    <button 
                      onClick={() => setHistoryViewMode('kanban')}
                      className={`p-2 rounded-lg border-2 transition-all ${historyViewMode === 'kanban' ? 'bg-danger text-white border-danger' : 'text-danger border-danger/30 hover:bg-danger/5'}`}
                      title="Kanban View"
                    >
                      <LayoutGrid size={20}/>
                    </button>
                  </div>
               </div>
            </div>
            <div className="flex-1 border-2 border-danger/40 rounded-xl overflow-hidden bg-surface shadow-md flex flex-col">
                {historyViewMode === 'list' ? (
                  <MoveHistoryTable history={getFilteredHistory()} />
                ) : (
                  <MoveHistoryKanban history={getFilteredHistory()} />
                )}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted animate-fade-in">
             <Lock size={48} className="mb-4 opacity-20" />
             <h3 className="text-lg font-medium">Access Restricted</h3>
             <p>This module ({currentView}) is currently under development.</p>
             <Button variant="ghost" className="mt-4" onClick={() => setCurrentView(ViewState.DASHBOARD)}>
               Return to Dashboard
             </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg flex transition-colors duration-300">
       <Sidebar 
        isOpen={isMobileMenuOpen} 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col min-w-0 transition-colors duration-300 h-screen">
        <Navbar 
          user={user} 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onLogout={handleLogout}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          stats={{
            totalValue: totalInventoryValue,
            pendingCount: pendingOrdersCount,
            recentOperations: recentOperations,
            products: products
          }}
          onNavigate={setCurrentView}
        />
        
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Edit Stock Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-lg rounded-xl shadow-2xl border border-border overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-xl font-bold text-text font-brand">Update Inventory</h3>
              <button 
                onClick={() => setEditingProduct(null)}
                className="text-muted hover:text-text transition-colors p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex items-start gap-4">
                <div className="p-2 bg-surface rounded-md border border-border shadow-sm">
                  <Box className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-text">{editForm.name}</h4>
                  <p className="text-xs text-muted font-mono mt-1">{editForm.sku}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Stock Level (On Hand)" 
                  type="number" 
                  value={editForm.stockLevel}
                  onChange={(e) => setEditForm({...editForm, stockLevel: parseInt(e.target.value) || 0})}
                  min="0"
                />
                <Input 
                  label="Free to Use" 
                  type="number" 
                  value={editForm.available}
                  onChange={(e) => setEditForm({...editForm, available: parseInt(e.target.value) || 0})}
                  min="0"
                />
                <Input 
                  label="Reorder Point" 
                  type="number" 
                  value={editForm.reorderPoint}
                  onChange={(e) => setEditForm({...editForm, reorderPoint: parseInt(e.target.value) || 0})}
                  min="0"
                />
                <Input 
                  label="Unit Price (₹)" 
                  type="number" 
                  value={editForm.unitPrice}
                  onChange={(e) => setEditForm({...editForm, unitPrice: parseFloat(e.target.value) || 0})}
                  step="0.01"
                  min="0"
                />
              </div>
              
               <div className="grid grid-cols-1">
                 <Input 
                  label="Category" 
                  type="text" 
                  value={editForm.category}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                />
              </div>
            </div>

            <div className="p-6 border-t border-border bg-black/5 dark:bg-white/5 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditingProduct(null)}>Cancel</Button>
              <Button onClick={handleSaveStock} leftIcon={<Save size={18} />}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Assistant */}
      {currentView !== ViewState.LOGIN && <ChatBot showLabel={currentView === ViewState.DASHBOARD} />}
    </div>
  );
};

export default App;
