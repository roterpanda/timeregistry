"use client";

import React from "react";
import {RequireAuth} from "@/components/auth/RequireAuth";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/organisms/app-sidebar";


export default function DashboardLayout({ children } : { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex flex-1 min-h-0">
      <SidebarProvider defaultOpen={false} className="flex flex-1 min-h-0">
        <AppSidebar />

        <main className="flex-1 min-h-0 p-6 flex flex-col overflow-auto">
          <SidebarTrigger />
          {children}
        </main>

      </SidebarProvider>
      </div>
    </RequireAuth>
  );
}