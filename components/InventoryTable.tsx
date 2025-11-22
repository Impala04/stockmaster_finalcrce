
import React from 'react';
import { Product } from '../types';
import { Edit2 } from 'lucide-react';

interface InventoryTableProps {
  products: Product[];
  onEditStock?: (product: Product) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ products, onEditStock }) => {
  return (
    <div className="w-full bg-surface rounded-xl shadow-sm border border-border overflow-hidden transition-colors duration-300">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black/5 dark:bg-white/5 border-b border-border">
            <tr>
              <th className="h-16 px-6 text-base font-medium text-text w-[40%]">Product</th>
              <th className="h-16 px-6 text-base font-medium text-text">per unit cost</th>
              <th className="h-16 px-6 text-base font-medium text-text text-center">On hand</th>
              <th className="h-16 px-6 text-base font-medium text-text text-center">free to Use</th>
              <th className="h-16 px-6 w-[60px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product, index) => (
              <tr key={product.id} className={`${index % 2 === 0 ? 'bg-transparent' : 'bg-black/2 dark:bg-white/2'} hover:bg-black/5 dark:hover:bg-white/5 transition-colors h-[64px] group`}>
                <td className="px-6 py-3">
                  <div>
                    <p className="text-base font-medium text-text">{product.name}</p>
                    <p className="text-xs text-muted mt-0.5 font-mono">{product.sku}</p>
                  </div>
                </td>
                <td className="px-6 py-3 text-base text-text">₹{product.unitPrice.toLocaleString('en-IN')}</td>
                <td className="px-6 py-3 text-base text-text text-center font-semibold">{product.stockLevel}</td>
                <td className="px-6 py-3 text-base text-text text-center">{product.available}</td>
                <td className="px-6 py-3 text-right">
                  {onEditStock && (
                    <button 
                      onClick={() => onEditStock(product)}
                      className="text-muted hover:text-primary p-2 rounded-full hover:bg-primary/10 transition-colors"
                      title="Update Stock"
                    >
                      <Edit2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-border">
        {products.map((product) => (
          <div key={product.id} className="p-4 flex flex-col gap-3 bg-surface">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-text text-base">{product.name}</h4>
                <p className="text-xs text-muted font-mono mt-1">{product.sku}</p>
              </div>
              {onEditStock && (
                 <button 
                  onClick={() => onEditStock(product)}
                  className="text-muted hover:text-primary p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
                >
                   <Edit2 size={18} />
                 </button>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2 mt-1 border-t border-dashed border-border">
              <div className="flex flex-col">
                 <span className="text-xs text-muted">Cost</span>
                 <span className="text-sm font-medium text-text">₹{product.unitPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted">On Hand</span>
                <span className="text-sm font-semibold text-text">{product.stockLevel}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted">Free to Use</span>
                <span className="text-sm font-medium text-text">{product.available}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
