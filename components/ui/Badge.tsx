
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
  className?: string;
  pulse?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '', pulse = false }) => {
  const styles = {
    neutral: "bg-slate-100 text-slate-500",
    primary: "bg-red-50 text-[#E23744]",
    success: "bg-green-50 text-green-600",
    warning: "bg-amber-50 text-amber-600",
    error: "bg-red-50 text-red-600",
    outline: "border border-slate-100 text-slate-400"
  };

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
      ${styles[variant]}
      ${pulse ? 'animate-pulse' : ''}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;
