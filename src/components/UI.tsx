import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color = 'text-primary' }) => (
  <div className="bg-card p-6 rounded-2xl card-shadow border border-border/50">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-text-muted text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {change && (
          <p className={`text-xs mt-2 font-medium ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {change} <span className="text-text-muted font-normal">vs last month</span>
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl bg-gray-50 ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-text-primary hover:opacity-90",
    outline: "border-2 border-primary text-primary hover:bg-primary/5",
    ghost: "text-text-muted hover:text-primary hover:bg-primary/5"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};
