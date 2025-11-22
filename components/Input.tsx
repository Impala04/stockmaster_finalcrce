
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  required,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            block w-full rounded-lg border-border bg-surface text-text 
            placeholder-muted focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none
            disabled:cursor-not-allowed disabled:bg-bg disabled:text-muted
            transition-all duration-200
            ${icon ? 'pl-10' : 'pl-3'}
            ${error ? 'border-danger text-danger focus:border-danger focus:ring-danger/10' : 'border-border'}
            h-[44px] py-3 text-base
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-danger flex items-center gap-1 font-medium" id={`${inputId}-error`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-muted" id={`${inputId}-helper`}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
