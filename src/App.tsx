import React, { useState, useEffect } from 'react';
import { Customer, Estate, Inquiry, PaymentPlanType, PaymentTransaction, Plot, PlotPurchase } from './types';
import { StorageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedEstates } from './components/FeaturedEstates';
import { WhyChooseUs } from './components/WhyChooseUs';
import { HowToBuy } from './components/HowToBuy';
import { Testimonials } from './components/Testimonials';
import { AvailableLand } from './components/AvailableLand';
import { PlotSelectionMap } from './components/PlotSelectionMap';
import { PaymentPlansSection } from './components/PaymentPlansSection';
import { PaymentCalculator } from './components/PaymentCalculator';
import { ContactSection } from './components/ContactSection';
import { AboutSection } from './components/AboutSection';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { AuthModal } from './components/AuthModal';
import { InquiryModal } from './components/InquiryModal';
import { Footer } from './components/Footer';
import { ShieldAlert, KeyRound, UserCheck, Lock, Mail } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');

  // Core Data State (synchronized with StorageService)
  const [estates, setEstates] = useState<Estate[]>(() => StorageService.getEstates());
  const [plots, setPlots] = useState<Plot[]>(() => StorageService.getPlots());
  const [purchases, setPurchases] = useState<PlotPurchase[]>(() => StorageService.getPurchases());
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => StorageService.getTransactions());
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => StorageService.getInquiries());
  const [favorites, setFavorites] = useState<string[]>(() => StorageService.getFavorites());
  const [currentUser, setCurrentUser] = useState<Customer | null>(() => StorageService.getCurrentUser());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => StorageService.isAdmin());

  // Interactive Selection State
  const [selectedEstateId, setSelectedEstateId] = useState<string>(() => estates[0]?.id || 'estate-gayaza');
  const [calculatorPlot, setCalculatorPlot] = useState<Plot | null>(null);

  // Modals State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTargetPlot, setPaymentTargetPlot] = useState<Plot | null>(null);
  const [paymentPlanType, setPaymentPlanType] = useState<PaymentPlanType>('monthly');
  const [depositAmountUGX, setDepositAmountUGX] = useState<number>(0);
  const [tenurePeriod, setTenurePeriod] = useState<string>('12 Months');

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [activeReceiptTx, setActiveReceiptTx] = useState<PaymentTransaction | null>(null);
  const [activeReceiptPurchase, setActiveReceiptPurchase] = useState<PlotPurchase | null>(null);

  const [showPropertyDetailsModal, setShowPropertyDetailsModal] = useState(false);
  const [detailsPlot, setDetailsPlot] = useState<Plot | null>(null);
  const [detailsEstate, setDetailsEstate] = useState<Estate | null>(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<'client' | 'admin'>('client');
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryTargetPlot, setInquiryTargetPlot] = useState<Plot | null>(null);

  const handleOpenAuth = (role: 'client' | 'admin' = 'client') => {
    setAuthModalRole(role);
    setShowAuthModal(true);
  };

  // Listen to Storage updates
  useEffect(() => {
    const handleStorageUpdate = () => {
      setEstates(StorageService.getEstates());
      setPlots(StorageService.getPlots());
      setPurchases(StorageService.getPurchases());
      setTransactions(StorageService.getTransactions());
      setInquiries(StorageService.getInquiries());
      setFavorites(StorageService.getFavorites());
      setCurrentUser(StorageService.getCurrentUser());
      setIsAdmin(StorageService.isAdmin());
    };

    window.addEventListener('ehomes-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('ehomes-storage-update', handleStorageUpdate);
  }, []);

  // Handlers
  const handleToggleFavorite = (plotId: string) => {
    const isNowFav = StorageService.toggleFavorite(plotId);
    setFavorites(StorageService.getFavorites());
  };

  const handleOpenBuyPlot = (
    plot: Plot,
    planType: PaymentPlanType = 'monthly',
    deposit?: number,
    tenure: string = '12 Months'
  ) => {
    setPaymentTargetPlot(plot);
    setPaymentPlanType(planType);
    setDepositAmountUGX(deposit || Math.round(plot.priceUGX * 0.3));
    setTenurePeriod(tenure);
    setShowPaymentModal(true);
  };

  const handleCalculatePlot = (plot: Plot) => {
    setCalculatorPlot(plot);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInquirePlot = (plot: Plot) => {
    setInquiryTargetPlot(plot);
    setShowInquiryModal(true);
  };

  const handleViewPlotDetails = (plot: Plot, estate: Estate) => {
    setDetailsPlot(plot);
    setDetailsEstate(estate);
    setShowPropertyDetailsModal(true);
  };

  const handlePaymentSuccess = (transaction: PaymentTransaction) => {
    // 1. Add Transaction
    StorageService.addTransaction(transaction);

    // 2. If it's a new plot purchase
    if (paymentTargetPlot) {
      const isCash = paymentPlanType === 'full';
      const balance = isCash ? 0 : paymentTargetPlot.priceUGX - transaction.amountUGX;

      const newPurchase: PlotPurchase = {
        id: transaction.purchaseId,
        customerId: transaction.customerId,
        customerName: transaction.customerName,
        customerPhone: transaction.phoneNumber || '+256 787 004962',
        customerEmail: transaction.customerEmail || currentUser?.email,
        plotId: paymentTargetPlot.id,
        plotNumber: paymentTargetPlot.plotNumber,
        estateId: paymentTargetPlot.estateId,
        estateName: paymentTargetPlot.estateName,
        purchaseDate: new Date().toISOString(),
        planType: paymentPlanType,
        totalPriceUGX: paymentTargetPlot.priceUGX,
        depositPaidUGX: transaction.amountUGX,
        balanceRemainingUGX: balance,
        instalmentAmountUGX: isCash ? 0 : Math.round(balance / 12),
        tenurePeriod: tenurePeriod,
        nextDueDate: isCash ? undefined : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: isCash || transaction.status === 'verified' ? 'active' : 'pending_verification',
      };

      StorageService.addPurchase(newPurchase);
      setActiveReceiptPurchase(newPurchase);
    }

    // 3. Set Active receipt
    setActiveReceiptTx(transaction);
  };

  const handlePayNextInstalment = (purchase: PlotPurchase) => {
    const targetPlot = plots.find((p) => p.id === purchase.plotId);
    if (!targetPlot) return;

    setPaymentTargetPlot(targetPlot);
    setPaymentPlanType(purchase.planType);
    setDepositAmountUGX(Math.min(purchase.balanceRemainingUGX, purchase.instalmentAmountUGX));
    setTenurePeriod(purchase.tenurePeriod);
    setShowPaymentModal(true);
  };

  const handleAddInquiry = (inquiry: Inquiry) => {
    StorageService.addInquiry(inquiry);
  };

  const handleUpdatePlot = (updatedPlot: Plot) => {
    StorageService.updatePlot(updatedPlot);
  };

  const handleUpdatePlotStatus = (plotId: string, status: Plot['status']) => {
    StorageService.updatePlotStatus(plotId, status);
  };

  const handleVerifyTransaction = (txId: string, status: 'verified' | 'failed') => {
    StorageService.verifyTransaction(txId, status);
  };

  const handleUpdateInquiryStatus = (inquiryId: string, status: Inquiry['status']) => {
    StorageService.updateInquiryStatus(inquiryId, status);
  };

  const handleAddEstate = (newEstate: Estate) => {
    StorageService.addEstate(newEstate);
  };

  const handleOpenReceipt = (tx: PaymentTransaction, purchase?: PlotPurchase) => {
    setActiveReceiptTx(tx);
    setActiveReceiptPurchase(purchase || purchases.find((p) => p.id === tx.purchaseId) || null);
    setShowReceiptModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white">
      {/* Navbar (Strict 3-zone contract with responsive drawer) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onOpenAuth={handleOpenAuth}
        onLogoutAdmin={() => {
          StorageService.logoutAdmin();
          setIsAdmin(false);
          setActiveTab('home');
        }}
        onLogoutClient={() => {
          StorageService.logoutClient();
          setCurrentUser(null);
          setActiveTab('home');
        }}
        onOpenInquiry={() => {
          setInquiryTargetPlot(null);
          setShowInquiryModal(true);
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-16 lg:space-y-24 pb-20">
            {/* Hero Section */}
            <Hero
              onExploreLand={() => {
                setActiveTab('properties');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectPlot={() => {
                setActiveTab('plot-map');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onContactUs={() => {
                setActiveTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenCalculator={() => {
                setActiveTab('calculator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16 lg:space-y-24">
              {/* Featured Land Projects */}
              <FeaturedEstates
                estates={estates}
                onSelectEstate={(estateId) => {
                  setSelectedEstateId(estateId);
                  setActiveTab('plot-map');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExploreAll={() => {
                  setActiveTab('properties');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              {/* Interactive Master Plan Preview */}
              <PlotSelectionMap
                estates={estates}
                plots={plots}
                selectedEstateId={selectedEstateId}
                setSelectedEstateId={setSelectedEstateId}
                onSelectPlotForPurchase={(plot) => handleOpenBuyPlot(plot, 'monthly')}
                onCalculatePlot={handleCalculatePlot}
                onInquirePlot={handleInquirePlot}
              />

              {/* Flexible Payment Plans Section */}
              <PaymentPlansSection
                onOpenCalculator={() => {
                  setActiveTab('calculator');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExplorePlots={() => {
                  setActiveTab('properties');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              {/* Why Choose E-HOMES */}
              <WhyChooseUs />

              {/* How to Purchase Land (4-step process) */}
              <HowToBuy
                onSelectPlot={() => {
                  setActiveTab('plot-map');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenCalculator={() => {
                  setActiveTab('calculator');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              {/* Customer Testimonials */}
              <Testimonials />

              {/* Contact & Bahai Road Office */}
              <ContactSection
                estates={estates}
                plots={plots}
                onAddInquiry={handleAddInquiry}
              />
            </div>
          </div>
        )}

        {/* Available Land Marketplace Page */}
        {activeTab === 'properties' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-14">
            <AvailableLand
              estates={estates}
              plots={plots}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onViewPlotDetails={handleViewPlotDetails}
              onBuyPlot={(plot) => handleOpenBuyPlot(plot, 'monthly')}
              onSelectOnMap={(plot) => {
                setSelectedEstateId(plot.estateId);
                setActiveTab('plot-map');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* Interactive Plot Selection System Master Plan Page */}
        {activeTab === 'plot-map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-14 space-y-10">
            <PlotSelectionMap
              estates={estates}
              plots={plots}
              selectedEstateId={selectedEstateId}
              setSelectedEstateId={setSelectedEstateId}
              onSelectPlotForPurchase={(plot) => handleOpenBuyPlot(plot, 'monthly')}
              onCalculatePlot={handleCalculatePlot}
              onInquirePlot={handleInquirePlot}
            />

            {/* Quick Link to Payment Plans */}
            <PaymentPlansSection
              onOpenCalculator={() => {
                setActiveTab('calculator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExplorePlots={() => {
                setActiveTab('properties');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* Flexible Payment Plans Page */}
        {activeTab === 'payment-plans' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-14 space-y-12">
            <PaymentPlansSection
              onOpenCalculator={() => {
                setActiveTab('calculator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExplorePlots={() => {
                setActiveTab('properties');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <PaymentCalculator
              plots={plots}
              initialSelectedPlot={calculatorPlot}
              onProceedToPayment={(plot, plan, deposit, tenure) =>
                handleOpenBuyPlot(plot, plan, deposit, tenure)
              }
            />
          </div>
        )}

        {/* Payment Calculator Page */}
        {activeTab === 'calculator' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-14 space-y-12">
            <PaymentCalculator
              plots={plots}
              initialSelectedPlot={calculatorPlot}
              onProceedToPayment={(plot, plan, deposit, tenure) =>
                handleOpenBuyPlot(plot, plan, deposit, tenure)
              }
            />

            <PaymentPlansSection
              onOpenCalculator={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              onExplorePlots={() => {
                setActiveTab('properties');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* About Us Page */}
        {activeTab === 'about' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-14 space-y-12">
            <AboutSection />
            <WhyChooseUs />
            <Testimonials />
          </div>
        )}

        {/* Contact Us Page */}
        {activeTab === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-14">
            <ContactSection
              estates={estates}
              plots={plots}
              onAddInquiry={handleAddInquiry}
            />
          </div>
        )}

        {/* Customer Portal / Dashboard */}
        {activeTab === 'customer-portal' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-14">
            {currentUser ? (
              <CustomerDashboard
                currentUser={currentUser}
                purchases={purchases}
                transactions={transactions}
                plots={plots}
                estates={estates}
                favorites={favorites}
                onOpenReceipt={handleOpenReceipt}
                onPayNextInstalment={handlePayNextInstalment}
                onExplorePlots={() => {
                  setActiveTab('properties');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onLogout={() => {
                  StorageService.setCurrentUser(null);
                  setCurrentUser(null);
                  setActiveTab('home');
                }}
              />
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-5 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center mx-auto">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider block">
                    Client Account Required
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    Sign In with Your Email
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Log in with your email address to view your assigned plots, payment schedules, and official title transfer receipts.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                  <button
                    onClick={() => handleOpenAuth('client')}
                    className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>Sign In with Email</span>
                  </button>
                  <button
                    onClick={() => handleOpenAuth('client')}
                    className="px-5 py-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-semibold border border-cyan-200 transition-colors"
                  >
                    Register New Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Admin Dashboard (Protected for the Single Admin) */}
        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-14">
            {isAdmin ? (
              <AdminDashboard
                estates={estates}
                plots={plots}
                purchases={purchases}
                transactions={transactions}
                inquiries={inquiries}
                onUpdatePlot={handleUpdatePlot}
                onUpdatePlotStatus={handleUpdatePlotStatus}
                onVerifyTransaction={handleVerifyTransaction}
                onUpdateInquiryStatus={handleUpdateInquiryStatus}
                onAddEstate={handleAddEstate}
                onOpenReceipt={handleOpenReceipt}
              />
            ) : (
              <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-6 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Restricted Access Terminal
                  </span>
                  <h3 className="text-2xl font-black mt-1">
                    Administrator Authentication Required
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    This terminal is strictly restricted to the authorized E-HOMES administration account.
                    Please log in with the administrator credentials to manage land plots, approve payments, and update project records.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => handleOpenAuth('admin')}
                    className="py-3 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Log In as Administrator</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Global Modals */}
      {showPaymentModal && paymentTargetPlot && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          plot={paymentTargetPlot}
          planType={paymentPlanType}
          depositAmountUGX={depositAmountUGX}
          tenurePeriod={tenurePeriod}
          currentUser={currentUser}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {showReceiptModal && activeReceiptTx && (
        <ReceiptModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          transaction={activeReceiptTx}
          purchase={activeReceiptPurchase}
        />
      )}

      {showPropertyDetailsModal && detailsPlot && detailsEstate && (
        <PropertyDetailsModal
          isOpen={showPropertyDetailsModal}
          onClose={() => setShowPropertyDetailsModal(false)}
          plot={detailsPlot}
          estate={detailsEstate}
          onBuyPlot={(plot) => handleOpenBuyPlot(plot, 'monthly')}
          onCalculatePlot={handleCalculatePlot}
          onInquirePlot={handleInquirePlot}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialRole={authModalRole}
          onClientLoginSuccess={(user) => {
            StorageService.setCurrentUser(user);
            setCurrentUser(user);
            setActiveTab('customer-portal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAdminLoginSuccess={() => {
            StorageService.setAdmin(true);
            setIsAdmin(true);
            setActiveTab('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {showInquiryModal && (
        <InquiryModal
          isOpen={showInquiryModal}
          onClose={() => setShowInquiryModal(false)}
          estates={estates}
          plots={plots}
          initialPlot={inquiryTargetPlot}
          onAddInquiry={handleAddInquiry}
        />
      )}

      {/* Global Footer */}
      <Footer
        onNavigate={(tab) => {
          if (tab === 'admin' && !isAdmin) {
            handleOpenAuth('admin');
            return;
          }
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenInquiry={() => {
          setInquiryTargetPlot(null);
          setShowInquiryModal(true);
        }}
      />
    </div>
  );
}
