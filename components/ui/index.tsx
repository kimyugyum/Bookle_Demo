'use client';

import { cn } from '@/lib/utils';
import React from 'react';

// ── Button ──────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants = {
    primary:
      'bg-[#1A6B3C] text-white hover:bg-[#155E34] shadow-md shadow-green-900/20',
    secondary:
      'bg-[#E8F5EE] text-[#1A6B3C] hover:bg-[#d4ede0]',
    ghost:
      'text-[#6B7280] hover:bg-gray-100 hover:text-[#374151]',
    outline:
      'border-2 border-[#1A6B3C] text-[#1A6B3C] hover:bg-[#E8F5EE]',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-sm',
    lg: 'h-13 px-8 text-base w-full',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          처리 중...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// ── Input ──────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightElement,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[#374151]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full h-11 rounded-xl border bg-white px-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] transition-all duration-150',
            'border-[#E5E7EB] focus:border-[#1A6B3C] focus:ring-2 focus:ring-[#1A6B3C]/15',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
            leftIcon && 'pl-10',
            rightElement && 'pr-12',
            className
          )}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#9CA3AF]">{hint}</p>}
    </div>
  );
}

// ── ProgressBar ──────────────────────────────────────────────
interface ProgressBarProps {
  current: number;
  total: number;
  labels?: string[];
}

export function ProgressBar({ current, total, labels }: ProgressBarProps) {
  const pct = Math.round(((current - 1) / (total - 1)) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-[#1A6B3C]">
          {current} / {total}
        </span>
        {labels && (
          <span className="text-xs text-[#9CA3AF]">{labels[current - 1]}</span>
        )}
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#E8F5EE] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#1A6B3C] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── StepShell ──────────────────────────────────────────────
interface StepShellProps {
  children: React.ReactNode;
  step?: number;
  totalSteps?: number;
  stepLabels?: string[];
  onBack?: () => void;
  className?: string;
}

export function StepShell({
  children,
  step,
  totalSteps,
  stepLabels,
  onBack,
  className,
}: StepShellProps) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div
        className={cn(
          'w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-900/8 overflow-hidden',
          className
        )}
      >
        {/* Top bar */}
        {(onBack || (step && totalSteps)) && (
          <div className="px-6 pt-6 pb-2 flex items-center gap-4">
            {onBack ? (
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#374151] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                뒤로
              </button>
            ) : (
              <div className="w-10" />
            )}
            {step && totalSteps && (
              <div className="flex-1">
                <ProgressBar
                  current={step}
                  total={totalSteps}
                  labels={stepLabels}
                />
              </div>
            )}
          </div>
        )}
        <div className="p-6 pt-4">{children}</div>
      </div>
    </div>
  );
}

// ── BookCover ──────────────────────────────────────────────
export { BookCover } from './BookCover';

// ── Logo ──────────────────────────────────────────────
import Image from 'next/image';

const LOGO_SIZES = {
  sm: { w: 80,  h: 45  },
  md: { w: 120, h: 68  },
  lg: { w: 180, h: 101 },
};

export function BookleLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const { w, h } = LOGO_SIZES[size];
  return (
    <Image
      src="/logo.png"
      alt="Bookle"
      width={w}
      height={h}
      className="rounded-lg"
    />
  );
}
