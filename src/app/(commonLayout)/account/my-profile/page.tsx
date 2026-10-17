import { MyProfile } from "@/modules/MyProfile/MyProfile";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { UserCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | IMechnanic",
  description: "Manage your personal information and account settings",
};

export default async function Page() {
  const userInfo = await getUserInfo();

  if (!userInfo) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 ">
        <div className="w-full max-w-sm rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <UserCircle className="text-destructive h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold">Failed to Load Profile</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            We could not load your profile information right now. Please refresh
            the page or try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-96px)] items-center justify-center px-2 md:px-5 bg-[#F1F5F9]">
      <div className="mx-auto w-full max-w-[1400px] ">
        {/* Page Header */}
        <div className="my-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
              <UserCircle className="text-primary h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                My Profile
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage your personal information and account settings
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <MyProfile userInfo={userInfo} />
      </div>
    </section>
  );
}
