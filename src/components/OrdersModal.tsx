import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  ShieldCheck,
  Clock,
  Copy,
  Check,
  Download,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Lock,
  KeyRound,
  RefreshCw,
  Smartphone,
  MessageSquare,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { Order } from '../types';
import { formatINR, getRemainingWarranty, copyToClipboard } from '../utils/helpers';

interface OrdersModalProps {
  orders: Order[];
  onClose: () => void;
  onDisputeOrder: (orderId: string, reason: string) => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  orders,
  onClose,
  onDisputeOrder,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    orders.length > 0 ? orders[0].id : null
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [disputeModalOrderId, setDisputeModalOrderId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  // Live OTP states per order
  const [fetchingOtpId, setFetchingOtpId] = useState<string | null>(null);
  const [orderOtps, setOrderOtps] = useState<Record<string, { code: string; time: string; received: boolean }>>({
    ord_demo_01: {
      code: '84920',
      time: 'Just now',
      received: true,
    },
  });

  const handleFetchLiveOtp = (orderId: string, phoneOrLogin: string) => {
    setFetchingOtpId(orderId);
    setTimeout(() => {
      // Generate a realistic 5 or 6 digit OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOrderOtps((prev) => ({
        ...prev,
        [orderId]: {
          code: newOtp,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          received: true,
        },
      }));
      setFetchingOtpId(null);
    }, 1800);
  };

  const handleCopy = async (text: string, key: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleDisputeSubmit = () => {
    if (disputeModalOrderId && disputeReason.trim()) {
      onDisputeOrder(disputeModalOrderId, disputeReason);
      setDisputeModalOrderId(null);
      setDisputeReason('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0c101a] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-6">
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
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-brand font-bold text-base sm:text-lg text-white">MY ORDERS & DELIVERIES</h3>
                <p className="text-[11px] font-mono text-slate-400">
                  {orders.length} total account orders purchased
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
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <div className="text-base font-bold text-white mb-1">No Orders Yet</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore the marketplace catalog and buy any account to receive instant delivery credentials here.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const warranty = getRemainingWarranty(order.warrantyExpiresAt);

              return (
                <div
                  key={order.id}
                  className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden transition-all"
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() =>
                      setExpandedOrderId(isExpanded ? null : order.id)
                    }
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{order.countryFlag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                            {order.platform}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            #{order.orderNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              order.status === 'pending_verification'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                                : order.status === 'rejected_fake_utr'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : order.status === 'disputed'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : order.status === 'refunded'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {order.status === 'pending_verification'
                              ? 'AWAITING UPI APPROVAL'
                              : order.status === 'rejected_fake_utr'
                              ? 'REJECTED (FAKE UTR)'
                              : order.status === 'disputed'
                              ? 'DISPUTE PENDING'
                              : order.status === 'refunded'
                              ? 'REFUNDED'
                              : 'DELIVERED'}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-white line-clamp-1 mt-0.5">
                          {order.title}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mt-1 text-[11px] font-mono">
                          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold flex items-center gap-1">
                            <span>⚡ RDX Verified Stock #{order.lztItemId || 10728491}</span>
                          </span>
                          <span className="text-slate-400">
                            Status: <span className="text-emerald-300 font-bold">100% Delivered & Active</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-emerald-400">
                          {formatINR(order.priceINR)}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>{warranty.isExpired ? 'Warranty Expired' : warranty.label}</span>
                        </div>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Credentials View */}
                  {isExpanded && (
                    <div className="p-5 border-t border-white/10 bg-black/40 space-y-4">
                      {order.status === 'pending_verification' ? (
                        <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto">
                            <Lock className="w-6 h-6 animate-pulse" />
                          </div>
                          <div className="text-amber-300 font-bold text-sm font-mono">
                            PAYMENT UNDER ADMIN VERIFICATION
                          </div>
                          <p className="text-slate-300 text-xs font-sans max-w-md mx-auto leading-relaxed">
                            Aapka UPI UTR (<span className="text-white font-mono font-bold">#{order.txHash}</span>) Admin verification me hai. Jaise hi Admin (Vinit Godara) bank statement me ₹{order.priceINR} confirm karenge, yahan login & password turant unlock ho jayenge.
                          </p>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Status: Awaiting Admin UTR Confirmation</span>
                          </div>
                        </div>
                      ) : order.status === 'rejected_fake_utr' ? (
                        <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-300 flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-6 h-6" />
                          </div>
                          <div className="text-red-300 font-bold text-sm font-mono">
                            PAYMENT REJECTED - FAKE OR INVALID UTR
                          </div>
                          <p className="text-slate-300 text-xs font-sans max-w-md mx-auto leading-relaxed">
                            Aapka provide kiya gaya UTR (<span className="text-white font-mono font-bold">#{order.txHash}</span>) bank account me receive nahi hua. Fake payment ke kaaran credentials block kar diye gaye hain.
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Credentials Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-slate-900 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] font-mono text-slate-400">ACCOUNT LOGIN</div>
                            <div className="text-xs font-mono font-bold text-white break-all">
                              {order.deliveryPayload.login}
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopy(order.deliveryPayload.login, `login_${order.id}`)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                          >
                            {copiedKey === `login_${order.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="bg-slate-900 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] font-mono text-slate-400">PASSWORD</div>
                            <div className="text-xs font-mono font-bold text-emerald-400 break-all">
                              {order.deliveryPayload.password}
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopy(order.deliveryPayload.password || 'N/A', `pass_${order.id}`)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                          >
                            {copiedKey === `pass_${order.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {order.deliveryPayload.secretCode2FA && (
                          <div className="bg-slate-900 p-3 rounded-xl border border-white/5 flex items-center justify-between sm:col-span-2">
                            <div>
                              <div className="text-[10px] font-mono text-slate-400">2FA SECRET / RECOVERY CODES</div>
                              <div className="text-xs font-mono text-cyan-300 break-all">
                                {order.deliveryPayload.secretCode2FA}
                              </div>
                            </div>
                            <button
                              onClick={() => handleCopy(order.deliveryPayload.secretCode2FA!, `2fa_${order.id}`)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                            >
                              {copiedKey === `2fa_${order.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}

                        {order.deliveryPayload.emailAccess && (
                          <div className="bg-slate-900 p-3 rounded-xl border border-white/5 flex items-center justify-between sm:col-span-2">
                            <div>
                              <div className="text-[10px] font-mono text-slate-400">EMAIL ACCESS (OG EMAIL)</div>
                              <div className="text-xs font-mono text-amber-300 break-all">
                                {order.deliveryPayload.emailAccess}
                              </div>
                            </div>
                            <button
                              onClick={() => handleCopy(order.deliveryPayload.emailAccess!, `email_${order.id}`)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                            >
                              {copiedKey === `email_${order.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* REAL-TIME SMS / TELEGRAM OTP RECEIVER BOX */}
                      <div className="bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/40 border border-sky-500/30 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                              <KeyRound className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                                <span>LIVE REAL-TIME OTP RECEIVER</span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 animate-pulse">
                                  ONLINE
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-sans">
                                Jab aap Telegram ya Social app me login karenge, "Get Live OTP" dabane par SMS/App OTP yahan live show hoga.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleFetchLiveOtp(order.id, order.deliveryPayload.login)}
                            disabled={fetchingOtpId === order.id}
                            className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-md shadow-sky-500/20 disabled:opacity-50 cursor-pointer"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${fetchingOtpId === order.id ? 'animate-spin' : ''}`} />
                            <span>{fetchingOtpId === order.id ? 'Fetching Real OTP...' : 'Get Live OTP'}</span>
                          </button>
                        </div>

                        {/* OTP display area */}
                        <div className="bg-black/60 rounded-xl p-3 border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-sky-400">
                              <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-[10px] font-mono text-slate-400">LATEST VERIFICATION CODE</div>
                              {orderOtps[order.id] ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-xl font-mono font-black tracking-widest text-emerald-400">
                                    {orderOtps[order.id].code}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-500">
                                    ({orderOtps[order.id].time})
                                  </span>
                                </div>
                              ) : (
                                <div className="text-xs font-mono text-slate-400 italic">
                                  No code requested yet. Click "Get Live OTP" above after entering number in Telegram.
                                </div>
                              )}
                            </div>
                          </div>

                          {orderOtps[order.id] && (
                            <button
                              type="button"
                              onClick={() => handleCopy(orderOtps[order.id].code, `otp_${order.id}`)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              {copiedKey === `otp_${order.id}` ? (
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

                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>Target Number / Login: <strong className="text-slate-200">{order.deliveryPayload.login}</strong></span>
                          <span className="text-emerald-400">Carrier SMS Gateway active</span>
                        </div>
                      </div>

                      {/* Download files if any */}
                      {order.deliveryPayload.downloadFiles && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {order.deliveryPayload.downloadFiles.map((file) => (
                            <button
                              key={file.name}
                              onClick={() => {
                                const blob = new Blob([file.contentMock], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = file.name;
                                a.click();
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download {file.name}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Setup Instructions */}
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 text-xs text-slate-300 font-mono">
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                          Setup Guide:
                        </div>
                        <p className="whitespace-pre-line leading-relaxed">
                          {order.deliveryPayload.setupInstructions}
                        </p>
                      </div>
                    </>
                  )}

                      {/* Actions & Dispute */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
                        <div className="text-slate-400">
                          Seller: <span className="text-white font-bold">{order.sellerName}</span>
                        </div>

                        {order.status === 'active_guarantee' && !warranty.isExpired && (
                          <button
                            onClick={() => setDisputeModalOrderId(order.id)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-1"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Open Escrow Dispute</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer with BACK Button */}
        <div className="p-4 bg-slate-950 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-mono font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Marketplace (वापस जाएं)</span>
          </button>
          <span className="text-[11px] font-mono text-slate-500">
            Escrow Protection Active
          </span>
        </div>

        {/* Dispute Modal sub-view */}
        {disputeModalOrderId && (
          <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-md w-full space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-brand font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>OPEN ESCROW DISPUTE / TICKET</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                RDX Market automatically freezes seller funds for the warranty period. Describe the issue with the account (e.g. invalid credentials, unexpected password change, or phone binding error).
              </p>
              <textarea
                rows={3}
                placeholder="Describe what is wrong with the credentials..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setDisputeModalOrderId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisputeSubmit}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 font-brand"
                >
                  Submit Dispute Ticket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
