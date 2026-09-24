import React from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  Shield,
  Zap,
  Star,
  Check,
  Globe,
  Mail,
  Smartphone,
  Layers,
  ArrowUpDown,
  ArrowLeft,
  Users,
  Sparkles,
} from 'lucide-react';
import { FilterState } from '../types';
import { COUNTRIES_LIST } from '../data/mockData';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  totalFilteredCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  onReset,
  totalFilteredCount,
}) => {
  const toggleCountry = (code: string) => {
    setFilters((prev) => {
      const exists = prev.selectedCountries.includes(code);
      return {
        ...prev,
        selectedCountries: exists
          ? prev.selectedCountries.filter((c) => c !== code)
          : [...prev.selectedCountries, code],
      };
    });
  };

  const handlePricePreset = (min: number | '', max: number | '') => {
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  return (
    <div className="w-full lg:w-72 bg-[#0c101a] border border-white/[0.08] rounded-2xl p-4 flex flex-col gap-5 text-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2 font-brand font-bold text-base text-white">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span>MARKET FILTERS</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors font-mono"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
          Search Account / Tag
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="e.g. TData, UK +44, OG Mail..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
          />
        </div>
      </div>

      {/* Sorting */}
      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sort By</span>
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              sortBy: e.target.value as FilterState['sortBy'],
            }))
          }
          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/60"
        >
          <option value="newest">Latest Added (Default)</option>
          <option value="price_asc">Price: Low to High (₹)</option>
          <option value="price_desc">Price: High to Low (₹)</option>
          <option value="rating">Top Seller Rating</option>
          <option value="popularity">Most Popular / Views</option>
        </select>
      </div>

      {/* Access Type: Resell (Multi-login) vs Exclusive */}
      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>Account Login Type</span>
        </label>
        <div className="grid grid-cols-1 gap-1.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, accessType: 'all' }))}
            className={`w-full py-1.5 px-2.5 rounded-lg text-left text-[11px] flex items-center justify-between border cursor-pointer transition-colors ${
              !filters.accessType || filters.accessType === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-white/5 hover:border-white/10'
            }`}
          >
            <span>All Account Types</span>
            {(!filters.accessType || filters.accessType === 'all') && <Check className="w-3 h-3 text-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, accessType: 'shared_resell' }))}
            className={`w-full py-1.5 px-2.5 rounded-lg text-left text-[11px] flex items-center justify-between border cursor-pointer transition-colors ${
              filters.accessType === 'shared_resell'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold shadow-sm shadow-cyan-500/10'
                : 'bg-slate-900/60 text-slate-400 border-white/5 hover:border-white/10'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span>🔄 Resell (Shared 1+ Logins)</span>
            </span>
            {filters.accessType === 'shared_resell' && <Check className="w-3 h-3 text-cyan-400" />}
          </button>

          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, accessType: 'exclusive' }))}
            className={`w-full py-1.5 px-2.5 rounded-lg text-left text-[11px] flex items-center justify-between border cursor-pointer transition-colors ${
              filters.accessType === 'exclusive'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-white/5 hover:border-white/10'
            }`}
          >
            <span>Single User (Exclusive 1-Owner)</span>
            {filters.accessType === 'exclusive' && <Check className="w-3 h-3 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Price Filter (INR ₹) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Price Range (₹ INR)
          </label>
          <span className="text-[10px] text-slate-500 font-mono">Main Currency</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">
              ₹
            </span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minPrice: e.target.value === '' ? '' : Number(e.target.value),
                }))
              }
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-6 pr-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">
              ₹
            </span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxPrice: e.target.value === '' ? '' : Number(e.target.value),
                }))
              }
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-6 pr-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
            />
          </div>
        </div>

        {/* Quick price chips */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <button
            type="button"
            onClick={() => handlePricePreset('', 150)}
            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/5 cursor-pointer"
          >
            &lt; ₹150
          </button>
          <button
            type="button"
            onClick={() => handlePricePreset(150, 300)}
            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/5 cursor-pointer"
          >
            ₹150 - ₹300
          </button>
          <button
            type="button"
            onClick={() => handlePricePreset('', 500)}
            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/5 cursor-pointer"
          >
            &lt; ₹500 (All)
          </button>
        </div>
      </div>

      {/* Country Filter */}
      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-cyan-400" /> Country / Geo ({COUNTRIES_LIST.length})
          </span>
          {filters.selectedCountries.length > 0 && (
            <span className="text-[10px] text-emerald-400 font-mono">
              {filters.selectedCountries.length} active
            </span>
          )}
        </label>
        <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
          {COUNTRIES_LIST.map((country) => {
            const isSelected = filters.selectedCountries.includes(country.code);
            return (
              <button
                key={country.code}
                type="button"
                onClick={() => toggleCountry(country.code)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-all text-left border cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                    : 'bg-slate-900/60 text-slate-400 border-white/[0.05] hover:bg-slate-800'
                }`}
                title={country.name}
              >
                <span className="shrink-0">{country.flag}</span>
                <span className="truncate text-[11px]">{country.name}</span>
                {isSelected && <Check className="w-3 h-3 ml-auto text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Email Access filter (reference: email=yes) */}
      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold flex items-center gap-1">
          <Mail className="w-3.5 h-3.5 text-amber-400" />
          <span>Email Access</span>
        </label>
        <select
          value={filters.emailType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, emailType: e.target.value }))
          }
          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/60"
        >
          <option value="all">Any Email Status</option>
          <option value="Native Email Included">Native / OG Email Included</option>
          <option value="Domain Email">Domain / Custom Email</option>
          <option value="Email Changeable">Changeable Email</option>
          <option value="No Email">Without Email Access</option>
        </select>
      </div>

      {/* Phone Binding */}
      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold flex items-center gap-1">
          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
          <span>Phone Binding</span>
        </label>
        <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, phoneLinked: 'all' }))}
            className={`py-1 rounded-lg text-center font-medium ${
              filters.phoneLinked === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, phoneLinked: 'no' }))}
            className={`py-1 rounded-lg text-center font-medium ${
              filters.phoneLinked === 'no'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            No Phone
          </button>
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, phoneLinked: 'yes' }))}
            className={`py-1 rounded-lg text-center font-medium ${
              filters.phoneLinked === 'yes'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Linked
          </button>
        </div>
      </div>

      {/* Session / File Format */}
      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>Format / Session</span>
        </label>
        <select
          value={filters.sessionType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, sessionType: e.target.value }))
          }
          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/60"
        >
          <option value="all">All Formats</option>
          <option value="TData">TData (Telegram Portable)</option>
          <option value="Telethon Session">Telethon Session+JSON</option>
          <option value="Login:Password">Login : Password</option>
          <option value="Cookie">Session Cookies (JSON)</option>
          <option value="OAuth Token">OAuth / User Token</option>
        </select>
      </div>

      {/* Safety Toggles */}
      <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.08]">
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300 hover:text-white">
          <input
            type="checkbox"
            checked={filters.autoDeliveryOnly}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                autoDeliveryOnly: e.target.checked,
              }))
            }
            className="w-4 h-4 rounded bg-slate-900 border-white/20 text-emerald-500 focus:ring-emerald-500/30"
          />
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span>Instant Auto-Delivery (1-Sec)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300 hover:text-white">
          <input
            type="checkbox"
            checked={filters.warrantyOnly}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                warrantyOnly: e.target.checked,
              }))
            }
            className="w-4 h-4 rounded bg-slate-900 border-white/20 text-emerald-500 focus:ring-emerald-500/30"
          />
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Guaranteed Warranty (24h+)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300 hover:text-white">
          <input
            type="checkbox"
            checked={filters.minRating >= 4.9}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                minRating: e.target.checked ? 4.9 : 0,
              }))
            }
            className="w-4 h-4 rounded bg-slate-900 border-white/20 text-emerald-500 focus:ring-emerald-500/30"
          />
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Top Rated Sellers Only (4.9★+)</span>
        </label>
      </div>

      {/* Filter summary status */}
      <div className="bg-slate-900/60 rounded-xl p-2.5 border border-white/[0.05] text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <span>Matching Accounts:</span>
        <span className="font-bold text-emerald-400 text-xs">
          {totalFilteredCount} listings
        </span>
      </div>

      {/* Prominent Back / Reset Button */}
      <button
        type="button"
        onClick={onReset}
        className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>← Reset / Back to All Accounts</span>
      </button>
    </div>
  );
};
