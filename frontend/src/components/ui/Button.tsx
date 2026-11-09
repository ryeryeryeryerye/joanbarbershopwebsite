import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cta' | 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  ...props
}) => {
  // Hiệu ứng nảy nhẹ khi hover (-translate-y-1 và scale active)
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:pointer-events-none cursor-pointer transform hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:scale-95';

  const variants = {
    // Nút CTA cam chính: nảy lên và tăng độ sáng + đổ bóng cam
    cta: 'bg-cta-orange hover:bg-cta-orange-hover text-white font-semibold tracking-wide shadow-md shadow-orange-950/40 hover:shadow-orange-500/40 hover:brightness-110 focus:ring-orange-500',
    // Nút primary: hover chuyển sang màu cam và nảy nhẹ
    primary:
      'bg-white text-zinc-950 hover:bg-cta-orange hover:text-white hover:border-cta-orange border border-transparent font-semibold hover:shadow-orange-500/30 focus:ring-orange-500',
    // Nút secondary: hover chuyển sang màu cam và nảy nhẹ
    secondary:
      'bg-zinc-800 text-zinc-100 hover:bg-cta-orange hover:text-white border border-zinc-700 hover:border-cta-orange hover:shadow-orange-500/30 focus:ring-orange-500',
    // Nút outline: hover chuyển sang màu cam và nảy nhẹ
    outline:
      'border border-zinc-700 hover:border-cta-orange text-zinc-200 hover:text-white bg-transparent hover:bg-cta-orange hover:shadow-orange-500/30 focus:ring-orange-500',
    // Nút ghost: hover cam nhẹ
    ghost:
      'text-zinc-300 hover:text-white hover:bg-cta-orange hover:shadow-orange-500/20 focus:ring-orange-500',
  };

  const sizes = {
    sm: 'h-9 px-3.5 text-xs uppercase tracking-wider',
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-7 text-sm font-semibold tracking-wide uppercase',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
