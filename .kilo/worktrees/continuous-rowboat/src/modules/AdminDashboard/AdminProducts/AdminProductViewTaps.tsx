"use client";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Barcode,
  Globe,
  ImageIcon,
  Info,
  LayoutGrid,
  Tag,
  Truck,
  Video,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { IProduct } from "@/types/AdminProducts/AdminProducts.interface";
import BarCodeTab from "./components/BarCodeTab";
import FlashSaleTab from "./components/FlashSaleTab";
import ImagesTab from "./components/Imagestab";
import InformationTab from "./components/Informationtab";
import OfferTab from "./components/OfferTab";
import RelatedProductsTab from "./components/RelatedProductsTab";
import SeoTab from "./components/SeoTab";
import ShippingTap from "./components/ShippingTap";
import VariationTab from "./components/Variationtab";
import VideoTap from "./components/VideoTap";

export default function AdminProductViewTabs({
  product,
  id,
}: {
  product: IProduct;
  id: string;
}) {
  const router = useRouter();

  return (
    <div>
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 py-4 rounded-t-xl">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-slate-500 hover:text-slate-700"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-slate-400">Dashboard</span>

                <span className="text-slate-300">/</span>

                <span className="text-sm text-slate-400">Products</span>

                <span className="text-slate-300">/</span>

                <span className="text-sm font-medium text-slate-700">View</span>
              </div>

              <h1 className="text-lg font-semibold text-slate-800 mt-0.5 leading-none line-clamp-2">
                {`${product.name.split(" ").slice(0, 50).join(" ")} ...`}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="information" className="w-full">
        {/* ── Tab Bar ── */}
        <div className="bg-white border-b border-slate-200 overflow-x-auto">
          <TabsList className="min-w-max h-auto bg-transparent p-0 gap-0 rounded-none flex">
            {/* Information */}
            <TabsTrigger
              value="information"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3.5 text-sm font-medium rounded-none border-b-2 border-transparent whitespace-nowrap
              data-[state=active]:border-orange-500
              data-[state=active]:text-orange-600
              data-[state=active]:bg-transparent
              data-[state=active]:shadow-none
              text-slate-500 hover:text-slate-700 transition-colors"
            >
              <Info className="h-4 w-4" />
              Information
            </TabsTrigger>

            {/* Images */}
            <TabsTrigger
              value="images"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3.5 text-sm font-medium rounded-none border-b-2 border-transparent whitespace-nowrap
              data-[state=active]:border-orange-500
              data-[state=active]:text-orange-600
              data-[state=active]:bg-transparent
              data-[state=active]:shadow-none
              text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ImageIcon className="h-4 w-4" />
              Images
            </TabsTrigger>

            {/* Variation */}
            <TabsTrigger
              value="variation"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3.5 text-sm font-medium rounded-none border-b-2 border-transparent whitespace-nowrap
              data-[state=active]:border-orange-500
              data-[state=active]:text-orange-600
              data-[state=active]:bg-transparent
              data-[state=active]:shadow-none
              text-slate-500 hover:text-slate-700 transition-colors"
            >
              <LayoutGrid className="h-4 w-4" />
              Variation
            </TabsTrigger>
            {/* Variation */}
            <TabsTrigger
              value="related"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3.5 text-sm font-medium rounded-none border-b-2 border-transparent whitespace-nowrap
              data-[state=active]:border-orange-500
              data-[state=active]:text-orange-600
              data-[state=active]:bg-transparent
              data-[state=active]:shadow-none
              text-slate-500 hover:text-slate-700 transition-colors"
            >
              <LayoutGrid className="h-4 w-4" />
              Related Products
            </TabsTrigger>

            {/* Barcode */}
            <TabsTrigger
              value="barcode"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3.5 text-sm font-medium rounded-none border-b-2 border-transparent whitespace-nowrap
  data-[state=active]:border-orange-500
  data-[state=active]:text-orange-600
  data-[state=active]:bg-transparent
  data-[state=active]:shadow-none
  text-slate-500 hover:text-slate-700 transition-colors"
            >
              <Barcode className="h-4 w-4" />
              Barcode
            </TabsTrigger>

            {/* Offer */}
            <TabsTrigger
              value="offer"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3.5 text-sm font-medium rounded-none border-b-2 border-transparent whitespace-nowrap
  data-[state=active]:border-orange-500
  data-[state=active]:text-orange-600
  data-[state=active]:bg-transparent
  data-[state=active]:shadow-none
  text-slate-500 hover:text-slate-700 transition-colors"
            >
              <Tag className="h-4 w-4" />
              Offer
            </TabsTrigger>
            {/* Flash Sale  */}
            <TabsTrigger
              value="flashSale"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3.5 text-sm font-medium rounded-none border-b-2 border-transparent whitespace-nowrap
  data-[state=active]:border-orange-500
  data-[state=active]:text-orange-600
  data-[state=active]:bg-transparent
  data-[state=active]:shadow-none
  text-slate-500 hover:text-slate-700 transition-colors"
            >
              <Zap className="h-4 w-4" />
              Flash Sale
            </TabsTrigger>

            {/* Video */}
            <TabsTrigger
              value="video"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3.5 text-sm font-medium rounded-none border-b-2 border-transparent whitespace-nowrap
  data-[state=active]:border-orange-500
  data-[state=active]:text-orange-600
  data-[state=active]:bg-transparent
  data-[state=active]:shadow-none
  text-slate-500 hover:text-slate-700 transition-colors"
            >
              <Video className="h-4 w-4" />
              Video
            </TabsTrigger>

            {/* Shipping & Return */}
            <TabsTrigger
              value="shipping"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3.5 text-sm font-medium rounded-none border-b-2 border-transparent whitespace-nowrap
  data-[state=active]:border-orange-500
  data-[state=active]:text-orange-600
  data-[state=active]:bg-transparent
  data-[state=active]:shadow-none
  text-slate-500 hover:text-slate-700 transition-colors"
            >
              <Truck className="h-4 w-4" />
              Shipping & Return
            </TabsTrigger>

            {/* SEO */}
            <TabsTrigger
              value="seo"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3.5 text-sm font-medium rounded-none border-b-2 border-transparent whitespace-nowrap
  data-[state=active]:border-orange-500
  data-[state=active]:text-orange-600
  data-[state=active]:bg-transparent
  data-[state=active]:shadow-none
  text-slate-500 hover:text-slate-700 transition-colors"
            >
              <Globe className="h-4 w-4" />
              SEO
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ── Tab Content ── */}
        <div className="py-3">
          <TabsContent value="information" className="mt-0">
            <InformationTab product={product} />
          </TabsContent>

          <TabsContent value="images" className="mt-0">
            <ImagesTab productId={id} />
          </TabsContent>

          <TabsContent value="variation" className="mt-0">
            <VariationTab productId={id} />
          </TabsContent>
          <TabsContent value="related" className="mt-0">
            <RelatedProductsTab productId={id} />
          </TabsContent>
          <TabsContent value="barcode" className="mt-0">
            <BarCodeTab productId={id} />
          </TabsContent>
          <TabsContent value="offer" className="mt-0">
            <OfferTab productId={id} />
          </TabsContent>
          <TabsContent value="flashSale" className="mt-0">
            <FlashSaleTab productId={id} />
          </TabsContent>
          <TabsContent value="video" className="mt-0">
            <VideoTap productId={id} />
          </TabsContent>
          <TabsContent value="shipping" className="mt-0">
            <ShippingTap productId={id} />
          </TabsContent>
          <TabsContent value="seo" className="mt-0">
            <SeoTab productId={id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
