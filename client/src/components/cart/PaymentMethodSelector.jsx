import React from 'react';
import { CreditCard, Banknote, Smartphone, Check } from 'lucide-react';

export const PaymentMethodSelector = ({
  paymentMethods = [],
  selectedMethod,
  onSelectMethod,
  transactionId,
  onChangeTransactionId
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wider text-royal-black/80">
        Select Payment Method <span className="text-red-500">*</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {paymentMethods.map(method => {
          const isSelected = selectedMethod?.code === method.code;
          return (
            <div
              key={method.code}
              onClick={() => onSelectMethod(method)}
              className={`relative flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-gold bg-gold/5 shadow-sm'
                  : 'border-zinc-200 bg-white hover:border-zinc-300'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-gold text-royal-black' : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {method.type === 'cod' && <Banknote className="w-5 h-5" />}
                {method.type === 'mobile_banking' && <Smartphone className="w-5 h-5" />}
                {method.type === 'bank_transfer' && <CreditCard className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-royal-black truncate">{method.name}</p>
                {method.accountNumber && (
                  <p className="text-[11px] text-zinc-500">No: {method.accountNumber}</p>
                )}
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-gold text-royal-black flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Instructions & Transaction ID Input if applicable */}
      {selectedMethod && selectedMethod.instructions && (
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-2">
          <p className="font-medium text-royal-black">Payment Instructions:</p>
          <p className="leading-relaxed whitespace-pre-line">{selectedMethod.instructions}</p>

          {selectedMethod.requiresTransactionId && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-royal-black mb-1">
                Enter {selectedMethod.name} Transaction ID (TrxID) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 9G7K21LM88"
                value={transactionId}
                onChange={e => onChangeTransactionId(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-royal-black uppercase placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
