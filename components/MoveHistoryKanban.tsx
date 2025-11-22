
import React from 'react';
import { MoveHistoryItem } from '../types';
import { ArrowRight, ArrowDownRight, ArrowUpRight, ArrowLeftRight, Clock } from 'lucide-react';

interface MoveHistoryKanbanProps {
  history: MoveHistoryItem[];
}

export const MoveHistoryKanban: React.FC<MoveHistoryKanbanProps> = ({ history }) => {
  // Group by status or simplified stages
  const stages = [
    { id: 'Ready', label: 'Ready' },
    { id: 'Done', label: 'Completed' }
  ];

  return (
    <div className="flex h-full overflow-x-auto p-4 gap-4 bg-black/5 dark:bg-white/5">
      {stages.map(stage => {
        const items = history.filter(h => h.status === stage.id);
        
        return (
          <div key={stage.id} className="min-w-[320px] w-[350px] flex flex-col rounded-xl bg-bg/50 border border-border/50 backdrop-blur-sm h-full">
            {/* Column Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-surface/80 rounded-t-xl sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stage.id === 'Done' ? 'bg-accent' : 'bg-primary'}`}></div>
                <h3 className="font-bold text-text">{stage.label}</h3>
              </div>
              <span className="px-2.5 py-0.5 bg-black/10 dark:bg-white/10 rounded-full text-xs font-semibold text-muted">
                {items.length}
              </span>
            </div>

            {/* Column Body */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
              {items.map(item => (
                <div 
                  key={item.id} 
                  className="bg-surface p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer hover:-translate-y-0.5"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-muted uppercase tracking-wider bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">
                      {item.reference}
                    </span>
                    <div className={`flex items-center gap-1 text-xs font-bold ${
                        item.type === 'In' ? 'text-accent' : 
                        item.type === 'Out' ? 'text-danger' : 'text-primary'
                      }`}>
                      {item.type === 'In' ? <ArrowDownRight size={14}/> :
                       item.type === 'Out' ? <ArrowUpRight size={14}/> :
                       <ArrowLeftRight size={14}/>}
                      {item.type.toUpperCase()}
                    </div>
                  </div>

                  <h4 className="font-medium text-text text-sm mb-3 line-clamp-2">{item.product}</h4>

                  <div className="bg-black/5 dark:bg-white/5 rounded-md p-2 mb-3">
                    <div className="flex items-center justify-between text-xs text-muted">
                       <span className="truncate max-w-[40%]">{item.from}</span>
                       <ArrowRight size={12} className="flex-shrink-0 mx-1 text-muted/50" />
                       <span className="truncate max-w-[40%] text-right">{item.to}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-dashed border-border">
                    <div className="flex items-center gap-1 text-xs text-muted">
                       <Clock size={12} />
                       {item.date}
                    </div>
                    <span className="font-bold text-sm text-text">{item.quantity} units</span>
                  </div>
                </div>
              ))}
              
              {items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-muted opacity-60">
                  <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-2">
                    <Clock size={20} />
                  </div>
                  <p className="text-xs italic">No items in {stage.label}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
