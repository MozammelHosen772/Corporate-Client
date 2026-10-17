import { OfferFallback } from "@/modules/PublicProducts/OfferProducts/components/OfferFallback";
import OfferProductsClient from "@/modules/PublicProducts/OfferProducts/components/OfferProductsClient";
import { getPublicOfferProducts } from "@/services/products/offerProducts.service";
import FetchErrorState from "@/shared/FetchErrorState";
import { Suspense } from "react";

async function OfferProductsContent() {
  const data = await getPublicOfferProducts();

  // ✅ fetch fail (server off)
  if (data === null) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-2 md:px-4 py-4">
        <FetchErrorState
          title="অফার প্রোডাক্ট লোড করা যায়নি"
          message="সার্ভারের সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।"
        />
      </div>
    );
  }
  if (!data.products.length) return null;

  return (
    <OfferProductsClient
      initialProducts={data.products}
      nextChangeAt={data.nextChangeAt}
    />
  );
}

export default function OfferProducts() {
  return (
    <Suspense fallback={<OfferFallback />}>
      <OfferProductsContent />
    </Suspense>
  );
}
