import {Sidebar, SidebarContent, SidebarProvider} from "@/components/ui/sidebar";


export function AppSidebar() {
  return (
    <Sidebar variant={"floating"}>
      <SidebarContent />
    </Sidebar>
  )
}