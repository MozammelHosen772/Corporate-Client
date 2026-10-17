import { getDefaultDashboardRoute } from "@/lib/auth-utils";
import { getNavItemsByRole } from "@/lib/navItems.config";
import { UserInfo } from "@/types/user.interface";
import DashboardSidebarContent from "./DashboardSidebarContent";

const DashboardSidebar = async ({ userInfo }: { userInfo: UserInfo }) => {
  const navItems = await getNavItemsByRole(userInfo.role);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role);

  return (
    <DashboardSidebarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
};

export default DashboardSidebar;
