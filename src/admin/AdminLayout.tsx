import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Quote, Image as ImageIcon, ShoppingBag, Settings, Phone, BookOpen } from "lucide-react";

const nav = [
  { to: "/admin/index", label: "Customer Stories", Icon: Quote },
  { to: "/admin/products", label: "Products", Icon: ShoppingBag },
  { to: "/admin/banner", label: "Banner", Icon: ImageIcon },
  { to: "/admin/footer", label: "Footer", Icon: Settings },
  { to: "/admin/contact", label: "Contact", Icon: Phone },
  { to: "/admin/shop", label: "Shop", Icon: ShoppingBag },
  { to: "/admin/blog", label: "Blog", Icon: BookOpen },
];

const AdminLayout = () => {
  const location = useLocation();
  const current = nav.find((n) => location.pathname.startsWith(n.to))?.label || "Admin";
  const desc =
    current === "Customer Stories"
      ? "Manage content and presentation for customer testimonials"
      : current === "Products"
      ? "Create, edit, and organize products"
      : current === "Banner"
      ? "Configure hero banners and page headers"
      : current === "Footer"
      ? "Update footer contact and details"
      : current === "Contact"
      ? "Edit contact information and showroom details"
      : current === "Shop"
      ? "Adjust shop page settings"
      : current === "Blog"
      ? "Manage blog header content"
      : "Administration";
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
                <div className="flex items-center justify-between mb-4 p-4 md:p-6 w-full">
                  <div className="w-full">
                    <h1 className="text-xl font-display font-semibold">{current}</h1>
                    <p className="text-sm font-body text-muted-foreground">{desc}</p>
                  </div>
                </div>
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
