import PublicProductDetails from "@/modules/PublicProductsDetails/PublicProductsDetails";
import {
  getPublicProductBySlug,
  getServerNow,
} from "@/services/products/products.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getPublicProductBySlug(slug);
    const seo = product.productSeo?.[0];
    return {
      title: seo?.metaTitle || product.name,
      description: seo?.metaDescription || "",
      keywords: seo?.metaKeywords || "",
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let product;
  try {
    product = await getPublicProductBySlug(slug);
  } catch {
    notFound();
  }
  const now = getServerNow(); // ❌ Date.now() না, ✅ cached version

  const isFlashSaleActive = !!(
    product.productFlashSale?.flashSale &&
    new Date(product.productFlashSale.flashSaleStartDate).getTime() <= now &&
    new Date(product.productFlashSale.flashSaleEndDate).getTime() >= now
  );

  const isOfferActive = !!(
    product.productOffer?.offerSale &&
    new Date(product.productOffer.offerStartDate).getTime() <= now &&
    new Date(product.productOffer.offerEndDate).getTime() >= now
  );

  return (
    <PublicProductDetails
      product={product}
      relatedProducts={product.relatedProducts ?? []}
      isFlashSaleActive={isFlashSaleActive}
      isOfferActive={isOfferActive}
    />
  );
}
