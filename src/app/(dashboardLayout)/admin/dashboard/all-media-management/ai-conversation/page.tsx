import AdminAiConversationList from "@/modules/AdminDashboard/AdminMediaManagement/AdminAiConversation/AdminAiConversationList";
import { getAllAiConversations } from "@/services/mediaContentManagement/aiConversation.service";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    publish?: string;
  }>;
}

export default async function AdminAiConversationPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const page = params.page ? Number(params.page) : 1;
  const search = params.search;

  const isPublished =
    params.publish === "true"
      ? true
      : params.publish === "false"
        ? false
        : undefined;

  const { data, meta } = await getAllAiConversations({
    page,
    limit: 10,
    search,
    isPublished,
  });

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-4 text-xl font-semibold text-slate-800">
        AI Conversation Management
      </h1>

      <AdminAiConversationList items={data} meta={meta} />
    </div>
  );
}
