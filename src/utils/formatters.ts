import { CalculationResult, PaymentPlanType } from '../types';

/**
 * Format a numeric amount into Ugandan Shillings (UGX)
 */
export function formatUGX(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'UGX 0';
  }
  return `UGX ${Math.round(amount).toLocaleString('en-US')}`;
}

/**
 * Short representation for badges or compact cards, e.g. "UGX 25M"
 */
export function formatCompactUGX(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `UGX ${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `UGX ${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (amount >= 1_000) {
    return `UGX ${(amount / 1_000).toFixed(0)}K`;
  }
  return `UGX ${amount}`;
}

/**
 * Calculate payment breakdown based on selected plan
 */
export function calculatePaymentPlan(
  totalPrice: number,
  planType: PaymentPlanType,
  depositPercent: number = 30,
  durationMonths: number = 12,
  durationYears: number = 2
): CalculationResult {
  const now = new Date();

  if (planType === 'full') {
    // 5% Cash incentive discount on full upfront payment
    const discount = Math.round(totalPrice * 0.05);
    const finalPrice = totalPrice - discount;
    const completion = new Date(now);
    completion.setDate(completion.getDate() + 7); // Title deed transfer started within 7 days

    return {
      totalPriceUGX: finalPrice,
      depositUGX: finalPrice,
      depositPercent: 100,
      balanceUGX: 0,
      instalmentAmountUGX: 0,
      numberOfInstalments: 1,
      instalmentFrequency: 'one-time',
      durationLabel: 'Instant Full Settlement',
      completionDate: completion.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      discountAppliedUGX: discount,
    };
  }

  if (planType === 'monthly') {
    const depositAmount = Math.round((totalPrice * depositPercent) / 100);
    const balance = totalPrice - depositAmount;
    const months = Math.max(1, durationMonths);
    const monthlyInstalment = Math.round(balance / months);

    const completion = new Date(now);
    completion.setMonth(completion.getMonth() + months);

    return {
      totalPriceUGX: totalPrice,
      depositUGX: depositAmount,
      depositPercent,
      balanceUGX: balance,
      instalmentAmountUGX: monthlyInstalment,
      numberOfInstalments: months,
      instalmentFrequency: 'monthly',
      durationLabel: `${months} Months`,
      completionDate: completion.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      discountAppliedUGX: 0,
    };
  }

  // Annual Payment Plan
  const depositAmount = Math.round((totalPrice * depositPercent) / 100);
  const balance = totalPrice - depositAmount;
  const years = Math.max(1, durationYears);
  const annualInstalment = Math.round(balance / years);

  const completion = new Date(now);
  completion.setFullYear(completion.getFullYear() + years);

  return {
    totalPriceUGX: totalPrice,
    depositUGX: depositAmount,
    depositPercent,
    balanceUGX: balance,
    instalmentAmountUGX: annualInstalment,
    numberOfInstalments: years,
    instalmentFrequency: 'annual',
    durationLabel: `${years} Year${years > 1 ? 's' : ''}`,
    completionDate: completion.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    discountAppliedUGX: 0,
  };
}

/**
 * Generate a unique transaction or inquiry reference code
 */
export function generateReference(prefix = 'EH-UGX'): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random}`;
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
