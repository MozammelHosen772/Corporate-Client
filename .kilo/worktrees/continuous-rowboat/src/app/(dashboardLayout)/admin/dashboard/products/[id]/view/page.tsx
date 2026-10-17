import AdminProductViewTaps from "@/modules/AdminDashboard/AdminProducts/AdminProductViewTaps";
import { getProductById } from "@/services/products/products.service";

export default async function ProductViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  return <AdminProductViewTaps product={product} id={id} />;
}
