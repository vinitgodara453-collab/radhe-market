import React from 'react';
import {
  X,
  ShieldCheck,
  Zap,
  Lock,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  FileCheck,
  ArrowLeft,
} from 'lucide-react';

interface GuaranteeInfoModalProps {
  onClose: () => void;
}

export const GuaranteeInfoModal: React.FC<GuaranteeInfoModalProps> = ({ onClose }) => {
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
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-brand font-bold text-base sm:text-lg text-white">RDX BUYER GUARANTEE & RULES</h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Escrow safety system, replacement policy & platform compliance
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

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Main 4 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Lock className="w-4 h-4" />
                <span>1. Escrow Protection</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                When you purchase, the seller does not immediately receive the money. Funds stay locked until your warranty period ends.
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-yellow-400 font-bold">
                <Zap className="w-4 h-4" />
                <span>2. Automated 1-Sec Delivery</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Logins, passwords, sessions (TData/JSON), and 2FA recovery codes are instantly displayed upon payment completion.
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <RotateCcw className="w-4 h-4" />
                <span>3. 100% Replacement or Refund</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                If credentials do not work or if the account was invalid prior to purchase, 1-click dispute refunds your wallet balance.
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <FileCheck className="w-4 h-4" />
                <span>4. Anti-Ban Pre-Checked</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Listings undergo automated ping checks (e.g. Telegram SpamBot, Instagram checkpoints) before display.
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-sky-500/30 sm:col-span-2 space-y-1.5 bg-gradient-to-r from-sky-950/30 to-slate-900/80">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>5. Real Live OTP Verification (100% OTP Guarantee)</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Jab aap account me pehli baar login karte hain, verification code lene ke liye "My Orders" tab me <strong>"Get Live OTP"</strong> button dabayein. Carrier SMS / Telegram live login code turant aapki screen par deliver hota hai taaki aap login kar sakein.
              </p>
            </div>
          </div>

          {/* Compliance & Rules */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-white font-brand font-bold text-sm">
              <AlertOctagon className="w-4 h-4 text-emerald-400" />
              <span>MARKETPLACE INTEGRITY & USAGE TERMS</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li>Accounts sold are verified digital assets compliant with platform policy frameworks.</li>
              <li>Always connect using a clean, matching Geo IP / proxy on first login to avoid trigger flags.</li>
              <li>Do not blast hundreds of messages or actions in the first 60 minutes after taking ownership.</li>
              <li>Change security credentials and backup recovery methods within the guaranteed warranty window.</li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-brand font-bold text-sm transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
