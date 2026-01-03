
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ leftIcon, rightIcon, label, error, className = '', ...props }) => {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{label}</label>}
      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#E23744] transition-colors">
            {leftIcon}
          </div>
        )}
        <input
          className={`
            w-full bg-slate-50 border-2 border-transparent focus:border-red-500/10 focus:bg-white 
            rounded-[32px] py-6 outline-none transition-all font-black text-slate-900
            ${leftIcon ? 'pl-16' : 'pl-8'} 
            ${rightIcon ? 'pr-16' : 'pr-8'}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-4">{error}</p>}
    </div>
  );
};

export default Input;
