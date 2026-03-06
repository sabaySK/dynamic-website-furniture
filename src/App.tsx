import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";
import AdminLayout from "./admin/AdminLayout";
import BannerList from "./admin/BannerList";
import BannerAdmin from "./admin/BannerAdmin";
import FooterAdmin from "./admin/FooterAdmin";
import IndexAdmin from "./admin/IndexAdmin";
import ContactAdmin from "./admin/ContactAdmin";
import BlogAdmin from "./admin/BlogAdmin";
import ShopAdmin from "./admin/ShopAdmin";
import ProductAdmin from "./admin/ProductAdmin";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/*" element={
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
            } />
            
            {/* Admin routes without navbar and footer */}
            <Route path="/admin/*" element={
              <div className="flex flex-col min-h-screen">
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<AdminLayout />}>
                      <Route path="banner" element={<BannerList />} />
                      <Route path="index" element={<IndexAdmin />} />
                      <Route path="products" element={<ProductAdmin />} />
                      <Route path="footer" element={<FooterAdmin />} />
                      <Route path="contact" element={<ContactAdmin />} />
                      <Route path="blog" element={<BlogAdmin />} />
                      <Route path="shop" element={<ShopAdmin />} />
                    </Route>
                  </Routes>
                </main>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
