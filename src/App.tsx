import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Account from "./pages/Account";
import OrderTracking from "./pages/OrderTracking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";

import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import BannerList from "./admin/BannerList";
import BannerAdmin from "./admin/BannerAdmin";
import FooterAdmin from "./admin/FooterAdmin";
import IndexAdmin from "./admin/IndexAdmin";
import ContactAdmin from "./admin/ContactAdmin";
import BrandsAdmin from "./admin/BrandsAdmin";
import AboutAdmin from "./admin/AboutAdmin";

import ProductAdmin from "./admin/ProductAdmin";
import CategoryAdmin from "./admin/Category";
import TeamAdmin from "./admin/TeamAdmin";
import WhyChooseAdmin from "./admin/WhyChooseAdmin";
import ValuesAdmin from "./admin/ValuesAdmin";
import CertificationsAdmin from "./admin/CertificationsAdmin";
import PoliciesAdmin from "./admin/PoliciesAdmin";
import AdminLogin from "./admin/login"

import { requestNotificationPermission } from "@/firebase-messaging.js";
import { useEffect } from "react";

const queryClient = new QueryClient();

type UserRole = "admin" | "customer" | null;

const getCurrentUserRole = (): UserRole => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("current_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { role?: unknown };
    const role = typeof parsed?.role === "string" ? parsed.role.toLowerCase() : "";
    if (role === "admin" || role === "customer") return role;
    return null;
  } catch {
    return null;
  }
};

const WebsiteShell = () => {
  const role = getCurrentUserRole();
  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account/orders/:orderId" element={<OrderTracking />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const AdminShell = () => {
  const location = useLocation();
  const role = getCurrentUserRole();
  const onAdminLogin = location.pathname === "/admin/login";

  if (role === "customer") {
    return <Navigate to="/" replace />;
  }
  if (role !== "admin" && !onAdminLogin) {
    return <Navigate to="/admin/login" replace />;
  }
  if (role === "admin" && onAdminLogin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="banner" element={<BannerList />} />
            <Route path="index" element={<IndexAdmin />} />
            <Route path="categories" element={<CategoryAdmin />} />
            <Route path="products" element={<ProductAdmin />} />
            <Route path="footer" element={<FooterAdmin />} />
            <Route path="contact" element={<ContactAdmin />} />
            <Route path="brands" element={<BrandsAdmin />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="team" element={<TeamAdmin />} />
            <Route path="why-choose" element={<WhyChooseAdmin />} />
            <Route path="values" element={<ValuesAdmin />} />
            <Route path="certifications" element={<CertificationsAdmin />} />
            <Route path="policies" element={<PoliciesAdmin />} />
          </Route>
          <Route path="login" element={<AdminLogin />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    console.log("App mounted: requesting notification permission...");
    if (typeof window === "undefined") {
      console.warn("Window is undefined - skipping notification request");
      return;
    }
    if (!("Notification" in window)) {
      console.warn("Notifications not supported in this browser");
      return;
    }
    if (!("serviceWorker" in navigator)) {
      console.warn("Service workers not supported in this browser");
      return;
    }

    requestNotificationPermission();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* User-facing routes with navbar and footer */}
                <Route path="/*" element={<WebsiteShell />} />

                {/* Admin routes without navbar and footer */}
                <Route path="/admin/*" element={<AdminShell />} />
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
