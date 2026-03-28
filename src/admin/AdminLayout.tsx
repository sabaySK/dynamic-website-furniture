import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Quote, Image as ImageIcon, ShoppingBag, Settings, Phone, BookOpen, Users, HelpCircle, Heart, Award, LayoutDashboard, FileText, Ruler, Palette } from "lucide-react";
import { NavUser } from "./NavUser";





const nav = [
  { to: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/admin/banner", label: "Banner", Icon: ImageIcon },
  { to: "/admin/index", label: "Customer Stories", Icon: Quote },
  { to: "/admin/categories", label: "Categories", Icon: BookOpen },
  { to: "/admin/brands", label: "Brands", Icon: BookOpen },
  { to: "/admin/products", label: "Products", Icon: ShoppingBag },
  { to: "/admin/sizes", label: "Sizes", Icon: Ruler },
  { to: "/admin/colors", label: "Colors", Icon: Palette },
  { to: "/admin/posts", label: "Posts", Icon: FileText },
  { to: "/admin/about", label: "About", Icon: Settings },
  { to: "/admin/team", label: "Team", Icon: Users },
  { to: "/admin/why-choose", label: "Why Choose Us", Icon: HelpCircle },
  { to: "/admin/values", label: "Our Values", Icon: Heart },
  { to: "/admin/certifications", label: "Certifications", Icon: Award },
  { to: "/admin/policies", label: "Policies", Icon: FileText },
  { to: "/admin/contact", label: "Contact", Icon: Phone },
];





const AdminLayout = () => {
  const location = useLocation();
  const current = nav.find((n) => location.pathname.startsWith(n.to))?.label || "Admin";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="w-64 border-r border-border" variant="sidebar" collapsible="icon">
          <SidebarHeader className="border-b border-border py-4">
            <span className="text-lg font-display font-semibold px-2">Admin Panel</span>
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
            <NavUser />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="bg-background w-full max-w-none">
          <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
            <div className="px-4 flex items-center gap-4 h-16">
              <SidebarTrigger />
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                <span className="hover:text-foreground transition-colors cursor-default">Admin</span>
                <span>/</span>
                <span className="font-medium text-foreground">{current}</span>
              </div>
            </div>
          </header>
          <main className="flex-1 w-full overflow-y-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
