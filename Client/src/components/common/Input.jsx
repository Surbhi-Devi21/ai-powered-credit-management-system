import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Modern 2026 SaaS Input Field Component (Linear / Mercury / Stripe style)
 * Features subtle inner shadows, sleek focus rings, crisp prefixes, and validation states.
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      prefix,
      suffix,
      icon: Icon,
      type = 'text',
      id,
      name,
      value,
      onChange,
      placeholder,
      disabled = false,
      required = false,
      className = '',
      wrapperClassName = '',
      inputMode,
      ...props
    },
    ref
  ) => {
    const inputId = id || name || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={`w-full space-y-1.5 ${wrapperClassName}`}>
        {/* Field Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 tracking-tight"
          >
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div
          className={`relative flex items-stretch rounded-xl bg-white transition-all duration-200 border ${
            error
              ? 'border-rose-400 ring-2 ring-rose-500/10'
              : 'border-slate-200/90 shadow-sm focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-accent/20 hover:border-slate-300'
          }`}
        >
          {/* Currency or Static Prefix (e.g., ₹) */}
          {prefix && (
            <span className="inline-flex items-center px-3.5 rounded-l-xl border-r border-slate-200/80 bg-slate-50 text-slate-500 text-sm font-bold select-none">
              {prefix}
            </span>
          )}

          {/* Left Icon */}
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="w-4 h-4" />
            </div>
          )}

          {/* Input Control */}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            inputMode={inputMode}
            className={`block w-full bg-transparent text-slate-900 text-sm placeholder:text-slate-400 transition-colors
              ${prefix ? 'rounded-r-xl pl-3 pr-3.5' : Icon ? 'pl-10 pr-3.5 rounded-xl' : 'px-3.5 rounded-xl'}
              ${suffix ? 'rounded-r-none pr-2' : ''}
              h-10 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed focus:outline-none ${className}`}
            {...props}
          />

          {/* Static Suffix */}
          {suffix && (
            <span className="inline-flex items-center px-3 rounded-r-xl border-l border-slate-200/80 bg-slate-50 text-slate-500 text-xs font-semibold select-none">
              {suffix}
            </span>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-0.5 animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Helper Description */}
        {!error && helperText && (
          <p className="text-xs text-slate-400 leading-relaxed">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
