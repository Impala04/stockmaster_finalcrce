
import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Box, ArrowLeftRight, History, Settings, LogOut, X, Clock } from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  isOpen: boolean;
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  onCloseMobile: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  currentView, 
  onViewChange, 
  onCloseMobile,
  onLogout
}) => {
  
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.OPERATIONS, label: 'Operations', icon: ArrowLeftRight },
    { id: ViewState.PENDING_ORDERS, label: 'Pending Orders', icon: Clock },
    { id: ViewState.STOCK, label: 'Stock', icon: Box },
    { id: ViewState.MOVE_HISTORY, label: 'Move History', icon: History },
    { id: ViewState.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onCloseMobile}
      />

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen bg-surface border-r border-border
          transition-transform duration-300 ease-in-out
          w-[260px] 
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-border justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 text-primary" />
            <span className="font-bold text-lg tracking-tight text-text font-brand">StockMaster</span>
          </div>
          <button className="lg:hidden text-muted" onClick={onCloseMobile}>
            <X size={24} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-muted uppercase tracking-wider mb-4">Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  if (window.innerWidth < 1024) onCloseMobile();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150
                  ${isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-text'
                  }
                `}
              >
                <Icon size={20} strokeWidth={2} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};