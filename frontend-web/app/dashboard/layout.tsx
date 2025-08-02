"use client";

import React from "react";
import {RequireAuth} from "@/components/auth/RequireAuth";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/organisms/app-sidebar";


export default function DashboardLayout({ children } : { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <SidebarProvider defaultOpen={false} className="mb-auto">
        <AppSidebar />

        <main className="flex-1 p-6">
          <SidebarTrigger />
          {children}
        </main>

      </SidebarProvider>
    </RequireAuth>
  );
}