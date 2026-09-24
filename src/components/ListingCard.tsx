import React from 'react';
import {
  ShieldCheck,
  Zap,
  Star,
  Eye,
  Bookmark,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { AccountListing } from '../types';
import { formatINR, formatUSDT } from '../utils/helpers';

interface ListingCardProps {
  listing: AccountListing;
  onSelect: (listing: AccountListing) => void;
  onQuickBuy: (listing: AccountListing) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onSelect,
  onQuickBuy,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div className="group relative bg-[#0d121c] hover:bg-[#121824] border border-white/[0.08] hover:border-emerald-500/40 rounded-2xl p-4 transition-all duration-200 shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between">
      {/* Top Meta Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Country Flag Badge */}
            <span
              className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-xs font-mono font-semibold flex items-center gap-1 text-slate-200"
              title={listing.country.name}
            >
              <span>{listing.country.flag}</span>
              <span>{listing.country.code}</span>
            </span>

            {/* Platform Tag */}
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-400 uppercase">
              {listing.platform}
            </span>

            {/* Session Type */}
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-mono text-slate-300 border border-white/5">
              {listing.sessionType}
            </span>

            {listing.featured && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                HOT
              </span>
            )}

            {listing.isLztConnected && (
              <span
                className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1 shadow-sm"
                title={`RDX Verified Stock #${listing.lztItemId} (Instant Delivery)`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>RDX DIRECT #{listing.lztItemId}</span>
              </span>
            )}

            {listing.isResellShared && (
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 flex items-center gap-1 shadow-sm" title="Multi-User Login: 1 se zyada log ek sath login kar sakte hain">
                <span>🔄 RESELL (MULTI-LOGIN)</span>
              </span>
            )}
          </div>

          {/* Bookmark & View Count */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-500" />
              {listing.views}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(listing.id);
              }}
              className={`p-1 rounded-md transition-colors ${
                isFavorite
                  ? 'text-amber-400 bg-amber-400/10'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(listing)}
          className="text-sm font-semibold text-slate-100 hover:text-emerald-300 transition-colors line-clamp-2 cursor-pointer leading-snug mb-3"
        >
          {listing.title}
        </h3>

        {/* Attribute Pills Grid */}
        <div className="grid grid-cols-2 gap-1.5 mb-3 text-[11px] font-mono">
          <div className="bg-slate-900/80 px-2 py-1 rounded-lg border border-white/[0.04] text-slate-300 truncate">
            <span className="text-slate-500">Origin: </span>
            <span className="text-slate-200">{listing.origin}</span>
          </div>

          <div className="bg-slate-900/80 px-2 py-1 rounded-lg border border-white/[0.04] text-slate-300 truncate">
            <span className="text-slate-500">Stats: </span>
            <span className="text-emerald-400 font-bold">{listing.followersOrStats}</span>
          </div>

          <div className="bg-slate-900/80 px-2 py-1 rounded-lg border border-white/[0.04] text-slate-300 truncate">
            <span className="text-slate-500">Email: </span>
            <span className="text-slate-200">{listing.emailType}</span>
          </div>

          <div className="bg-slate-900/80 px-2 py-1 rounded-lg border border-white/[0.04] text-slate-300 truncate">
            <span className="text-slate-500">Phone: </span>
            <span className={listing.phoneLinked ? 'text-amber-400' : 'text-emerald-400'}>
              {listing.phoneLinked ? 'Linked' : 'No Phone (Free)'}
            </span>
          </div>
        </div>

        {/* Guarantee and Auto-Delivery Badges */}
        <div className="flex items-center gap-2 mb-4 text-[10px] font-mono flex-wrap">
          {listing.warrantyHours > 0 && (
            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              {listing.warrantyHours}h Warranty
            </span>
          )}

          {listing.autoDelivery && (
            <span className="inline-flex items-center gap-1 text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
              <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              Instant Delivery
            </span>
          )}

          <span className="text-slate-500 text-[10px] ml-auto">
            Year {listing.regYear}
          </span>
        </div>
      </div>

      {/* Bottom Footer: Seller Info & Price + Buy Action */}
      <div className="border-t border-white/[0.06] pt-3 mt-auto">
        <div className="flex items-center justify-between mb-3">
          {/* Seller micro pill */}
          <div className="flex items-center gap-1.5">
            <img
              src={listing.seller.avatar}
              alt={listing.seller.name}
              className="w-5 h-5 rounded-full object-cover border border-white/20"
            />
            <div className="text-left">
              <div className="text-[11px] font-medium text-slate-300 flex items-center gap-1 leading-none">
                <span>{listing.seller.name}</span>
                {listing.seller.verified && (
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                )}
              </div>
              <div className="text-[9px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                <span className="text-amber-400 flex items-center">
                  <Star className="w-2.5 h-2.5 fill-amber-400 mr-0.5" />
                  {listing.seller.rating}
                </span>
                <span>({listing.seller.dealsCount} sold)</span>
              </div>
            </div>
          </div>

          {/* Pricing in INR (Primary) & USDT (Secondary) */}
          <div className="text-right">
            <div className="text-lg font-bold font-mono text-emerald-400 leading-none">
              {formatINR(listing.priceINR)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              ≈ {formatUSDT(listing.priceUSDT)} <span className="text-cyan-400">TON</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSelect(listing)}
            className="w-full py-2 px-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-white/10 transition-all text-center flex items-center justify-center gap-1"
          >
            <span>Inspect</span>
          </button>

          <button
            type="button"
            onClick={() => onQuickBuy(listing)}
            className="w-full py-2 px-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all text-center flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20"
          >
            <span>Buy Now</span>
            <ArrowRight className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
