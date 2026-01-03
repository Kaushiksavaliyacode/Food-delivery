
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
        relative overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm transition-all duration-300
        ${hoverable ? 'hover:shadow-md' : ''}
        ${glass ? 'bg-white/80 backdrop-blur-xl' : ''}
        ${onClick ? 'cursor-pointer active:scale-98' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 pb-0 ${className}`}>{children}</div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 pt-0 mt-auto border-t border-slate-50 ${className}`}>{children}</div>
);
