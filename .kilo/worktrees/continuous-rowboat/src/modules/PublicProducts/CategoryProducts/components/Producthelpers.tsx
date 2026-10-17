import { ICategoryProduct } from "@/services/products/category.service";

export const getDiscount = (product: ICategoryProduct): number | null => {
  const mrp = product.mrpPrice;
  const selling = product.sellingPrice ?? mrp;
  if (mrp <= 0 || selling >= mrp) return null;
  return Math.round(((mrp - selling) / mrp) * 100);
};

export const isOnOffer = (product: ICategoryProduct): boolean => {
  if (!product.productOffer?.offerSale) return false;
  const now = new Date();
  const start = new Date(product.productOffer.offerStartDate);
  const end = new Date(product.productOffer.offerEndDate);
  return now >= start && now <= end;
};

export const isFlashSale = (product: ICategoryProduct): boolean => {
  if (!product.productFlashSale?.flashSale) return false;
  const now = new Date();
  const start = new Date(product.productFlashSale.flashSaleStartDate);
  const end = new Date(product.productFlashSale.flashSaleEndDate);
  return now >= start && now <= end;
};
