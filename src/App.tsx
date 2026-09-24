import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  Zap,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  ShoppingBag,
  PlusCircle,
  Layers,
  Filter,
  Users,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import {
  AccountListing,
  FilterState,
  Order,
  Platform,
  UserProfile,
  WalletTransaction,
} from './types';
import { INITIAL_LISTINGS, COUNTRIES_LIST } from './data/mockData';
import { Navbar } from './components/Navbar';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { FilterSidebar } from './components/FilterSidebar';
import { ListingCard } from './components/ListingCard';
import { ListingDetailsModal } from './components/ListingDetailsModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { WalletModal } from './components/WalletModal';
import { SellListingModal } from './components/SellListingModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { GuaranteeInfoModal } from './components/GuaranteeInfoModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ShareModal } from './components/ShareModal';
import { AuthModal } from './components/AuthModal';
import { formatINR, formatUSDT } from './utils/helpers';
import {
  applyMarkupToListings,
  generateLztImportedAccounts,
  generateMasterLztCatalog,
  syncAllListingsWithLzt,
  getSavedProfitMargin,
} from './utils/lztMarketSync';

export default function App() {
  // Persistence state - Ensure 100% of accounts are loaded and white-labeled for RDX
  const [listings, setListings] = useState<AccountListing[]>(() => {
    try {
      const margin = getSavedProfitMargin();
      const saved = localStorage.getItem('rdx_market_listings_v8');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 40 && parsed.every((p: AccountListing) => !p.seller.name.includes('LZT'))) {
          return parsed;
        }
      }
      // Guarantee 100% of accounts are loaded with RDX sellers and white-label branding
      const masterLzt = generateMasterLztCatalog(margin);
      const syncedInitial = syncAllListingsWithLzt(INITIAL_LISTINGS, margin);
      const combined = [
        ...masterLzt,
        ...syncedInitial.filter((init) => !masterLzt.some((m) => m.id === init.id)),
      ];
      localStorage.setItem('rdx_market_listings_v8', JSON.stringify(combined));
      localStorage.setItem('rdx_market_listings_v7', JSON.stringify(combined));
      return combined;
    } catch {
      return generateMasterLztCatalog(getSavedProfitMargin());
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('rdx_market_orders');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'ord_demo_01',
              orderNumber: 'RDX-998241',
              listingId: 'rdx-tg-001',
              title: 'Telegram [UK +44] 🇬🇧 2021 Aged Session • Clean TData + Telethon • Premium Ready',
              platform: 'telegram',
              countryFlag: '🇬🇧',
              priceINR: 1250,
              priceUSDT: 14.0,
              paymentMethod: 'WALLET_BALANCE',
              purchasedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
              warrantyExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23).toISOString(),
              warrantyHours: 24,
              status: 'active_guarantee',
              deliveryPayload: INITIAL_LISTINGS[0].deliveryPayload,
              sellerName: 'Vortex_Vendor',
            },
          ];
    } catch {
      return [];
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const authUser = localStorage.getItem('rdx_auth_user');
      return !!authUser;
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const authUser = localStorage.getItem('rdx_auth_user');
      if (authUser) {
        return JSON.parse(authUser);
      }
      const saved = localStorage.getItem('rdx_market_user');
      return saved
        ? JSON.parse(saved)
        : {
            id: 'usr_radhe_01',
            username: 'RDX_Trader',
            email: 'trader@rdxmarket.in',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
            balanceINR: 500,
            balanceUSDT: 5.5,
            role: 'buyer',
            favorites: ['rdx-tg-001', 'rdx-yt-003'],
          };
    } catch {
      return {
        id: 'usr_radhe_01',
        username: 'RDX_Trader',
        email: 'trader@rdxmarket.in',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        balanceINR: 500,
        balanceUSDT: 5.5,
        role: 'buyer',
        favorites: ['rdx-tg-001', 'rdx-yt-003'],
      };
    }
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('rdx_market_txs');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'tx_01',
              type: 'deposit',
              amountINR: 6000,
              amountUSDT: 67.2,
              method: 'UPI Instant QR',
              status: 'completed',
              date: 'Today, 10:14 AM',
            },
            {
              id: 'tx_02',
              type: 'purchase',
              amountINR: 1250,
              amountUSDT: 14.0,
              method: 'RDX Balance',
              status: 'completed',
              date: 'Today, 10:45 AM',
            },
          ];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('rdx_market_listings_v7', JSON.stringify(listings));
    localStorage.setItem('rdx_market_listings_v6', JSON.stringify(listings));
    localStorage.setItem('rdx_market_listings_v5', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('rdx_market_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rdx_market_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('rdx_market_txs', JSON.stringify(transactions));
  }, [transactions]);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    platform: 'all',
    selectedCountries: [],
    minPrice: '',
    maxPrice: '',
    emailType: 'all',
    phoneLinked: 'all',
    sessionType: 'all',
    autoDeliveryOnly: false,
    warrantyOnly: false,
    minRating: 0,
    sortBy: 'newest',
  });

  const [currentView, setCurrentView] = useState('catalog');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Modals state
  const [inspectListing, setInspectListing] = useState<AccountListing | null>(null);
  const [checkoutListing, setCheckoutListing] = useState<AccountListing | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isGuaranteeOpen, setIsGuaranteeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Universal Global Back Action: closes top-level modal or resets non-catalog view / filters
  const handleGlobalBack = () => {
    if (checkoutListing) {
      setCheckoutListing(null);
      return;
    }
    if (inspectListing) {
      setInspectListing(null);
      return;
    }
    if (isProfileOpen) {
      setIsProfileOpen(false);
      return;
    }
    if (isWalletOpen) {
      setIsWalletOpen(false);
      return;
    }
    if (isOrdersOpen) {
      setIsOrdersOpen(false);
      return;
    }
    if (isSellOpen) {
      setIsSellOpen(false);
      return;
    }
    if (isAdminOpen) {
      setIsAdminOpen(false);
      return;
    }
    if (isGuaranteeOpen) {
      setIsGuaranteeOpen(false);
      return;
    }
    if (isShareOpen) {
      setIsShareOpen(false);
      return;
    }
    if (currentView !== 'catalog') {
      setCurrentView('catalog');
      return;
    }
    handleResetFilters();
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      platform: 'all',
      selectedCountries: [],
      minPrice: '',
      maxPrice: '',
      emailType: 'all',
      phoneLinked: 'all',
      sessionType: 'all',
      autoDeliveryOnly: false,
      warrantyOnly: false,
      accessType: 'all',
      minRating: 0,
      sortBy: 'newest',
    });
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setUser((prev) => {
      const exists = prev.favorites.includes(id);
      const updatedFavorites = exists
        ? prev.favorites.filter((f) => f !== id)
        : [...prev.favorites, id];
      showToast(exists ? 'Removed from favorites' : 'Saved to favorites ⭐');
      return { ...prev, favorites: updatedFavorites };
    });
  };

  // Compute category counts
  const listingCounts = useMemo(() => {
    const counts: Record<string, number> = { all: listings.length };
    listings.forEach((item) => {
      counts[item.platform] = (counts[item.platform] || 0) + 1;
    });
    return counts;
  }, [listings]);

  // Filter listings based on deep filters
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Platform filter
      if (filters.platform !== 'all' && item.platform !== filters.platform) {
        return false;
      }

      // Search query (title, description, tags, login preview)
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(query));
        const matchesCountry = item.country.name.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesCountry) {
          return false;
        }
      }

      // Country filter
      if (
        filters.selectedCountries.length > 0 &&
        !filters.selectedCountries.includes(item.country.code)
      ) {
        return false;
      }

      // Min & Max Price (INR ₹)
      if (filters.minPrice !== '' && item.priceINR < Number(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice !== '' && item.priceINR > Number(filters.maxPrice)) {
        return false;
      }

      // Email Type
      if (filters.emailType !== 'all' && item.emailType !== filters.emailType) {
        return false;
      }

      // Phone Linked
      if (filters.phoneLinked === 'no' && item.phoneLinked) {
        return false;
      }
      if (filters.phoneLinked === 'yes' && !item.phoneLinked) {
        return false;
      }

      // Session Type
      if (filters.sessionType !== 'all' && item.sessionType !== filters.sessionType) {
        return false;
      }

      // Auto Delivery Only
      if (filters.autoDeliveryOnly && !item.autoDelivery) {
        return false;
      }

      // Warranty Only
      if (filters.warrantyOnly && item.warrantyHours <= 0) {
        return false;
      }

      // Min Rating
      if (filters.minRating > 0 && item.seller.rating < filters.minRating) {
        return false;
      }

      // Access Type (Resell Shared Multi-Login vs Exclusive 1-Owner)
      if (filters.accessType && filters.accessType !== 'all') {
        if (filters.accessType === 'shared_resell' && !item.isResellShared) {
          return false;
        }
        if (filters.accessType === 'exclusive' && item.isResellShared) {
          return false;
        }
      }

      // LZT Only filter
      if (filters.lztOnly && !item.isLztConnected) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.priceINR - b.priceINR;
      if (filters.sortBy === 'price_desc') return b.priceINR - a.priceINR;
      if (filters.sortBy === 'rating') return b.seller.rating - a.seller.rating;
      if (filters.sortBy === 'popularity') return b.views - a.views;
      // Default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [listings, filters]);

  // Handle Order Success
  const handleOrderSuccess = (newOrder: Order, updatedUser: UserProfile) => {
    setOrders((prev) => [newOrder, ...prev]);
    setUser(updatedUser);

    // Record wallet transaction
    setTransactions((prev) => [
      {
        id: `tx_${Date.now()}`,
        type: 'purchase',
        amountINR: newOrder.priceINR,
        amountUSDT: newOrder.priceUSDT,
        method: newOrder.paymentMethod,
        status: 'completed',
        date: 'Just now',
        txHash: newOrder.txHash,
      },
      ...prev,
    ]);

    showToast(`Order #${newOrder.orderNumber} successfully delivered!`);
  };

  // Handle Wallet Deposit
  const handleDeposit = (amountINR: number, method: string, txHash?: string) => {
    setUser((prev) => ({
      ...prev,
      balanceINR: prev.balanceINR + amountINR,
      balanceUSDT: prev.balanceUSDT + Number((amountINR / 89.25).toFixed(2)),
    }));

    setTransactions((prev) => [
      {
        id: `tx_${Date.now()}`,
        type: 'deposit',
        amountINR,
        amountUSDT: Number((amountINR / 89.25).toFixed(2)),
        method,
        status: 'completed',
        date: 'Just now',
        txHash,
      },
      ...prev,
    ]);

    showToast(`Successfully credited ${formatINR(amountINR)} to your wallet!`);
  };

  // Add new Listing from seller
  const handleAddListing = (newListing: AccountListing) => {
    setListings((prev) => [newListing, ...prev]);
    showToast('Your account listing was approved & published to catalog!');
  };

  // Admin Actions
  const handleDeleteListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    showToast('Listing removed by administrator.');
  };

  const handleToggleFeatureListing = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, featured: !l.featured } : l))
    );
    showToast('Featured status updated.');
  };

  const handleResolveDispute = (orderId: string, action: 'refund' | 'dismiss') => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    if (action === 'refund') {
      setUser((prev) => ({
        ...prev,
        balanceINR: prev.balanceINR + targetOrder.priceINR,
      }));
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'refunded' } : o))
      );
      setTransactions((prev) => [
        {
          id: `tx_ref_${Date.now()}`,
          type: 'refund',
          amountINR: targetOrder.priceINR,
          amountUSDT: targetOrder.priceUSDT,
          method: 'Escrow Warranty Refund',
          status: 'completed',
          date: 'Just now',
        },
        ...prev,
      ]);
      showToast(`Escrow dispute resolved: Refunded ${formatINR(targetOrder.priceINR)} to buyer.`);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'completed' } : o))
      );
      showToast('Dispute closed. Funds released to seller.');
    }
  };

  const handleApproveOrder = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'active_guarantee',
              warrantyExpiresAt: new Date(
                Date.now() + o.warrantyHours * 60 * 60 * 1000
              ).toISOString(),
            }
          : o
      )
    );
    showToast(`Payment verified! Order #${target.orderNumber} approved and credentials released.`);
  };

  const handleRejectOrder = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'rejected_fake_utr' } : o
      )
    );
    showToast(`Order #${target.orderNumber} rejected (Fake/Invalid UTR). Credentials blocked.`);
  };

  const handleOpenDisputeFromBuyer = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'disputed' } : o))
    );
    showToast('Dispute ticket opened! Funds frozen in escrow until review.');
  };

  const [isLztSyncing, setIsLztSyncing] = useState(false);

  const handleManualLztSync = () => {
    setIsLztSyncing(true);
    const margin = getSavedProfitMargin();
    setTimeout(() => {
      setListings((prev) => {
        const master = generateMasterLztCatalog(margin);
        const combined = [...master, ...prev.filter((p) => !master.some((m) => m.id === p.id))];
        return syncAllListingsWithLzt(combined, margin);
      });
      setIsLztSyncing(false);
      showToast('🟢 100% of accounts synced and connected with https://lzt.market!');
    }, 800);
  };

  const handleUpdateAllListingsMarkup = (marginPercent: number) => {
    setListings((prev) => {
      const updated = syncAllListingsWithLzt(prev, marginPercent);
      return updated;
    });
    showToast(`All accounts updated with +${marginPercent}% profit margin!`);
  };

  const handleImportLztAccounts = (marginPercent: number) => {
    const margin = marginPercent || getSavedProfitMargin();
    const master = generateMasterLztCatalog(margin);
    setListings((prev) => {
      const combined = [...master, ...prev.filter((p) => !master.some((m) => m.id === p.id))];
      return syncAllListingsWithLzt(combined, margin);
    });
    showToast(`Refreshed & connected ${master.length} official accounts with +${margin}% profit!`);
  };

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setIsAuthenticated(true);
    showToast(`Welcome ${authenticatedUser.username}! Verification successful.`);
  };

  const handleLogout = () => {
    localStorage.removeItem('rdx_auth_user');
    localStorage.removeItem('rdx_auth_phone');
    setIsAuthenticated(false);
    showToast('Logged out. Please verify mobile OTP to sign in again.');
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121927] border border-emerald-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-mono text-xs animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        user={user}
        ordersCount={orders.length}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenSell={() => setIsSellOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenGuarantee={() => setIsGuaranteeOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onChangeUserRole={(role) => {
          setUser((prev) => ({ ...prev, role }));
          showToast(`Switched active view role to: ${role.toUpperCase()}`);
        }}
        onLogout={handleLogout}
      />

      {/* 🟢 Live RDX High-Speed Automated Dispatch Network Bar */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-b border-emerald-500/30 px-4 py-2 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>RDX CLOUD NETWORK LIVE</span>
            </span>

            <span className="text-slate-300 hidden sm:inline">
              100% Instant Delivery Engine • <strong className="text-white font-mono">24/7 Automated Escrow Active</strong>
            </span>

            <span className="text-slate-400 text-[11px] bg-black/40 px-2 py-0.5 rounded border border-white/5">
              <strong className="text-emerald-300">{listings.length}</strong> Prime Accounts In Stock
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualLztSync}
              disabled={isLztSyncing}
              className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-brand font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-60"
              title="Refresh RDX Real-Time Stock"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLztSyncing ? 'animate-spin' : ''}`} />
              <span>{isLztSyncing ? 'Refreshing Stock...' : '⚡ Refresh Live Stock'}</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-mono flex items-center gap-1 transition-all border border-white/10 cursor-pointer"
                title="Admin Profit Margin Settings"
              >
                <Sliders className="w-3 h-3 text-cyan-400" />
                <span>Margin (+{getSavedProfitMargin()}%)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Horizontal Bar */}
      <CategoryFilterBar
        currentPlatform={filters.platform}
        onSelectPlatform={(plat) =>
          setFilters((prev) => ({ ...prev, platform: plat }))
        }
        listingCounts={listingCounts}
      />

      {/* Active Navigation & Universal Back Bar */}
      {(currentView !== 'catalog' ||
        filters.platform !== 'all' ||
        filters.search !== '' ||
        (filters.accessType && filters.accessType !== 'all') ||
        filters.minPrice !== '' ||
        filters.maxPrice !== '') && (
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border-b border-emerald-500/30 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleGlobalBack}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-brand font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                title="Wapas Marketplace me jayein"
              >
                <ArrowLeft className="w-4 h-4 stroke-[3]" />
                <span>← BACK TO MARKETPLACE (वापस जाएं)</span>
              </button>

              <span className="text-xs font-mono text-slate-400">Current View:</span>
              <span className="px-2.5 py-1 rounded-lg bg-black/50 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold flex items-center gap-1">
                {filters.accessType === 'shared_resell' && '🔄 Resell (Shared 1+ Logins)'}
                {filters.accessType === 'exclusive' && 'Single User (Exclusive)'}
                {(!filters.accessType || filters.accessType === 'all') && filters.platform !== 'all' && `${filters.platform.toUpperCase()} Accounts`}
                {(!filters.accessType || filters.accessType === 'all') && filters.platform === 'all' && 'Custom Filtered Listings'}
              </span>

              {filters.search && (
                <span className="text-[11px] font-mono text-slate-400">
                  Search: "<span className="text-white font-bold">{filters.search}</span>"
                </span>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="text-xs font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-[#0e1422] to-[#080b11] border-b border-white/[0.06] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                RDX MARKET • 2026 EDITION
              </span>
              <span className="text-slate-400 text-xs font-mono">
                1 USDT = ₹89.25
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-brand tracking-wide text-white">
              DIGITAL SOCIAL ACCOUNT <span className="text-emerald-400">MARKETPLACE</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1.5 leading-relaxed font-sans">
              Instant automated delivery of aged Telegram sessions (TData/JSON), Instagram, YouTube, X, Discord, and TikTok accounts. Protected by 24h escrow guarantee. Pay in <strong>Indian Rupees (₹)</strong> or <strong>USDT (TON Network)</strong>.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="bg-slate-900/90 border border-white/10 p-3 rounded-2xl min-w-28 text-center">
              <div className="text-[10px] text-slate-500 uppercase">In Stock</div>
              <div className="text-lg font-bold text-emerald-400">{listings.length} Accounts</div>
            </div>

            <div className="bg-slate-900/90 border border-white/10 p-3 rounded-2xl min-w-28 text-center">
              <div className="text-[10px] text-slate-500 uppercase">Avg Delivery</div>
              <div className="text-lg font-bold text-yellow-400">&lt; 1 Second</div>
            </div>

            <div className="bg-slate-900/90 border border-white/10 p-3 rounded-2xl min-w-28 text-center hidden sm:block">
              <div className="text-[10px] text-slate-500 uppercase">Escrow Hold</div>
              <div className="text-lg font-bold text-cyan-400">24h Safe</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Left Sidebar Filters + Right Listings Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4 flex items-center justify-between gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span>{mobileFilterOpen ? 'Hide Filters' : 'Show Market Filters'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-[10px]">
              {filteredListings.length}
            </span>
          </button>

          <button
            onClick={() => setIsSellOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-emerald-500 text-black text-xs font-bold font-brand"
          >
            + Sell Account
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Sidebar (Desktop & Toggleable on Mobile) */}
          <aside
            className={`w-full lg:w-72 shrink-0 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
              totalFilteredCount={filteredListings.length}
            />
          </aside>

          {/* Right Product Grid Area */}
          <div className="flex-1 w-full min-w-0">
            {/* Top Toolbar / Active Filter Chips */}
            <div className="bg-[#0c101a] border border-white/[0.08] rounded-2xl p-3.5 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                <span className="text-slate-400">Showing:</span>
                <span className="font-bold text-white">
                  {filteredListings.length} of {listings.length} Accounts
                </span>

                {filters.platform !== 'all' && (
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase text-[10px]">
                    {filters.platform}
                  </span>
                )}

                {filters.selectedCountries.length > 0 && (
                  <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px]">
                    Geo: {filters.selectedCountries.join(', ')}
                  </span>
                )}

                {filters.minPrice !== '' && (
                  <span className="px-2 py-0.5 rounded-lg bg-white/5 text-slate-300 text-[10px]">
                    &gt; {formatINR(Number(filters.minPrice))}
                  </span>
                )}

                {filters.maxPrice !== '' && (
                  <span className="px-2 py-0.5 rounded-lg bg-white/5 text-slate-300 text-[10px]">
                    &lt; {formatINR(Number(filters.maxPrice))}
                  </span>
                )}
              </div>

              {/* Reset Quick Button */}
              {(filters.search ||
                filters.platform !== 'all' ||
                filters.selectedCountries.length > 0 ||
                filters.minPrice !== '' ||
                filters.maxPrice !== '' ||
                filters.emailType !== 'all') && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear All Filters</span>
                </button>
              )}
            </div>

            {/* Listings Grid */}
            {filteredListings.length === 0 ? (
              <div className="bg-[#0c101a] border border-white/[0.08] rounded-3xl p-12 text-center">
                <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-brand font-bold text-white mb-1">
                  No Accounts Matched Your Filter
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-5 font-mono">
                  Try clearing the price range, country selection, or search query to see all available inventory.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-brand font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  Reset Filters & Show All
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelect={(item) => setInspectListing(item)}
                    onQuickBuy={(item) => setCheckoutListing(item)}
                    isFavorite={user.favorites.includes(listing.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/[0.08] bg-[#090c13] py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center font-brand font-bold text-black text-xs">
              RDX
            </div>
            <span className="font-brand font-bold text-white">RDX MARKET</span>
            <span>• Next-Gen Digital Account Marketplace</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Main Currency: INR (₹)</span>
            <span>•</span>
            <span>Crypto: USDT (TON Network)</span>
            <span>•</span>
            <button
              onClick={() => setIsGuaranteeOpen(true)}
              className="text-emerald-400 hover:underline"
            >
              Escrow Policy
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Account Inspection Details Modal */}
      <ListingDetailsModal
        listing={inspectListing}
        onClose={() => setInspectListing(null)}
        onProceedCheckout={(item) => {
          setInspectListing(null);
          setCheckoutListing(item);
        }}
      />

      {/* 2. Checkout Modal (INR UPI & USDT TON) */}
      <CheckoutModal
        listing={checkoutListing}
        user={user}
        existingOrders={orders}
        onClose={() => setCheckoutListing(null)}
        onOrderSuccess={handleOrderSuccess}
        onOpenWallet={() => {
          setCheckoutListing(null);
          setIsWalletOpen(true);
        }}
      />

      {/* 3. My Orders Modal */}
      {isOrdersOpen && (
        <OrdersModal
          orders={orders}
          onClose={() => setIsOrdersOpen(false)}
          onDisputeOrder={handleOpenDisputeFromBuyer}
        />
      )}

      {/* 4. Wallet & Top-Up Modal */}
      {isWalletOpen && (
        <WalletModal
          user={user}
          transactions={transactions}
          onClose={() => setIsWalletOpen(false)}
          onDeposit={handleDeposit}
        />
      )}

      {/* 5. Sell Account Modal */}
      {isSellOpen && (
        <SellListingModal
          onClose={() => setIsSellOpen(false)}
          onAddListing={handleAddListing}
          sellerName={user.username}
        />
      )}

      {/* 6. Admin Panel Modal */}
      {isAdminOpen && (
        <AdminPanelModal
          listings={listings}
          orders={orders}
          transactions={transactions}
          onClose={() => setIsAdminOpen(false)}
          onDeleteListing={handleDeleteListing}
          onToggleFeatureListing={handleToggleFeatureListing}
          onResolveDispute={handleResolveDispute}
          onUpdateAllListingsMarkup={handleUpdateAllListingsMarkup}
          onImportLztAccounts={handleImportLztAccounts}
          onApproveOrder={handleApproveOrder}
          onRejectOrder={handleRejectOrder}
        />
      )}

      {/* 7. Guarantees & Terms Modal */}
      {isGuaranteeOpen && (
        <GuaranteeInfoModal onClose={() => setIsGuaranteeOpen(false)} />
      )}

      {/* 8. User Profile Modal */}
      {isProfileOpen && (
        <UserProfileModal
          user={user}
          ordersCount={orders.length}
          onClose={() => setIsProfileOpen(false)}
          onOpenWallet={() => {
            setIsProfileOpen(false);
            setIsWalletOpen(true);
          }}
          onOpenOrders={() => {
            setIsProfileOpen(false);
            setIsOrdersOpen(true);
          }}
          onOpenWarranty={() => {
            setIsProfileOpen(false);
            setIsGuaranteeOpen(true);
          }}
        />
      )}

      {/* 9. Share Store Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onShowToast={showToast}
      />

      {/* Floating Global Back Button - Always accessible when modal or non-default state is active */}
      {(inspectListing ||
        checkoutListing ||
        isWalletOpen ||
        isOrdersOpen ||
        isSellOpen ||
        isAdminOpen ||
        isGuaranteeOpen ||
        isProfileOpen ||
        currentView !== 'catalog') && (
        <button
          onClick={handleGlobalBack}
          className="fixed bottom-6 left-6 z-50 bg-slate-950/95 hover:bg-slate-900 text-white border-2 border-emerald-400 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 font-mono font-bold text-xs cursor-pointer transition-all hover:scale-105"
          title="Har jagah se wapas jane ke liye"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3] text-emerald-400" />
          <span>← BACK (वापस जाएं)</span>
        </button>
      )}

      {/* 9. Mandatory Sign-In / Real Mobile OTP Verification Modal */}
      <AuthModal
        isOpen={!isAuthenticated}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
