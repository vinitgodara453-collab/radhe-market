import React, { useState } from 'react';
import {
  X,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  QrCode,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile, WalletTransaction } from '../types';
import {
  formatINR,
  formatUSDT,
  inrToUSDT,
  usdtToINR,
  TON_DEFAULT_WALLET,
  USDT_TON_RATE,
  copyToClipboard,
} from '../utils/helpers';
import { getSavedAdminUpi, getUpiQrImageUrl, validateUpiUtr } from '../utils/lztMarketSync';

interface WalletModalProps {
  user: UserProfile;
  transactions: WalletTransaction[];
  onClose: () => void;
  onDeposit: (amountINR: number, method: string, txHash?: string) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  user,
  transactions,
  onClose,
  onDeposit,
}) => {
  const [activeTab, setActiveTab] = useState<'deposit_inr' | 'history'>('deposit_inr');
  const [depositAmountINR, setDepositAmountINR] = useState<number>(100);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositTxHash, setDepositTxHash] = useState('');
  const [depositUtrError, setDepositUtrError] = useState('');
  const adminUpi = getSavedAdminUpi();

  const handleCopy = async (text: string, key: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleConfirmINRDeposit = () => {
    if (depositAmountINR < 100) {
      setDepositUtrError('Minimum deposit ₹100 hona anivarya hai. Kripya ₹100 ya usse zyada amount enter karein.');
      return;
    }

    // Strict UTR validation - no balance credit without verified payment!
    const check = validateUpiUtr(
      depositTxHash,
      transactions.map((t) => ({ txHash: t.id }))
    );
    if (!check.valid) {
      setDepositUtrError(check.error || 'Payment not found! 12-digit UPI UTR is required.');
      return;
    }
    setDepositUtrError('');

    setIsDepositing(true);
    setTimeout(() => {
      onDeposit(depositAmountINR, 'UPI / Instant QR', depositTxHash.trim());
      setIsDepositing(false);
      setDepositTxHash('');
      setActiveTab('history');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0c101a] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header with BACK Button */}
        <div className="bg-[#111726] p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              title="Marketplace me wapas jayein"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>← Back (वापस)</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-brand font-bold text-base sm:text-lg text-white">RDX WALLET & BALANCES</h3>
                <p className="text-[11px] font-mono text-emerald-400">
                  INR UPI / Instant QR • Minimum Deposit: ₹100
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card Banner */}
        <div className="p-6 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase text-slate-400 font-bold">
              Available Main Balance
            </div>
            <div className="text-3xl font-black font-mono text-emerald-400">
              {formatINR(user.balanceINR)}
            </div>
            <div className="text-xs font-mono text-slate-300 mt-1 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                MIN DEP: ₹100
              </span>
              <span>Upar aap kitna bhi unlimited deposit kar sakte hain.</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('deposit_inr')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 bg-emerald-500 text-black shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>+ Top Up Wallet (Min ₹100)</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 bg-slate-900/50 text-xs font-mono">
          <button
            onClick={() => setActiveTab('deposit_inr')}
            className={`flex-1 py-3 text-center border-b-2 font-bold ${
              activeTab === 'deposit_inr'
                ? 'border-emerald-500 text-emerald-400 bg-white/[0.02]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            INR UPI / QR Deposit (Min ₹100)
          </button>
          <div
            className="flex-1 py-3 text-center border-b-2 border-transparent text-slate-500 bg-white/[0.01] flex items-center justify-center gap-1.5 cursor-not-allowed select-none opacity-60"
            title="USDT deposits are temporarily turned off. Please use UPI/QR."
          >
            <span>USDT (TON Network)</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-500/20 text-red-400 font-bold border border-red-500/30">
              OFF
            </span>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-center border-b-2 font-bold ${
              activeTab === 'history'
                ? 'border-amber-500 text-amber-400 bg-white/[0.02]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Transaction Ledger ({transactions.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {/* TAB 1: INR DEPOSIT */}
          {activeTab === 'deposit_inr' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono uppercase text-slate-300 font-bold">
                    Select Top-Up Amount (₹ INR):
                  </label>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    Min: ₹100 • Max: Unlimited
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {[100, 250, 500, 1000, 2000, 5000, 10000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setDepositAmountINR(amt);
                        setDepositUtrError('');
                      }}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                        depositAmountINR === amt
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-sm shadow-emerald-500/20'
                          : 'bg-slate-900 text-slate-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {formatINR(amt)}
                      {amt === 100 && (
                        <span className="ml-1 text-[9px] text-emerald-400 font-normal">
                          (Min)
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={100}
                    value={depositAmountINR || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setDepositAmountINR(val);
                      if (val < 100 && val > 0) {
                        setDepositUtrError('Minimum deposit ₹100 hai. Aap ₹100 ya usse upar kitna bhi add kar sakte hain.');
                      } else {
                        setDepositUtrError('');
                      }
                    }}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-base font-bold font-mono text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Enter amount (Minimum ₹100)"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono mt-1.5 text-slate-400">
                  <span>Minimum ₹100 se shuru karein, upar kitna bhi amount add karein</span>
                  {depositAmountINR < 100 && depositAmountINR > 0 && (
                    <span className="text-red-400 font-bold">Min ₹100 required!</span>
                  )}
                </div>
              </div>

              {/* UPI QR Display */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                <div className="bg-white p-2 rounded-xl w-32 h-32 flex flex-col items-center justify-center shrink-0 border border-emerald-500/30">
                  <img
                    src={getUpiQrImageUrl(adminUpi.upiId, adminUpi.upiName, depositAmountINR)}
                    alt={`Pay ₹${depositAmountINR} to ${adminUpi.upiId}`}
                    className="w-24 h-24 object-contain"
                  />
                  <span className="text-[8px] font-mono text-slate-800 font-bold mt-0.5">SCAN TO PAY ₹</span>
                </div>

                <div className="space-y-2 text-xs font-mono w-full">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">
                      UPI Virtual Payment Address ({adminUpi.upiName})
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="bg-black/50 px-2.5 py-1 rounded-lg text-emerald-300 font-bold border border-white/10 font-mono">
                        {adminUpi.upiId}
                      </span>
                      <button
                        onClick={() => handleCopy(adminUpi.upiId, 'upi_dep')}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300"
                      >
                        {copiedKey === 'upi_dep' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-slate-400 text-[11px]">
                    Instant auto-credit upon payment verification. 0% gateway fee.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Enter 12-Digit UPI UTR / RRN <span className="text-red-400 font-bold">*REQUIRED</span>:
                </label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="e.g. 429102849182 (from PhonePe / GPay / Paytm)"
                  value={depositTxHash}
                  onChange={(e) => {
                    setDepositTxHash(e.target.value.replace(/\D/g, ''));
                    if (depositUtrError) setDepositUtrError('');
                  }}
                  className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2.5 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>Enter bank reference number from your UPI payment</span>
                  <span className={depositTxHash.length === 12 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {depositTxHash.length}/12 Digits
                  </span>
                </div>
              </div>

              {depositUtrError && (
                <div className="bg-red-500/15 border border-red-500/40 p-3 rounded-xl flex items-start gap-2.5 text-xs text-red-200 font-mono">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-red-300">Payment Required:</div>
                    <div className="mt-0.5 text-[11px]">{depositUtrError}</div>
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={isDepositing || depositAmountINR < 100}
                onClick={handleConfirmINRDeposit}
                className="w-full py-3.5 rounded-2xl font-brand font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isDepositing ? (
                  <span className="flex items-center gap-2 font-mono">
                    <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                    Crediting Wallet Balance...
                  </span>
                ) : (
                  <>
                    <span>CONFIRM & ADD {formatINR(depositAmountINR)} TO WALLET</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: TRANSACTION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500 font-mono">
                  No transactions yet.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          tx.type === 'deposit'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {tx.type === 'deposit' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white capitalize">
                          {tx.type} • {tx.method}
                        </div>
                        <div className="text-[10px] text-slate-500">{tx.date}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-bold ${
                          tx.type === 'deposit' ? 'text-emerald-400' : 'text-slate-300'
                        }`}
                      >
                        {tx.type === 'deposit' ? '+' : '-'} {formatINR(tx.amountINR)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {tx.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
