export const USDT_TON_RATE = 89.25; // 1 USDT = 89.25 INR

export const TON_DEFAULT_WALLET = "EQBynBO23ywHy_CgarY9NK9FTz0yU8VQ3VKbpoG58hp6U_RDX";

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSDT(amount: number): string {
  return `${amount.toFixed(2)} USDT`;
}

export function inrToUSDT(inr: number): number {
  return Number((inr / USDT_TON_RATE).toFixed(2));
}

export function usdtToINR(usdt: number): number {
  return Math.round(usdt * USDT_TON_RATE);
}

export function formatTimeAgo(isoString: string): string {
  try {
    const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return 'Recently';
  }
}

export function getRemainingWarranty(expiresAt: string): {
  isExpired: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  label: string;
} {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) {
    return { isExpired: true, hours: 0, minutes: 0, seconds: 0, label: 'Warranty Expired' };
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return {
    isExpired: false,
    hours,
    minutes,
    seconds,
    label: `${hours}h ${minutes}m left`,
  };
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator?.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  return Promise.resolve(false);
}
