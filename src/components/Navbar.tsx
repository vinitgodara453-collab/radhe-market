import React, { useState } from 'react';
import {
  ShieldCheck,
  Wallet,
  PlusCircle,
  ShoppingBag,
  Sliders,
  CheckCircle2,
  HelpCircle,
  UserCheck,
  Key,
  Cpu,
  Share2,
  Check,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { UserProfile } from '../types';
import { formatINR, copyToClipboard } from '../utils/helpers';

interface NavbarProps {
  user: UserProfile;
  ordersCount: number;
  onOpenWallet: () => void;
  onOpenSell: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  onOpenGuarantee: () => void;
  onOpenProfile?: () => void;
  onOpenShare?: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  onChangeUserRole: (role: 'buyer' | 'seller' | 'admin') => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  ordersCount,
  onOpenWallet,
  onOpenSell,
  onOpenOrders,
  onOpenAdmin,
  onOpenGuarantee,
  onOpenProfile,
  onOpenShare,
  currentView,
  setCurrentView,
  onChangeUserRole,
  onLogout,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareWebsite = () => {
    if (onOpenShare) {
      onOpenShare();
      return;
    }
    const url = window.location.origin && window.location.origin !== 'null'
      ? window.location.origin
      : 'https://ais-dev-qysswyj2u3so23dlsfw6jy-662892046092.asia-southeast1.run.app';
    copyToClipboard(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0d14]/90 backdrop-blur-md border-b border-white/[0.08]">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border-b border-emerald-500/20 px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400">RDX ENGINE ONLINE:</span>
          <span>Instant automated delivery active • 24h Buyer Escrow Guarantee</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
            <span className="text-emerald-400 font-bold">1 USDT</span> ≈ ₹89.25 (TON Network)
          </div>
          <button
            onClick={onOpenGuarantee}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-[11px] font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Safety Rules & Replacement Policy
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('catalog')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40 group-hover:scale-105 transition-transform">
                <span className="font-brand font-black text-xl text-black tracking-wider">RDX</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-brand font-bold text-xl text-white tracking-wider">
                    RDX<span className="text-emerald-400">.MARKET</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    OFFICIAL
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono tracking-tight -mt-0.5">
                  DIGITAL ACCOUNT EXCHANGE • INR & USDT TON
                </p>
              </div>
            </button>

            {/* Navigation links */}
            <nav className="hidden lg:flex items-center gap-1">
              {currentView !== 'catalog' && (
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white flex items-center gap-1.5 transition-all border border-white/10 mr-1"
                  title="Wapas Marketplace me jayein"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>← Back (वापस)</span>
                </button>
              )}

              <button
                onClick={() => setCurrentView('catalog')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  currentView === 'catalog'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Marketplace
              </button>

              <button
                onClick={onOpenOrders}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 relative"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>My Orders</span>
                {ordersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-black font-bold text-xs flex items-center justify-center font-mono">
                    {ordersCount}
                  </span>
                )}
              </button>

              <button
                onClick={onOpenGuarantee}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Warranty</span>
              </button>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* User Profile Front Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 rounded-xl px-2.5 py-1.5 transition-all cursor-pointer shadow-sm shadow-emerald-500/10 group"
              title="Open User Profile (Buyer Status & Settings)"
            >
              <img
                src={user.avatar}
                alt={user.username}
                className="w-7 h-7 rounded-lg object-cover border border-emerald-500/50"
              />
              <div className="text-left hidden sm:block">
                <div className="text-[9px] text-emerald-400 font-mono font-bold leading-none uppercase flex items-center gap-1">
                  <span>Profile</span>
                  <CheckCircle2 className="w-2.5 h-2.5" />
                </div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {user.username}
                </div>
              </div>
            </button>

            {/* Sell Account button - RESTRICTED FOR BUYERS */}
            {user.role === 'seller' || user.role === 'admin' ? (
              <button
                onClick={onOpenSell}
                className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 border border-emerald-300/30 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-black stroke-[2.5]" />
                <span>Sell Account</span>
              </button>
            ) : (
              <div
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-400 text-xs font-mono select-none"
                title="Aap Buyer hain. Buyers sirf account buy kar sakte hain, sell nahi."
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-300 font-bold">Buyer Mode</span>
              </div>
            )}

            {/* Wallet button with balance */}
            <button
              onClick={onOpenWallet}
              className="bg-slate-900/90 hover:bg-slate-800/90 border border-white/10 hover:border-emerald-500/40 rounded-xl px-3 py-1.5 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase font-mono font-medium leading-none">
                  Wallet Balance
                </div>
                <div className="text-sm font-bold font-mono text-emerald-400 group-hover:text-emerald-300">
                  {formatINR(user.balanceINR)}
                </div>
              </div>
              <span className="hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                + Top Up
              </span>
            </button>

            {/* Admin & API Panel button */}
            <button
              onClick={onOpenAdmin}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-amber-400 hover:text-amber-300 transition-all flex items-center gap-1.5 shadow-sm shadow-amber-500/10 cursor-pointer"
              title="Admin Panel & External API Configuration"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-mono font-bold hidden sm:inline">Admin & API</span>
            </button>

            {/* Share Website Link Button */}
            <button
              onClick={handleShareWebsite}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer ${
                copiedLink
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-white'
              }`}
              title="Copy Website Link to Share"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="inline text-[11px] sm:text-xs">{copiedLink ? 'Copied!' : 'Share Store'}</span>
            </button>

            {/* User profile with role quick-switch for test */}
            <div className="relative group">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 rounded-xl p-1.5 cursor-pointer">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-7 h-7 rounded-lg object-cover border border-emerald-500/40"
                />
                <span className="hidden xl:inline text-xs font-semibold text-slate-200">
                  {user.username}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-mono font-bold bg-white/5 text-slate-400">
                  {user.role}
                </span>
              </div>

              {/* Role switcher tooltip dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-white/15 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
                <div className="px-2 py-1 text-[11px] font-mono text-slate-400 border-b border-white/10 mb-1">
                  SWITCH SIMULATOR ROLE:
                </div>
                <button
                  onClick={() => onChangeUserRole('buyer')}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    user.role === 'buyer' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" /> Buyer Account
                  </span>
                  {user.role === 'buyer' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => onChangeUserRole('seller')}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    user.role === 'seller' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <PlusCircle className="w-3.5 h-3.5" /> Seller Account
                  </span>
                  {user.role === 'seller' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => onChangeUserRole('admin')}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    user.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> Admin Moderator
                  </span>
                  {user.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </button>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-red-400 hover:bg-red-500/10 border-t border-white/10 mt-1 pt-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out / Switch Phone</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
