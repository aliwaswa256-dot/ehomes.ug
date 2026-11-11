export type PlotStatus = 'available' | 'reserved' | 'sold';
export type PaymentPlanType = 'monthly' | 'annual' | 'full';
export type PaymentMethod = 'mtn_momo' | 'airtel_money' | 'bank_transfer';
export type TitleType = 'Ready Private Mailo' | 'Freehold Title' | 'Customary' | 'Leasehold';

export interface Estate {
  id: string;
  name: string;
  location: string;
  district: string;
  description: string;
  coverImage: string;
  gallery: string[];
  titleType: TitleType;
  surveyStatus: string;
  distanceFromKampala: string;
  googleMapsUrl: string;
  amenities: string[];
  totalPlots: number;
  availablePlotsCount: number;
  startingPriceUGX: number;
  featured?: boolean;
}

export interface Plot {
  id: string;
  estateId: string;
  estateName: string;
  plotNumber: string;
  blockNumber: string;
  dimensions: string; // e.g. "50 x 100 ft (12.5 decimals)"
  sizeSqMeters: number;
  priceUGX: number;
  status: PlotStatus;
  minDepositPercent: number; // e.g. 30
  description: string;
  features: string[];
  reservedBy?: string;
  reservedDate?: string;
  // SVG coordinates for interactive master plan
  svgCoords?: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
  };
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  nin?: string;
  address?: string;
  joinedDate: string;
}

export interface PlotPurchase {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  plotId: string;
  plotNumber: string;
  estateId: string;
  estateName: string;
  purchaseDate: string;
  planType: PaymentPlanType;
  totalPriceUGX: number;
  depositPaidUGX: number;
  balanceRemainingUGX: number;
  instalmentAmountUGX: number;
  tenurePeriod: string; // e.g. "12 Months" or "2 Years" or "Instant"
  nextDueDate?: string;
  status: 'active' | 'completed' | 'pending_verification';
}

export interface PaymentTransaction {
  id: string;
  reference: string;
  purchaseId: string;
  plotNumber: string;
  estateName: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  amountUGX: number;
  method: PaymentMethod;
  providerRef: string;
  phoneNumber?: string;
  bankName?: string;
  status: 'verified' | 'pending' | 'failed';
  date: string;
  notes?: string;
}

export interface Inquiry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  preferredEstateName?: string;
  preferredPlotNumber?: string;
  preferredPaymentPlan?: PaymentPlanType;
  message: string;
  date: string;
  status: 'new' | 'contacted' | 'resolved';
}

export interface CalculationResult {
  totalPriceUGX: number;
  depositUGX: number;
  depositPercent: number;
  balanceUGX: number;
  instalmentAmountUGX: number;
  numberOfInstalments: number;
  instalmentFrequency: 'monthly' | 'annual' | 'one-time';
  durationLabel: string;
  completionDate: string;
  discountAppliedUGX: number;
}
