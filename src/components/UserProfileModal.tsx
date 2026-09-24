import React from 'react';
import {
  X,
  User,
  ShieldCheck,
  ShoppingBag,
  Wallet,
  ArrowLeft,
  CheckCircle2,
  Lock,
  ExternalLink,
  MessageSquare,
  Sparkles,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { UserProfile } from '../types';
import { formatINR } from '../utils/helpers';

interface UserProfileModalProps {
  user: UserProfile;
  ordersCount: number;
  onClose: () => void;
  onOpenWallet: () => void;
  onOpenOrders: () => void;
  onOpenWarranty: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  ordersCount,
  onClose,
  onOpenWallet,
  onOpenOrders,
  onOpenWarranty,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0c101a] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Top Header with prominent BACK Button */}
        <div className="bg-[#111726] p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              title="Wapas Marketplace me jayein"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>← Back (वापस)</span>
            </button>

            <div>
              <h3 className="font-brand font-bold text-base sm:text-lg text-white flex items-center gap-2">
                <span>USER PROFILE</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Buyer Account
                </span>
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Authorized Buyer • Safe Escrow Protection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Banner */}
        <div className="p-6 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 border-b border-white/10">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/20"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-brand text-white truncate">
                  {user.username}
                </h2>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5 truncate">
                Role: <strong className="text-emerald-400 font-bold uppercase">Verified Buyer</strong> (Purchase Mode Only)
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold">
                  UPI / QR Enabled
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  100% Money-Back Escrow
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Role Notice: Buyer Only */}
        <div className="px-6 pt-5">
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs font-mono space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>BUYER PERMISSION ACTIVE:</span>
                <span className="text-emerald-400">Can Buy • Selling Restricted</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans text-[12px]">
                Aapka account <strong>Buyer Account</strong> ke roop me configured hai. Aap sabhi platforms ke regular aur <strong>Resell (Shared / Multi-Login)</strong> accounts safely buy kar sakte hain. Marketplace security ke tahat sellers verification admin dwara controlled hai.
              </p>
            </div>
          </div>
        </div>

        {/* Account Metrics Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Balance Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-400" />
                Wallet Balance:
              </span>
              <span className="text-[10px] text-emerald-400">Instant</span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {formatINR(user.balanceINR)}
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenWallet();
              }}
              className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Top Up Wallet (Min ₹100)</span>
            </button>
          </div>

          {/* Orders Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                My Purchases:
              </span>
              <span className="text-[10px] text-cyan-400">{ordersCount} Items</span>
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {ordersCount} <span className="text-xs font-normal text-slate-400">Orders</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenOrders();
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold font-mono text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
              <span>View My Orders & Logins</span>
            </button>
          </div>
        </div>

        {/* Multi-User Resell info */}
        <div className="px-6 pb-4">
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-slate-300">
                <strong className="text-cyan-300 font-bold">Resell Accounts:</strong> 1 se zyada log simultaneous login kar sakte hain.
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold shrink-0">
              Live in Catalog
            </span>
          </div>
        </div>

        {/* Modal Footer with BACK Button */}
        <div className="p-5 bg-slate-950 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-brand font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Marketplace (वापस जाएं)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenWarranty();
            }}
            className="py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono font-bold text-xs transition-all flex items-center gap-1.5 border border-emerald-500/40 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Warranty Rules</span>
          </button>
        </div>
      </div>
    </div>
  );
};
