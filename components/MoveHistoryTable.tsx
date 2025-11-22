import React from 'react';
import { MoveHistoryItem } from '../types';
import { Badge } from './Badge';
import { ArrowRight, ArrowUpRight, ArrowDownRight, ArrowLeftRight } from 'lucide-react';

interface MoveHistoryTableProps {
  history: MoveHistoryItem[];
}

export const MoveHistoryTable: React.FC<MoveHistoryTableProps> = ({ history }) => {
  
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'In': return <ArrowDownRight size={18} className="text-accent" />;
      case 'Out': return <ArrowUpRight size={18} className="text-danger" />;
      default: return <ArrowLeftRight size={18} className="text-primary" />;
    }
  };

  return (
    <div className="w-full bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black/5 dark:bg-white/5 border-b border-border">
            <tr>
              <th className="h-12 px-6 text-sm font-medium text-muted">Date</th>
              <th className="h-12 px-6 text-sm font-medium text-muted">Reference</th>
              <th className="h-12 px-6 text-sm font-medium text-muted">Product</th>
              <th className="h-12 px-6 text-sm font-medium text-muted">From</th>
              <th className="h-12 px-6 text-sm font-medium text-muted w-8"></th>
              <th className="h-12 px-6 text-sm font-medium text-muted">To</th>
              <th className="h-12 px-6 text-sm font-medium text-muted text-right">Quantity</th>
              <th className="h-12 px-6 text-sm font-medium text-muted">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors h-16">
                 <td className="px-6 py-3 text-sm text-text">{item.date}</td>
                 <td className="px-6 py-3 text-sm font-medium text-text">{item.reference}</td>
                 <td className="px-6 py-3 text-sm text-text">{item.product}</td>
                 <td className="px-6 py-3 text-sm text-muted">{item.from}</td>
                 <td className="px-6 py-3 text-muted">
                    <ArrowRight size={16} />
                 </td>
                 <td className="px-6 py-3 text-sm text-muted">{item.to}</td>
                 <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <span className={`font-semibold ${item.type === 'In' ? 'text-accent' : item.type === 'Out' ? 'text-danger' : 'text-text'}`}>
                            {item.type === 'Out' ? '-' : '+'}{item.quantity}
                        </span>
                        {getTypeIcon(item.type)}
                    </div>
                 </td>
                 <td className="px-6 py-3">
                    <Badge variant="neutral">{item.status}</Badge>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};