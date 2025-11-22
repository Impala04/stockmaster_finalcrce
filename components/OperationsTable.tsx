import React from 'react';
import { Operation } from '../types';
import { Badge, BadgeVariant } from './Badge';
import { FileText, Calendar, User } from 'lucide-react';

interface OperationsTableProps {
  operations: Operation[];
}

export const OperationsTable: React.FC<OperationsTableProps> = ({ operations }) => {
  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'Done': return 'success';
      case 'Ready': return 'info';
      case 'Waiting': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <div className="w-full bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black/5 dark:bg-white/5 border-b border-border">
            <tr>
              <th className="h-12 px-6 text-sm font-medium text-muted">Reference</th>
              <th className="h-12 px-6 text-sm font-medium text-muted">Contact</th>
              <th className="h-12 px-6 text-sm font-medium text-muted">Scheduled</th>
              <th className="h-12 px-6 text-sm font-medium text-muted">Source</th>
              <th className="h-12 px-6 text-sm font-medium text-muted">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {operations.map((op) => (
              <tr key={op.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors h-16 group">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-muted" />
                    <span className="font-medium text-text">{op.reference}</span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-muted" />
                    <span className="text-text">{op.contact}</span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted" />
                    <span className="text-text">{op.scheduleDate}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-text">{op.sourceDocument || '-'}</td>
                <td className="px-6 py-3">
                  <Badge variant={getStatusVariant(op.status)}>{op.status}</Badge>
                </td>
              </tr>
            ))}
            {operations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted">
                  No operations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};