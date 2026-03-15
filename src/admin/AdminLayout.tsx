import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Quote, Image as ImageIcon, ShoppingBag, Settings, Phone, BookOpen, Users, HelpCircle, Heart, Award } from "lucide-react";





const nav = [
  { to: "/admin/banner", label: "Banner", Icon: ImageIcon },
  { to: "/admin/index", label: "Customer Stories", Icon: Quote },
  { to: "/admin/categories", label: "Categories", Icon: BookOpen },
  { to: "/admin/brands", label: "Brands", Icon: BookOpen },
  { to: "/admin/products", label: "Products", Icon: ShoppingBag },
  { to: "/admin/about", label: "About", Icon: Settings },
  { to: "/admin/team", label: "Team", Icon: Users },
  { to: "/admin/why-choose", label: "Why Choose Us", Icon: HelpCircle },
  { to: "/admin/values", label: "Our Values", Icon: Heart },
  { to: "/admin/certifications", label: "Certifications", Icon: Award },
  { to: "/admin/contact", label: "Contact", Icon: Phone },
];





const AdminLayout = () => {
  const location = useLocation();
  const current = nav.find((n) => location.pathname.startsWith(n.to))?.label || "Admin";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <Sidebar className="w-64" variant="inset" collapsible="icon">
          <SidebarHeader>
            <span className="text-lg font-display font-semibold">Admin Panel</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarMenu>
                {nav.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        isActive ? "block" : "block opacity-70"
                      }
                    >
                      <SidebarMenuButton asChild isActive={location.pathname.startsWith(item.to)}>
                        <span className="inline-flex items-center gap-2">
                          <item.Icon className="text-primary" />
                          {item.label}
                        </span>
                      </SidebarMenuButton>
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
            <div className="px-1 sm:px-2 md:px-4 lg:px-6 flex items-center justify-between h-12 sm:h-14 md:h-16">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <span className="text-sm font-body text-muted-foreground">Admin</span>
                <span className="text-sm font-body">/</span>
                <span className="text-sm font-body font-medium">{current}</span>
              </div>
            </div>
          </div>
          <div className="p-0 w-full flex-1">
            <div className="p-0 w-full h-full">
              <div className="bg-card border-0 border-t border-border rounded-none shadow-sm p-0 w-full h-full">

                <div className="p-0 md:p-0 w-full h-full flex-1">
                  <div className="w-full h-full">
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
