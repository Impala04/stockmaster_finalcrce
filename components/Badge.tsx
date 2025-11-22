
import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-accent/10 text-accent border-accent/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  neutral: 'bg-white/5 text-muted border-white/10',
  info: 'bg-primary/10 text-primary border-primary/20',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children }) => {
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border
      ${variantStyles[variant]}
    `}>
      {children}
    </span>
  );
};
