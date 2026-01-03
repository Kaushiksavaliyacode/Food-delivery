
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverable = true, glass = false }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-[40px] border border-slate-50 bg-white shadow-sm transition-all duration-300
        ${hoverable ? 'hover:shadow-xl hover:border-slate-100 hover:-translate-y-1' : ''}
        ${glass ? 'bg-white/80 backdrop-blur-xl border-white/40' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 pb-0 ${className}`}>{children}</div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 mt-auto border-t border-slate-50 ${className}`}>{children}</div>
);
