import { Customer, Estate, Inquiry, PaymentTransaction, Plot, PlotPurchase } from '../types';
import {
  ADMIN_CREDENTIALS,
  DEMO_CUSTOMER,
  INITIAL_CUSTOMERS,
  INITIAL_ESTATES,
  INITIAL_INQUIRIES,
  INITIAL_PLOTS,
  INITIAL_PURCHASES,
  INITIAL_TRANSACTIONS,
} from '../data/mockData';

const STORAGE_KEYS = {
  ESTATES: 'ehomes_estates',
  PLOTS: 'ehomes_plots',
  CUSTOMERS: 'ehomes_customers',
  CURRENT_USER: 'ehomes_current_user',
  PURCHASES: 'ehomes_purchases',
  TRANSACTIONS: 'ehomes_transactions',
  INQUIRIES: 'ehomes_inquiries',
  FAVORITES: 'ehomes_favorites',
  IS_ADMIN: 'ehomes_is_admin',
};

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('ehomes-storage-update'));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

export const StorageService = {
  // Estates
  getEstates(): Estate[] {
    return safeGet<Estate[]>(STORAGE_KEYS.ESTATES, INITIAL_ESTATES);
  },
  saveEstates(estates: Estate[]): void {
    safeSet(STORAGE_KEYS.ESTATES, estates);
  },
  addEstate(estate: Estate): void {
    const estates = this.getEstates();
    estates.push(estate);
    this.saveEstates(estates);
  },

  // Plots
  getPlots(): Plot[] {
    return safeGet<Plot[]>(STORAGE_KEYS.PLOTS, INITIAL_PLOTS);
  },
  savePlots(plots: Plot[]): void {
    safeSet(STORAGE_KEYS.PLOTS, plots);
  },
  updatePlot(updatedPlot: Plot): void {
    const plots = this.getPlots();
    const index = plots.findIndex((p) => p.id === updatedPlot.id);
    if (index !== -1) {
      plots[index] = updatedPlot;
      this.savePlots(plots);
    }
  },
  updatePlotStatus(plotId: string, status: Plot['status'], reservedBy?: string): void {
    const plots = this.getPlots();
    const index = plots.findIndex((p) => p.id === plotId);
    if (index !== -1) {
      plots[index] = {
        ...plots[index],
        status,
        reservedBy: reservedBy || plots[index].reservedBy,
        reservedDate: status === 'reserved' || status === 'sold' ? new Date().toISOString() : undefined,
      };
      this.savePlots(plots);

      // Also update estate available count
      const estateId = plots[index].estateId;
      const estates = this.getEstates();
      const estateIdx = estates.findIndex((e) => e.id === estateId);
      if (estateIdx !== -1) {
        const estatePlots = plots.filter((p) => p.estateId === estateId);
        estates[estateIdx].availablePlotsCount = estatePlots.filter((p) => p.status === 'available').length;
        this.saveEstates(estates);
      }
    }
  },

  // Customers Management & Email Authentication
  getCustomers(): Customer[] {
    return safeGet<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  },
  saveCustomers(customers: Customer[]): void {
    safeSet(STORAGE_KEYS.CUSTOMERS, customers);
  },
  findCustomerByEmail(email: string): Customer | undefined {
    const normalized = email.trim().toLowerCase();
    const customers = this.getCustomers();
    return customers.find((c) => c.email.trim().toLowerCase() === normalized);
  },
  loginClientByEmail(email: string): { success: boolean; customer?: Customer; error?: string } {
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      return { success: false, error: 'Please enter your email address.' };
    }
    const customer = this.findCustomerByEmail(normalized);
    if (!customer) {
      return {
        success: false,
        error: `No customer account found with email "${email}". Please register to create your account.`,
      };
    }
    this.setCurrentUser(customer);
    return { success: true, customer };
  },
  registerClient(data: {
    name: string;
    email: string;
    phone: string;
    nin?: string;
    address?: string;
  }): { success: boolean; customer: Customer; error?: string } {
    const normalized = data.email.trim().toLowerCase();
    if (!normalized || !data.name.trim() || !data.phone.trim()) {
      return { success: false, customer: {} as Customer, error: 'Full name, phone, and valid email are required.' };
    }
    const existing = this.findCustomerByEmail(normalized);
    if (existing) {
      this.setCurrentUser(existing);
      return { success: true, customer: existing };
    }

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: data.name.trim(),
      email: normalized,
      phone: data.phone.trim(),
      nin: data.nin?.trim() || undefined,
      address: data.address?.trim() || 'Uganda',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const customers = this.getCustomers();
    customers.push(newCustomer);
    this.saveCustomers(customers);
    this.setCurrentUser(newCustomer);

    return { success: true, customer: newCustomer };
  },

  // Current User / Auth State
  getCurrentUser(): Customer | null {
    return safeGet<Customer | null>(STORAGE_KEYS.CURRENT_USER, DEMO_CUSTOMER);
  },
  setCurrentUser(user: Customer | null): void {
    safeSet(STORAGE_KEYS.CURRENT_USER, user);
  },
  logoutClient(): void {
    safeSet(STORAGE_KEYS.CURRENT_USER, null);
  },

  // Single Admin Authentication
  isAdmin(): boolean {
    return safeGet<boolean>(STORAGE_KEYS.IS_ADMIN, false);
  },
  setAdmin(val: boolean): void {
    safeSet(STORAGE_KEYS.IS_ADMIN, val);
  },
  loginAdmin(email: string, password: string): { success: boolean; error?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const targetEmail = ADMIN_CREDENTIALS.email.trim().toLowerCase();

    if (normalizedEmail !== targetEmail) {
      return {
        success: false,
        error: 'Invalid administrator email. Only the designated E-HOMES administrator is permitted access.',
      };
    }

    if (password !== ADMIN_CREDENTIALS.password) {
      return {
        success: false,
        error: 'Incorrect administrator password.',
      };
    }

    this.setAdmin(true);
    return { success: true };
  },
  logoutAdmin(): void {
    this.setAdmin(false);
  },

  // Purchases / Reservations
  getPurchases(): PlotPurchase[] {
    return safeGet<PlotPurchase[]>(STORAGE_KEYS.PURCHASES, INITIAL_PURCHASES);
  },
  savePurchases(purchases: PlotPurchase[]): void {
    safeSet(STORAGE_KEYS.PURCHASES, purchases);
  },
  addPurchase(purchase: PlotPurchase): void {
    const purchases = this.getPurchases();
    purchases.unshift(purchase);
    this.savePurchases(purchases);

    // Also mark the plot as reserved or sold
    this.updatePlotStatus(purchase.plotId, purchase.planType === 'full' ? 'sold' : 'reserved', purchase.customerName);
  },
  updatePurchaseBalance(purchaseId: string, amountPaid: number): PlotPurchase | null {
    const purchases = this.getPurchases();
    const index = purchases.findIndex((p) => p.id === purchaseId);
    if (index !== -1) {
      const prev = purchases[index];
      const newDepositPaid = prev.depositPaidUGX + amountPaid;
      const newBalance = Math.max(0, prev.balanceRemainingUGX - amountPaid);
      const isComplete = newBalance <= 0;

      purchases[index] = {
        ...prev,
        depositPaidUGX: newDepositPaid,
        balanceRemainingUGX: newBalance,
        status: isComplete ? 'completed' : prev.status,
      };

      if (isComplete) {
        this.updatePlotStatus(prev.plotId, 'sold', prev.customerName);
      }

      this.savePurchases(purchases);
      return purchases[index];
    }
    return null;
  },

  // Transactions
  getTransactions(): PaymentTransaction[] {
    return safeGet<PaymentTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  },
  saveTransactions(txs: PaymentTransaction[]): void {
    safeSet(STORAGE_KEYS.TRANSACTIONS, txs);
  },
  addTransaction(tx: PaymentTransaction): void {
    const txs = this.getTransactions();
    txs.unshift(tx);
    this.saveTransactions(txs);
  },
  verifyTransaction(txId: string, status: 'verified' | 'failed'): void {
    const txs = this.getTransactions();
    const index = txs.findIndex((t) => t.id === txId);
    if (index !== -1) {
      txs[index].status = status;
      this.saveTransactions(txs);

      // If verified, update the purchase balance
      if (status === 'verified') {
        this.updatePurchaseBalance(txs[index].purchaseId, txs[index].amountUGX);
      }
    }
  },

  // Inquiries
  getInquiries(): Inquiry[] {
    return safeGet<Inquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
  },
  saveInquiries(inquiries: Inquiry[]): void {
    safeSet(STORAGE_KEYS.INQUIRIES, inquiries);
  },
  addInquiry(inquiry: Inquiry): void {
    const inquiries = this.getInquiries();
    inquiries.unshift(inquiry);
    this.saveInquiries(inquiries);
  },
  updateInquiryStatus(inquiryId: string, status: Inquiry['status']): void {
    const inquiries = this.getInquiries();
    const index = inquiries.findIndex((i) => i.id === inquiryId);
    if (index !== -1) {
      inquiries[index].status = status;
      this.saveInquiries(inquiries);
    }
  },

  // Favorites
  getFavorites(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.FAVORITES, ['plot-gy-101', 'estate-gayaza']);
  },
  toggleFavorite(id: string): boolean {
    const favs = this.getFavorites();
    const exists = favs.includes(id);
    const updated = exists ? favs.filter((f) => f !== id) : [...favs, id];
    safeSet(STORAGE_KEYS.FAVORITES, updated);
    return !exists;
  },

  // Reset to initial demo data
  resetDefaults(): void {
    safeSet(STORAGE_KEYS.ESTATES, INITIAL_ESTATES);
    safeSet(STORAGE_KEYS.PLOTS, INITIAL_PLOTS);
    safeSet(STORAGE_KEYS.CURRENT_USER, DEMO_CUSTOMER);
    safeSet(STORAGE_KEYS.PURCHASES, INITIAL_PURCHASES);
    safeSet(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    safeSet(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    safeSet(STORAGE_KEYS.FAVORITES, ['plot-gy-101']);
    safeSet(STORAGE_KEYS.IS_ADMIN, false);
  },
};
