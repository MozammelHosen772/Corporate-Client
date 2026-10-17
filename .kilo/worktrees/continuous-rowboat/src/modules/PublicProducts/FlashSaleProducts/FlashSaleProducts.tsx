import { getPublicFlashSaleProducts } from "@/services/products/flashSaleProducts.service";
import FetchErrorState from "@/shared/FetchErrorState";
import FlashSaleProductsClient from "./components/FlashSaleProductsClient";

export default async function FlashSaleProducts() {
  const data = await getPublicFlashSaleProducts();

  // ✅ fetch fail হলে (server off/network issue) সুন্দর retry UI দেখাবে
  if (!data) {
    return (
      <section className="w-full bg-[#F1F5F9] border-b border-gray-100 py-5 px-2 md:px-4">
        <div className="max-w-[1400px] mx-auto">
          <FetchErrorState
            title="ফ্ল্যাশ সেল লোড করা যায়নি"
            message="সার্ভারের সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।"
          />
        </div>
      </section>
    );
  }

  // ✅ ডেটা এসেছে কিন্তু কোনো active flash sale নেই — এটা error না, তাই null (কিছুই দেখাবে না)
  if (!data.products.length) return null;

  return (
    <FlashSaleProductsClient
      initialProducts={data.products}
      nextChangeAt={data.nextChangeAt}
    />
  );
}
