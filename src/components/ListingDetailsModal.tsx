import React from 'react';
import {
  X,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle,
  Clock,
  ExternalLink,
  Lock,
  Mail,
  Smartphone,
  Layers,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  User,
  Eye,
  Sparkles,
} from 'lucide-react';
import { AccountListing } from '../types';
import { formatINR, formatUSDT } from '../utils/helpers';

interface ListingDetailsModalProps {
  listing: AccountListing | null;
  onClose: () => void;
  onProceedCheckout: (listing: AccountListing) => void;
}

export const ListingDetailsModal: React.FC<ListingDetailsModalProps> = ({
  listing,
  onClose,
  onProceedCheckout,
}) => {
  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0d121c] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Top Header Bar with BACK BUTTON */}
        <div className="bg-gradient-to-r from-slate-900 via-[#131b2c] to-slate-900 p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              title="Marketplace me wapas jayein"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>← Back (वापस)</span>
            </button>

            <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-mono font-bold flex items-center gap-1.5">
              <span>{listing.country.flag}</span>
              <span>{listing.country.name} ({listing.country.code})</span>
            </span>

            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold uppercase">
              {listing.platform}
            </span>

            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-white/10 text-xs font-mono">
              {listing.sessionType}
            </span>

            {listing.isResellShared && (
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40">
                🔄 RESELL (MULTI-LOGIN)
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Main Title & Key Highlight */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-3">
              {listing.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {listing.warrantyHours} Hours RDX Escrow Guarantee
              </span>

              {listing.autoDelivery && (
                <span className="flex items-center gap-1 text-yellow-400 bg-yellow-500/10 px-2.5 py-1 rounded-lg border border-yellow-500/30">
                  <Zap className="w-4 h-4 fill-yellow-400" />
                  Instant Automated Delivery
                </span>
              )}

              <span className="text-slate-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                {listing.views} views
              </span>
            </div>
          </div>

          {/* If Resell Shared Account: Show Highlight Banner */}
          {listing.isResellShared && (
            <div className="bg-cyan-950/30 border border-cyan-500/40 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs font-mono space-y-1">
                <div className="font-bold text-cyan-300 text-sm flex items-center gap-2">
                  <span>🔄 RESELL / SHARED ACCOUNT (1+ LOGINS ALLOWED)</span>
                  <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-200 text-[10px]">Multi-Device</span>
                </div>
                <p className="text-slate-200 leading-relaxed font-sans text-xs">
                  Yeh account <strong>Resell Shared Access</strong> par based hai. Isme <strong>1 se zyada log ek sath login</strong> karke account use kar sakte hain! Isiliye iska price ultra-low rakha gaya hai. Password change karne ki zaroorat nahi hai, direct credentials/session paste karke enjoy karein.
                </p>
              </div>
            </div>
          )}

          {/* Pricing & Checkout Summary Box */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase">
                Fixed Purchase Price
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black font-mono text-emerald-400">
                  {formatINR(listing.priceINR)}
                </span>
                <span className="text-sm font-mono text-slate-300">
                  or <strong className="text-cyan-400">{formatUSDT(listing.priceUSDT)}</strong> (USDT TON)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Zero hidden buyer fees • Credentials revealed immediately on payment
              </p>
            </div>

            <button
              onClick={() => onProceedCheckout(listing)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-brand font-bold text-base bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>PROCEED TO PURCHASE</span>
              <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* RDX Direct Cloud Inventory & Escrow Protection Box */}
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 flex items-start gap-3 font-mono text-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 font-bold text-sm">
              RDX
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>RDX VERIFIED DIRECT INVENTORY {listing.lztItemId ? `(STOCK #${listing.lztItemId})` : ''}</span>
                </span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% RDX Escrow Protected</span>
                </span>
              </div>
              <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
                Yeh account <strong>RDX High-Speed Automated Dispatch Network</strong> se directly connected hai. Payment confirm hote hi login credentials, security codes aur files 1 second ke andar instantly screen par unlock ho jate hain with <strong>{listing.warrantyHours} ghante ki replacement warranty</strong>.
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[10px] text-slate-400 pt-1 border-t border-white/5 font-mono">
                <span>Stock Status: <strong className="text-emerald-400">🟢 In Stock (Ready to Deliver)</strong></span>
                <span>Delivery Speed: <strong className="text-amber-400">⚡ 1-Sec Instant Unlock</strong></span>
                <span>Buyer Protection: <strong className="text-cyan-400">🛡️ {listing.warrantyHours}h Guarantee</strong></span>
                <span>Dispatch Engine: <strong className="text-emerald-400">⚡ Automated Cloud</strong></span>
              </div>
            </div>
          </div>

          {/* Account Specifications Grid */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              Account Technical Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <div className="text-slate-500 mb-0.5">Account Origin</div>
                <div className="font-semibold text-slate-200">{listing.origin}</div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <div className="text-slate-500 mb-0.5">Followers / Audience / Stats</div>
                <div className="font-semibold text-emerald-400">{listing.followersOrStats}</div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <div className="text-slate-500 mb-0.5">Email Status</div>
                <div className="font-semibold text-slate-200 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  {listing.emailType}
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <div className="text-slate-500 mb-0.5">Phone Linked</div>
                <div className="font-semibold flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  {listing.phoneLinked ? (
                    <span className="text-amber-400">Phone Linked</span>
                  ) : (
                    <span className="text-emerald-400">No Phone (Ready to bind yours)</span>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <div className="text-slate-500 mb-0.5">Two-Factor Authentication (2FA)</div>
                <div className="font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  {listing.twoFactorAuth ? (
                    <span className="text-cyan-400">2FA Password / Secret Provided</span>
                  ) : (
                    <span className="text-emerald-400">No 2FA Set (Instant Access)</span>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <div className="text-slate-500 mb-0.5">Registration Year</div>
                <div className="font-semibold text-slate-200 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  {listing.regYear} (Aged & Warmed)
                </div>
              </div>
            </div>
          </div>

          {/* Description & Seller Notes */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
              Seller Description & Features
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>

            {listing.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {listing.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/5 text-slate-400 border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Seller Reputation Card */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={listing.seller.avatar}
                alt={listing.seller.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/40"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-base">
                    {listing.seller.name}
                  </span>
                  {listing.seller.verified && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30 flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" /> VERIFIED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-1">
                  <span className="text-amber-400 flex items-center gap-0.5 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {listing.seller.rating} / 5.0
                  </span>
                  <span>•</span>
                  <span>{listing.seller.dealsCount} Completed Deals</span>
                  <span>•</span>
                  <span className="text-emerald-400">{listing.seller.positivePercent}% Positive</span>
                </div>
              </div>
            </div>

            <div className="text-right text-xs font-mono text-slate-400 w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center">
              <div>Average reply: <span className="text-emerald-400 font-bold">{listing.seller.responseTime}</span></div>
              <div className="text-[11px] text-slate-500">Member since {listing.seller.memberSince}</div>
            </div>
          </div>

          {/* Buyer Warranty Guarantee Details */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-emerald-300">
                {listing.warrantyHours}-Hour Safe Escrow Guarantee
              </div>
              <p className="text-slate-300 leading-relaxed">
                If the credentials do not work or the account is non-functional at delivery time, our automatic check bot and dispute system will refund your payment immediately to your wallet or issue an instant replacement.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer with Back and Purchase Buttons */}
        <div className="p-4 bg-slate-950 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-mono font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Catalog (वापस)</span>
          </button>

          <button
            onClick={() => onProceedCheckout(listing)}
            className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-brand font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Purchase Account ({formatINR(listing.priceINR)})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
