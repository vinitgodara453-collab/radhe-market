import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  Globe,
  MessageCircle,
  Send,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Real public live app URL - prioritizes window.location.origin
  const currentUrl =
    typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
      ? window.location.origin
      : 'https://ais-dev-qysswyj2u3so23dlsfw6jy-662892046092.asia-southeast1.run.app';

  const previewSharedUrl = 'https://ais-pre-qysswyj2u3so23dlsfw6jy-662892046092.asia-southeast1.run.app';

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      onShowToast('✅ Link Copied! Ab WhatsApp ya Telegram par share karein.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onShowToast('Link copy nahi ho paya, manually select karke copy karein.');
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🔥 *RDX MARKET - Digital Accounts Store* 🔥\n\nInstant Delivery, Escrow Warranty, UPI & USDT Supported!\n👉 Open Store: ${currentUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `🔥 RDX MARKET - Digital Accounts Store\nInstant Delivery & Escrow Warranty!\n👉 Open Store:`
    );
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${text}`,
      '_blank'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#0f1420] border border-white/10 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Top Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0f1420]/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-inner">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-brand text-white flex items-center gap-2">
                <span>Share Store Link</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  PUBLIC
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Customer aur dosto ke sath direct link share karein
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm">
          {/* 🔴 IMPORTANT NOTICE: 403 ERROR EXPLANATION */}
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center gap-2.5 text-amber-300 font-bold font-mono text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>403 ERROR KYU AATA HAI? (KYA GALTI HOTI HAI)</span>
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed font-sans">
              Agar aap browser ke upar se <code className="bg-black/50 px-1.5 py-0.5 rounded text-amber-200 font-mono">aistudio.google.com/...</code> wala link copy karke bhejenge, to sabhi logo ko{' '}
              <strong className="text-red-400">"Google 403 (Forbidden)!!1"</strong> error aayega.
              Kyunki wo link <strong>Google AI Studio ka private developer link</strong> hota hai jo sirf aapki Google ID par chalta hai.
            </p>
            <div className="bg-black/40 border border-amber-500/20 rounded-xl p-3 text-xs space-y-1.5">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SAHI TAREEKA: PUBLIC LINK BHEJEIN</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Neeche diye gaye link ko copy karke bhejein. Yeh link kisi ke bhi mobile ya PC me direct bina kisi Google login ke khulega!
              </p>
            </div>
          </div>

          {/* Copy Direct Link Section */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Store URL (Direct Khulne Wala Link)</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-xs font-mono text-emerald-300 truncate select-all">
                {currentUrl}
              </div>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-brand font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Fast Share Buttons */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              1-Click Fast Share (Turant Bhejein)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-brand font-bold text-xs transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Share on WhatsApp</span>
              </button>
              <button
                onClick={handleShareTelegram}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-brand font-bold text-xs transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Share on Telegram</span>
              </button>
            </div>
          </div>

          {/* How to Share from Google AI Studio UI */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Google AI Studio Header Se Share Kaise Karein:</span>
            </div>
            <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed font-sans">
              <li>
                Screen ke sabse upar right corner (दाएँ कोने) me{' '}
                <strong className="text-white">"Share" (शेयर)</strong> button par click karein.
              </li>
              <li>
                Access option me{' '}
                <strong className="text-emerald-300">"Anyone with the link"</strong> select karein.
              </li>
              <li>
                Wahan se <strong>"Copy Link"</strong> dabakar apne dosto ya customers ko bhejein!
              </li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0c101a] flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>RDX Market • Instant Access</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-brand text-xs font-bold transition-all cursor-pointer"
          >
            Done (बंद करें)
          </button>
        </div>
      </div>
    </div>
  );
};
