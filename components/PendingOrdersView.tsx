
import React from 'react';
import { CreditCard, Package, ShieldCheck, Truck, Clock, AlertCircle } from 'lucide-react';

const WORKFLOW_STATUSES = [
  {
    id: 'payment',
    title: 'Payment Authorisation',
    description: 'Secure financial clearance is being established via encrypted banking protocols.',
    icon: CreditCard,
    category: 'Secure Payments'
  },
  {
    id: 'inventory',
    title: 'Inventory Allocation',
    description: 'Stock units are being reserved from the primary fulfillment center.',
    icon: Package,
    category: 'Inventory'
  },
  {
    id: 'quality',
    title: 'Quality Assurance',
    description: 'Items are undergoing mandatory physical inspection prior to dispatch.',
    icon: ShieldCheck,
    category: 'Compliance'
  },
  {
    id: 'logistics',
    title: 'Logistic Coordination',
    description: 'Courier partnership is being finalized for optimal delivery routing.',
    icon: Truck,
    category: 'Logistics'
  }
];

const PENDING_ORDERS = [
  {
    id: 'ORD-2023-8821',
    customer: 'Acme Corp Global',
    items: '50x Wireless Noise-Canceling Headphones',
    value: '₹14,95,000',
    date: 'Oct 26, 2023',
    statusId: 'payment'
  },
  {
    id: 'ORD-2023-8822',
    customer: 'Wayne Enterprises',
    items: '12x Ergonomic Office Chair Pro',
    value: '₹5,40,000',
    date: 'Oct 25, 2023',
    statusId: 'quality'
  },
  {
    id: 'ORD-2023-8823',
    customer: 'Cyberdyne Systems',
    items: '200x Mechanical Keyboard RGB',
    value: '₹2,59,000',
    date: 'Oct 25, 2023',
    statusId: 'inventory'
  },
  {
    id: 'ORD-2023-8824',
    customer: 'Stark Industries',
    items: '5x 27-inch 4K Monitor',
    value: '₹1,74,500',
    date: 'Oct 24, 2023',
    statusId: 'logistics'
  },
  {
    id: 'ORD-2023-8825',
    customer: 'Massive Dynamic',
    items: '100x USB-C Docking Station',
    value: '₹89,900',
    date: 'Oct 24, 2023',
    statusId: 'payment'
  }
];

export const PendingOrdersView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text font-brand">Pending Orders</h2>
        <p className="text-muted">Real-time status of outgoing shipments and processing queues.</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {WORKFLOW_STATUSES.map((status) => {
          const Icon = status.icon;
          return (
            <div key={status.id} className="bg-surface border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/5 text-primary rounded-lg group-hover:bg-primary/10 transition-colors">
                  <Icon size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md">
                  {status.category}
                </span>
              </div>
              <h3 className="font-bold text-text text-sm mb-2">{status.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{status.description}</p>
            </div>
          );
        })}
      </div>

      {/* Orders Table/List */}
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-black/5 dark:bg-white/5 flex items-center gap-2">
           <Clock size={16} className="text-muted" />
           <h3 className="text-sm font-bold text-text uppercase tracking-wider">Processing Queue</h3>
        </div>
        <div className="divide-y divide-border">
          {PENDING_ORDERS.map((order) => {
            const status = WORKFLOW_STATUSES.find(s => s.id === order.statusId);
            const StatusIcon = status?.icon || AlertCircle;
            
            return (
              <div key={order.id} className="p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  
                  <div className="flex items-center gap-4 min-w-[250px]">
                    <div className="h-10 w-10 rounded-lg bg-surface border border-border flex items-center justify-center text-text font-mono text-xs font-bold shadow-sm">
                      {order.customer.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text font-mono">{order.id}</h4>
                      <p className="text-xs text-muted">{order.customer}</p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Items</p>
                    <p className="text-sm text-text font-medium truncate">{order.items}</p>
                  </div>

                  <div className="flex items-center gap-8 min-w-[200px] justify-between md:justify-end">
                     <div>
                        <p className="text-xs text-muted uppercase tracking-wider mb-1">Total</p>
                        <p className="text-sm font-bold text-text">{order.value}</p>
                     </div>
                     
                     <div className="flex items-center gap-3 pl-4 border-l border-border">
                        <div className="text-right hidden sm:block">
                           <p className="text-xs font-bold text-primary">{status?.title}</p>
                           <p className="text-[10px] text-muted">{order.date}</p>
                        </div>
                        <div className="p-2 bg-primary/5 text-primary rounded-full">
                           <StatusIcon size={16} />
                        </div>
                     </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};
