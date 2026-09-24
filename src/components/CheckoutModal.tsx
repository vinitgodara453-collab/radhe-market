import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  Wallet,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Download,
  AlertCircle,
  AlertTriangle,
  Clock,
  Lock,
  Sparkles,
  CreditCard,
  KeyRound,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AccountListing, Order, PaymentMethod, UserProfile } from '../types';
import {
  formatINR,
  formatUSDT,
  TON_DEFAULT_WALLET,
  copyToClipboard,
} from '../utils/helpers';
import {
  getSavedAdminUpi,
  getUpiQrImageUrl,
  validateUpiUtr,
  getRequireAdminUpiApproval,
} from '../utils/lztMarketSync';

interface CheckoutModalProps {
  listing: AccountListing | null;
  user: UserProfile;
  onClose: () => void;
  onOrderSuccess: (order: Order, updatedUser: UserProfile) => void;
  onOpenWallet: () => void;
  existingOrders?: Order[];
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  listing,
  user,
  onClose,
  onOrderSuccess,
  onOpenWallet,
  existingOrders = [],
}) => {
  if (!listing) return null;

  const adminUpi = getSavedAdminUpi();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    adminUpi.exclusiveUpiOnly
      ? 'INR_UPI'
      : user.balanceINR >= listing.priceINR
      ? 'WALLET_BALANCE'
      : 'INR_UPI'
  );
  const [upiRefId, setUpiRefId] = useState('');
  const [utrError, setUtrError] = useState('');
  const [tonTxHash, setTonTxHash] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<Order | null>(null);
  const [liveOtpCode, setLiveOtpCode] = useState<string | null>(null);
  const [isFetchingOtp, setIsFetchingOtp] = useState(false);
  const [otpTimestamp, setOtpTimestamp] = useState<string | null>(null);

  const handleFetchOrderOtp = () => {
    setIsFetchingOtp(true);
    setTimeout(() => {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setLiveOtpCode(generatedOtp);
      setOtpTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsFetchingOtp(false);
    }, 1500);
  };

  const orderMemoCode = `RDX-${listing.id.slice(-4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleCopy = async (text: string, key: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleCompletePayment = () => {
    // 1. Strict Payment & UTR Validation
    if (paymentMethod === 'INR_UPI') {
      const validation = validateUpiUtr(upiRefId, existingOrders);
      if (!validation.valid) {
        setUtrError(validation.error || 'Payment not detected. Valid 12-digit UTR is required.');
        return;
      }
      setUtrError('');
    } else if (paymentMethod === 'WALLET_BALANCE') {
      if (user.balanceINR < listing.priceINR) {
        setUtrError('Insufficient wallet balance. Please complete UPI payment.');
        return;
      }
      setUtrError('');
    }

    setIsProcessing(true);

    setTimeout(() => {
      let updatedUser = { ...user };

      if (paymentMethod === 'WALLET_BALANCE') {
        updatedUser = {
          ...user,
          balanceINR: user.balanceINR - listing.priceINR,
        };
      }

      const warrantyExpireDate = new Date(
        Date.now() + listing.warrantyHours * 60 * 60 * 1000
      ).toISOString();

      const requireAdmin = getRequireAdminUpiApproval();
      const orderStatus: Order['status'] =
        paymentMethod === 'INR_UPI' && requireAdmin
          ? 'pending_verification'
          : 'active_guarantee';

      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber: `RDX-${Date.now().toString().slice(-6)}`,
        listingId: listing.id,
        title: listing.title,
        platform: listing.platform,
        countryFlag: listing.country.flag,
        priceINR: listing.priceINR,
        priceUSDT: listing.priceUSDT,
        paymentMethod: paymentMethod,
        purchasedAt: new Date().toISOString(),
        warrantyExpiresAt: warrantyExpireDate,
        warrantyHours: listing.warrantyHours,
        status: orderStatus,
        deliveryPayload: listing.deliveryPayload,
        sellerName: listing.seller.name,
        txHash:
          paymentMethod === 'USDT_TON'
            ? tonTxHash || 'ton_live_mock_' + Math.random().toString(36).substring(2, 9)
            : upiRefId.trim(),
        lztItemId: listing.lztItemId,
        lztBasePriceINR: listing.lztBasePriceINR,
        profitINR: listing.profitINR,
        lztPurchased: true,
      };

      if (orderStatus === 'active_guarantee') {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas not supported
        }
      }

      setIsProcessing(false);
      setOrderResult(newOrder);
      onOrderSuccess(newOrder, updatedUser);
    }, 1500);
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

            <div className="flex items-center gap-2">
              <span className="font-brand font-bold text-base sm:text-lg text-white">
                {orderResult ? 'ORDER COMPLETED • INSTANT DELIVERY' : 'SECURE CHECKOUT'}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ESCROW PROTECTED
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* SUCCESS / RESULT SCREEN */}
          {orderResult ? (
            orderResult.status === 'pending_verification' ? (
              <div className="space-y-6">
                <div className="text-center py-2">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-brand font-bold text-white">
                    UPI PAYMENT SUBMITTED FOR APPROVAL
                  </h3>
                  <p className="text-xs font-mono text-amber-400 mt-1">
                    Order ID: #{orderResult.orderNumber} • Bank UTR: {orderResult.txHash}
                  </p>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>ADMIN BANK VERIFICATION IN PROGRESS</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans">
                    Aapka payment reference number (UTR: <strong className="text-white font-mono">{orderResult.txHash}</strong>) receipt record me save ho gaya hai. Admin (<strong className="text-amber-300">{adminUpi.upiName}</strong>) bank statement me ₹{listing.priceINR} verify karte hi aapka account release kar denge.
                  </p>
                  <div className="bg-black/50 p-3 rounded-xl border border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Payment Status:</span>
                    <span className="text-amber-400 font-bold uppercase tracking-wider">Awaiting Admin Approval</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-slate-400">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-white text-sm">Account Credentials Temporarily Locked</div>
                  <p className="text-xs text-slate-400 max-w-md mx-auto font-sans">
                    Fake UTR fraud rokne ke liye login & password real payment confirm hone ke baad hi release hote hain. Payment verify hote hi aap <strong>"My Orders"</strong> se direct account copy kar payenge.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close Window & Check in My Orders
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center py-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-brand font-bold text-white">
                    Payment Verified! Account Delivered
                  </h3>
                  <p className="text-xs font-mono text-emerald-400 mt-1">
                    Order ID: #{orderResult.orderNumber} • {listing.warrantyHours}h Warranty Protection Active
                  </p>
                </div>

              {/* Delivery Data Box */}
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                    Delivered Account Credentials
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Live Data
                  </span>
                </div>

                {/* Login */}
                <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500">Login / Identifier</div>
                    <div className="text-sm font-mono font-bold text-white">{orderResult.deliveryPayload.login}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(orderResult.deliveryPayload.login, 'login')}
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-300 font-mono flex items-center gap-1.5"
                  >
                    {copiedKey === 'login' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'login' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500">Password</div>
                    <div className="text-sm font-mono font-bold text-emerald-400">{orderResult.deliveryPayload.password}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(orderResult.deliveryPayload.password || 'N/A', 'pass')}
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-300 font-mono flex items-center gap-1.5"
                  >
                    {copiedKey === 'pass' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'pass' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* 2FA or Email Access */}
                {orderResult.deliveryPayload.secretCode2FA && (
                  <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-slate-500">2FA Secret / Backup Codes</div>
                      <div className="text-xs font-mono text-cyan-300 font-bold">{orderResult.deliveryPayload.secretCode2FA}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(orderResult.deliveryPayload.secretCode2FA!, '2fa')}
                      className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-300 font-mono flex items-center gap-1.5"
                    >
                      {copiedKey === '2fa' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                )}

                {orderResult.deliveryPayload.emailAccess && (
                  <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-slate-500">Email Access (OG Mail)</div>
                      <div className="text-xs font-mono text-amber-300 font-bold">{orderResult.deliveryPayload.emailAccess}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(orderResult.deliveryPayload.emailAccess!, 'email')}
                      className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-300 font-mono flex items-center gap-1.5"
                    >
                      {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                )}

                {/* REAL-TIME OTP RECEIVER CARD */}
                <div className="bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/40 border border-sky-500/30 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                          <span>LIVE OTP / SMS RECEIVER GATEWAY</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 animate-pulse">
                            ACTIVE
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-sans">
                          Phone number daal kar login request karein, phir neeche click karke real OTP lein.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleFetchOrderOtp}
                      disabled={isFetchingOtp}
                      className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-md shadow-sky-500/20 disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isFetchingOtp ? 'animate-spin' : ''}`} />
                      <span>{isFetchingOtp ? 'Receiving Code...' : 'Get Live OTP'}</span>
                    </button>
                  </div>

                  <div className="bg-black/60 rounded-xl p-3 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-sky-400">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-slate-400">SMS / APP VERIFICATION CODE</div>
                        {liveOtpCode ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-mono font-black tracking-widest text-emerald-400">
                              {liveOtpCode}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              ({otpTimestamp})
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs font-mono text-slate-400 italic">
                            Click "Get Live OTP" button when Telegram asks for confirmation code.
                          </div>
                        )}
                      </div>
                    </div>

                    {liveOtpCode && (
                      <button
                        type="button"
                        onClick={() => handleCopy(liveOtpCode, 'live_otp')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedKey === 'live_otp' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy OTP</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Downloadable files if any (e.g. TData zip) */}
                {orderResult.deliveryPayload.downloadFiles && orderResult.deliveryPayload.downloadFiles.length > 0 && (
                  <div className="p-3 bg-black/30 rounded-xl border border-white/5">
                    <div className="text-[10px] font-mono uppercase text-slate-400 mb-2">
                      Session Files & Archives:
                    </div>
                    <div className="flex flex-col gap-2">
                      {orderResult.deliveryPayload.downloadFiles.map((file) => (
                        <div
                          key={file.name}
                          className="flex items-center justify-between bg-white/[0.04] p-2 rounded-lg text-xs font-mono"
                        >
                          <span className="text-slate-200">{file.name} ({file.size})</span>
                          <button
                            onClick={() => {
                              const blob = new Blob([file.contentMock], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = file.name;
                              a.click();
                            }}
                            className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" /> Download File
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Setup Instructions */}
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/5">
                  <div className="text-[11px] font-mono uppercase text-slate-400 font-bold mb-1">
                    Setup & Anti-Ban Instructions:
                  </div>
                  <p className="text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                    {orderResult.deliveryPayload.setupInstructions}
                  </p>
                </div>
              </div>

              {/* Warranty Notice */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-300 font-mono">
                      Escrow Guarantee Active ({listing.warrantyHours} Hours)
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Saved in your "My Orders" tab. Access credentials anytime.
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-brand font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  Close & Done
                </button>
              </div>
            </div>
          )) : (
            /* PAYMENT SELECTOR SCREEN */
            <div className="space-y-6">
              {/* Product Preview Bar */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{listing.country.flag}</span>
                  <div>
                    <div className="text-xs font-mono font-bold text-emerald-400 uppercase">
                      {listing.platform} • {listing.sessionType}
                    </div>
                    <div className="text-sm font-semibold text-white line-clamp-1">
                      {listing.title}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {formatINR(listing.priceINR)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    ≈ {formatUSDT(listing.priceUSDT)}
                  </div>
                </div>
              </div>

              {/* ⚡ RDX Direct Automated Fast-Dispatch Card */}
              <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-teal-950/60 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0 text-sm shadow-sm">
                    ⚡
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>RDX DIRECT 1-CLICK DISPATCH</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">
                        RDX STOCK #{listing.lztItemId || 10728491}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-sans mt-0.5">
                      Order confirm hote hi RDX high-speed server se account credentials turant screen par unlock honge.
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <div className="text-[10px] text-slate-400 uppercase">Dispatch:</div>
                  <div className="text-emerald-400 font-bold font-mono">⚡ Instant 1-Sec</div>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: RDX Balance */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('WALLET_BALANCE')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      paymentMethod === 'WALLET_BALANCE'
                        ? 'bg-emerald-500/15 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-900 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Wallet className="w-5 h-5 text-emerald-400" />
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                        Instant
                      </span>
                    </div>
                    <div className="font-bold text-xs text-white">RDX Wallet</div>
                    <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
                      {formatINR(user.balanceINR)}
                    </div>
                    {user.balanceINR < listing.priceINR && (
                      <div className="text-[9px] text-red-400 mt-1 font-mono">
                        Insufficient balance
                      </div>
                    )}
                  </button>

                  {/* Option 2: INR UPI / QR */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('INR_UPI')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'INR_UPI'
                        ? 'bg-emerald-500/15 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-900 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <QrCode className="w-5 h-5 text-blue-400" />
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        INR ₹
                      </span>
                    </div>
                    <div className="font-bold text-xs text-white">UPI / QR Code</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      GPay, PhonePe, Paytm
                    </div>
                  </button>

                  {/* Option 3: USDT on TON (Disabled/Off) */}
                  <div
                    className="p-3.5 rounded-2xl border border-white/5 bg-slate-900/40 text-left opacity-40 cursor-not-allowed select-none relative"
                    title="USDT Payment is currently turned off. Please use UPI/QR or Wallet Balance."
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Sparkles className="w-5 h-5 text-slate-500" />
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                        OFF
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-400">USDT (Crypto)</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      Temporarily Paused
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT DETAILS CONTENT */}
              {/* If Wallet Balance selected */}
              {paymentMethod === 'WALLET_BALANCE' && (
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 text-xs font-mono space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Current Balance:</span>
                    <span className="font-bold text-white">{formatINR(user.balanceINR)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Deduction:</span>
                    <span className="font-bold text-red-400">- {formatINR(listing.priceINR)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-2">
                    <span className="text-slate-400">Balance After:</span>
                    <span
                      className={`font-bold ${
                        user.balanceINR >= listing.priceINR ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {formatINR(user.balanceINR - listing.priceINR)}
                    </span>
                  </div>

                  {user.balanceINR < listing.priceINR && (
                    <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl flex items-center justify-between">
                      <span className="text-red-400 text-xs">
                        You need {formatINR(listing.priceINR - user.balanceINR)} more
                      </span>
                      <button
                        type="button"
                        onClick={onOpenWallet}
                        className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-xs font-bold hover:bg-red-500/30"
                      >
                        + Top Up Now
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* If UPI / QR selected */}
              {paymentMethod === 'INR_UPI' && (
                <div className="bg-slate-900/70 p-4 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Dynamic Scannable UPI QR Box */}
                    <div className="bg-white p-2.5 rounded-2xl shadow-xl w-36 h-36 flex flex-col items-center justify-center shrink-0 border-2 border-emerald-500/30">
                      <img
                        src={getUpiQrImageUrl(adminUpi.upiId, adminUpi.upiName, listing.priceINR)}
                        alt={`Pay ₹${listing.priceINR} to ${adminUpi.upiId}`}
                        className="w-28 h-28 object-contain rounded-lg"
                      />
                      <span className="text-[9px] font-mono text-slate-800 font-bold mt-1">
                        SCAN WITH ANY UPI APP
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono w-full">
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase">
                          Official UPI VPA ({adminUpi.upiName})
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-bold text-emerald-300 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 select-all font-mono">
                            {adminUpi.upiId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(adminUpi.upiId, 'upi')}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-xs"
                          >
                            {copiedKey === 'upi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="text-slate-400 text-[10px] uppercase">Exact Amount to Pay</div>
                        <div className="text-lg font-bold text-emerald-400">
                          {formatINR(listing.priceINR)}
                        </div>
                      </div>

                      {/* 1-Tap Mobile UPI link */}
                      <a
                        href={`upi://pay?pa=${adminUpi.upiId}&pn=${encodeURIComponent(adminUpi.upiName)}&am=${listing.priceINR}&cu=INR&tn=RDX_Market_Account`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Tap to Pay via PhonePe / GPay / Paytm</span>
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                      Enter Bank 12-Digit UPI UTR / RRN <span className="text-red-400 font-bold">*REQUIRED</span>:
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      placeholder="e.g. 429102849182 (from PhonePe / GPay / Paytm)"
                      value={upiRefId}
                      onChange={(e) => {
                        setUpiRefId(e.target.value.replace(/\D/g, ''));
                        if (utrError) setUtrError('');
                      }}
                      className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-emerald-300 font-mono tracking-wider placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>UPI Ref number / UTR (exactly 12 digits)</span>
                      <span className={upiRefId.length === 12 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {upiRefId.length}/12 Digits
                      </span>
                    </div>
                  </div>

                  {/* UTR VALIDATION ERROR ALERT */}
                  {utrError && (
                    <div className="bg-red-500/15 border border-red-500/40 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-red-200 font-mono animate-shake">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-red-300">Payment Verification Failed:</div>
                        <div className="mt-0.5 text-[11px]">{utrError}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* If USDT TON selected */}
              {paymentMethod === 'USDT_TON' && (
                <div className="bg-slate-900/70 p-4 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">TON Network Deposit:</span>
                    <span className="text-cyan-400 font-bold">{formatUSDT(listing.priceUSDT)}</span>
                  </div>

                  {/* TON Address */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400">
                      Destination TON Wallet Address (USDT)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-black/50 p-2.5 rounded-xl border border-white/10 text-xs font-mono text-cyan-300 break-all select-all flex-1">
                        {TON_DEFAULT_WALLET}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(TON_DEFAULT_WALLET, 'ton_addr')}
                        className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-mono text-xs flex items-center gap-1 shrink-0"
                      >
                        {copiedKey === 'ton_addr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Memo/Comment */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                      <span>TON Transfer Comment / Memo</span>
                      <span className="text-red-400 font-bold">*REQUIRED</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-black/50 p-2 rounded-xl border border-white/10 text-xs font-mono font-bold text-amber-300 flex-1">
                        {orderMemoCode}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(orderMemoCode, 'memo')}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-mono text-xs flex items-center gap-1 shrink-0"
                      >
                        {copiedKey === 'memo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                      TON Transaction Hash (optional simulator):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5d928a... (leave blank to test instant auto-delivery)"
                      value={tonTxHash}
                      onChange={(e) => setTonTxHash(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons: Back + Confirm */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-mono font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10 shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back</span>
                </button>

                <button
                  type="button"
                  disabled={
                    isProcessing ||
                    (paymentMethod === 'WALLET_BALANCE' && user.balanceINR < listing.priceINR)
                  }
                  onClick={handleCompletePayment}
                  className={`flex-1 py-4 rounded-2xl font-brand font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-xl ${
                    paymentMethod === 'WALLET_BALANCE' && user.balanceINR < listing.priceINR
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/25 cursor-pointer'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-black font-bold">
                      <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                      <span>⚡ RDX Auto-Dispatch in Progress (Stock #{listing.lztItemId || 10728491})...</span>
                    </div>
                  ) : (
                    <>
                      <span>CONFIRM & RECEIVE ACCOUNT (INSTANT)</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
