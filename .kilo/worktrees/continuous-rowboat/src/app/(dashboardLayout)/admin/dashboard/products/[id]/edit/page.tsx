import AdminProductEdit from "@/modules/AdminDashboard/AdminProducts/AdminProductEdit";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminProductEdit id={id} />;
}
