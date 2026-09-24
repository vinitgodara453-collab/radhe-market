import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe,
  DollarSign,
  Layers,
  FileText,
  Upload,
  ArrowLeft,
} from 'lucide-react';
import { AccountListing, Platform, EmailType, SessionFormat, AccountOrigin } from '../types';
import { COUNTRIES_LIST } from '../data/mockData';
import { formatINR, inrToUSDT } from '../utils/helpers';

interface SellListingModalProps {
  onClose: () => void;
  onAddListing: (listing: AccountListing) => void;
  sellerName: string;
}

export const SellListingModal: React.FC<SellListingModalProps> = ({
  onClose,
  onAddListing,
  sellerName,
}) => {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('telegram');
  const [countryCode, setCountryCode] = useState('GB');
  const [priceINR, setPriceINR] = useState<number>(250);
  const [origin, setOrigin] = useState<AccountOrigin>('Personal (Aged)');
  const [emailType, setEmailType] = useState<EmailType>('Native Email Included');
  const [phoneLinked, setPhoneLinked] = useState<boolean>(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);
  const [sessionType, setSessionType] = useState<SessionFormat>('TData');
  const [followersOrStats, setFollowersOrStats] = useState('2022 Registered • Clean History');
  const [regYear, setRegYear] = useState<number>(2022);
  const [warrantyHours, setWarrantyHours] = useState<number>(24);
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('Aged, Clean, Fast');

  // Credentials payload to be delivered automatically to buyer
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [secretCode2FA, setSecretCode2FA] = useState('');
  const [emailAccess, setEmailAccess] = useState('');
  const [setupInstructions, setSetupInstructions] = useState('1. Extract credentials.\n2. Log in with proper clean IP.\n3. Verify security settings.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !login.trim() || !password.trim()) {
      alert('Please fill out account title, login, and password.');
      return;
    }

    const selectedCountryObj = COUNTRIES_LIST.find((c) => c.code === countryCode) || COUNTRIES_LIST[0];

    const newListing: AccountListing = {
      id: `rdx-custom-${Date.now()}`,
      title: title.trim(),
      platform,
      country: selectedCountryObj,
      priceINR: Number(priceINR),
      priceUSDT: inrToUSDT(Number(priceINR)),
      origin,
      emailType,
      phoneLinked,
      twoFactorAuth,
      sessionType,
      followersOrStats: followersOrStats.trim(),
      regYear: Number(regYear),
      warrantyHours: Number(warrantyHours),
      autoDelivery: true,
      seller: {
        id: `sel_${Date.now()}`,
        name: sellerName || 'VerifiedSeller_RDX',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        rating: 5.0,
        dealsCount: 1,
        positivePercent: 100,
        responseTime: '< 5 min',
        verified: true,
        memberSince: 'Sep 2026',
      },
      description: description.trim() || 'Verified genuine account tested by automated pre-check.',
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      views: 1,
      favoritesCount: 0,
      createdAt: new Date().toISOString(),
      status: 'active',
      featured: true,
      deliveryPayload: {
        login: login.trim(),
        password: password.trim(),
        secretCode2FA: secretCode2FA.trim() || undefined,
        emailAccess: emailAccess.trim() || undefined,
        setupInstructions: setupInstructions.trim(),
      },
    };

    onAddListing(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0c101a] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header with BACK Button */}
        <div className="bg-[#111726] p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              title="Marketplace me wapas jayein"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>← Back (वापस)</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <PlusCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-brand font-bold text-base sm:text-lg text-white">LIST AN ACCOUNT FOR SALE</h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Automated 1-second delivery to buyer • Escrow protected
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs font-mono">
          {/* Platform and Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 uppercase font-bold">
                Platform Category:
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-sans text-xs"
              >
                <option value="telegram">Telegram</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">X (Twitter)</option>
                <option value="tiktok">TikTok</option>
                <option value="discord">Discord</option>
                <option value="steam">Steam</option>
                <option value="reddit">Reddit</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 uppercase font-bold">
                Geo / Country of Origin:
              </label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-sans text-xs"
              >
                {COUNTRIES_LIST.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-400 mb-1 uppercase font-bold">
              Listing Title (Clear & Accurate):
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Telegram [UK +44] 🇬🇧 2021 Aged Session • Clean TData • Native Mail"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-sans text-xs"
            />
          </div>

          {/* Price (INR ₹) & Warranty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 uppercase font-bold">
                Selling Price (₹ INR):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                <input
                  type="number"
                  required
                  min={100}
                  value={priceINR}
                  onChange={(e) => setPriceINR(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                USDT Equivalent: ≈ {inrToUSDT(priceINR)} USDT
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 uppercase font-bold">
                Buyer Warranty Guarantee:
              </label>
              <select
                value={warrantyHours}
                onChange={(e) => setWarrantyHours(Number(e.target.value))}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={12}>12 Hours Replacement Escrow</option>
                <option value={24}>24 Hours Standard Guarantee</option>
                <option value={48}>48 Hours Extended Guarantee</option>
                <option value={72}>72 Hours Premium Guarantee</option>
              </select>
            </div>
          </div>

          {/* Specs & Flags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 uppercase font-bold">Format / Session:</label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value as SessionFormat)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="TData">TData (Portable)</option>
                <option value="Telethon Session">Telethon Session+JSON</option>
                <option value="Login:Password">Login : Password</option>
                <option value="Cookie">Session Cookie (JSON)</option>
                <option value="OAuth Token">OAuth Token</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 uppercase font-bold">Email Access:</label>
              <select
                value={emailType}
                onChange={(e) => setEmailType(e.target.value as EmailType)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Native Email Included">Native OG Email</option>
                <option value="Domain Email">Domain Email</option>
                <option value="Email Changeable">Changeable Email</option>
                <option value="No Email">No Email</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 uppercase font-bold">Reg Year:</label>
              <input
                type="number"
                value={regYear}
                onChange={(e) => setRegYear(Number(e.target.value))}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Stats & Description */}
          <div>
            <label className="block text-slate-400 mb-1 uppercase font-bold">
              Account Highlights / Audience:
            </label>
            <input
              type="text"
              placeholder="e.g. 24.5K Followers • 6.8% ER • High Trust"
              value={followersOrStats}
              onChange={(e) => setFollowersOrStats(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 uppercase font-bold">
              Public Description:
            </label>
            <textarea
              rows={2}
              placeholder="Explain account history, niche, audience origin, clean record..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-sans text-xs"
            />
          </div>

          {/* SECURE DELIVERY PAYLOAD SECTION */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px]">
              <Lock className="w-3.5 h-3.5" />
              <span>Automated Delivery Vault (Encrypted until Buyer Pays)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Account Login / Phone / Username:</label>
                <input
                  type="text"
                  required
                  placeholder="+447911... or user_handle"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Account Password:</label>
                <input
                  type="text"
                  required
                  placeholder="Password here"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">2FA Secret / Backup Codes (if any):</label>
                <input
                  type="text"
                  placeholder="e.g. JBSWY3DPEHPK3PXP"
                  value={secretCode2FA}
                  onChange={(e) => setSecretCode2FA(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email Credentials (if included):</label>
                <input
                  type="text"
                  placeholder="mail@domain.com : password"
                  value={emailAccess}
                  onChange={(e) => setEmailAccess(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Setup / Login Instructions:</label>
              <textarea
                rows={2}
                value={setupInstructions}
                onChange={(e) => setSetupInstructions(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl font-brand font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[3]" />
            <span>PUBLISH LISTING TO RDX MARKET</span>
          </button>
        </form>
      </div>
    </div>
  );
};
