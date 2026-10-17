import {
  loadShopPageData,
  ShopSearchParams,
} from "@/modules/ShopProducts/constants/loadShopPageData";
import ShopProducstClient from "@/modules/ShopProducts/ShopProducstClient";

import { getCategoryNode } from "@/services/products/category.service"; // ← পাথ চেক করুন
import FetchErrorState from "@/shared/FetchErrorState";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ category: string[] }>;
  searchParams: Promise<ShopSearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const slug = category[category.length - 1];

  try {
    const node = await getCategoryNode(slug);
    return { title: node.current.label };
  } catch {
    return { title: "Category Not Found" };
  }
}

export default async function ShopCategoryPage({
  params,
  searchParams,
}: Props) {
  const { category } = await params;
  const currentSlug = category[category.length - 1];
  const sp = await searchParams;

  let categoryNode;
  try {
    categoryNode = await getCategoryNode(currentSlug); // ✅ breadcrumb + label-এর জন্য রেজাল্ট রাখছি
  } catch {
    notFound();
  }

  let data;
  try {
    data = await loadShopPageData(currentSlug, sp);
  } catch {
    return (
      <section className="w-full py-10 px-2 md:px-4">
        <div className="max-w-[1400px] mx-auto">
          <FetchErrorState
            title="প্রোডাক্ট লোড করা যায়নি"
            message="সার্ভারের সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-6 px-2 md:px-4">
      <div className="max-w-[1400px] mx-auto">
        <ShopProducstClient
          initialProducts={data.result.data}
          meta={data.meta}
          filterOptions={data.filterOptions}
          categories={data.categories}
          currentCategorySlug={currentSlug}
          categoryNode={categoryNode} // ✅ নতুন
        />
      </div>
    </section>
  );
}
