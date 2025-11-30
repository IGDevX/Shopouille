import { NavMain } from "@/components/layout/admin/sidebar/NavMain";
import { NavUser } from "@/components/layout/admin/sidebar/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useNavigation } from "@refinedev/core";
import * as React from "react";
import chatLogo from "../../../../../public/logo.png";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { list } = useNavigation();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <button
          type="button"
          onClick={() => list("home-admin")}
          className="p-0 bg-transparent border-0 cursor-pointer"
          aria-label="Go to home admin list"
        >
          <img src={chatLogo} alt="logo chat" />
        </button>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
