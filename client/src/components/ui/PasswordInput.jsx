import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export const PasswordInput = ({
  label = 'Password',
  id = 'password',
  name = 'password',
  value,
  onChange,
  placeholder = '••••••••',
  required = true,
  error,
  className = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-royal-black/80">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-royal-black/40">
          <Lock className="w-4 h-4" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`block w-full rounded-lg border bg-white pl-10 pr-10 py-2.5 text-sm text-royal-black placeholder-zinc-400 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold ${
            error ? 'border-red-400 bg-red-50/20' : 'border-zinc-300'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-royal-black transition-colors"
          title={showPassword ? 'Hide password' : 'Show password'}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
