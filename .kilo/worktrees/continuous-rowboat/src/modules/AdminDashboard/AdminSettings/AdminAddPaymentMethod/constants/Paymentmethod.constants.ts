import { TPaymentCategory } from "@/services/paymentMethod/paymentmethods.service";

export const PROVIDERS_BY_CATEGORY: Record<TPaymentCategory, string[]> = {
  MOBILE_WALLET: ["Bkash", "Nagad", "Rocket"],
  BANK: ["Brac Bank", "Dutch Bangla", "Islami Bank", "Ab Bank", "Agrani Bank"],
};

export const ACCOUNT_TYPES_BY_CATEGORY: Record<TPaymentCategory, string[]> = {
  MOBILE_WALLET: ["Agent", "Personal"],
  BANK: ["Current", "Savings"],
};

export const ALL_PROVIDERS = [
  ...PROVIDERS_BY_CATEGORY.MOBILE_WALLET,
  ...PROVIDERS_BY_CATEGORY.BANK,
];
