import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./Layouts/MainLayout";
import ProductsPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import Dashboard from "./Layouts/Dashboard";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminProductsPage } from "./pages/AdminProductPage";
import { AdminCategoryPage } from "./pages/AdminCategoryPage";
import { AdminOrdersPage } from "./pages/AdminOrderPage";
// import { AdminAddProductPage } from "./pages/AdminAddProductPage";


export default function App() {
  return (
    <div>
      
      <Routes>
        <Route element={<MainLayout/>} >
          <Route path="/" element={<HomePage />} />
          <Route path="/productPage" element={<ProductsPage />} />
          <Route path="/productDetailPage" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart-page" element={<CartPage />} />
          <Route path="/checkout-page" element={<CheckoutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
        </Route>
        <Route element={<Dashboard/>} >
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin-product" element={<AdminProductsPage/>}/>
          <Route path="/admin-category" element={<AdminCategoryPage/>}/>
          <Route path="/admin-order" element={<AdminOrdersPage/>}/>
          {/* <Route path="/admin-addProduct" element={<AdminAddProductPage/>}/> */}
        </Route>
        
        
      </Routes> 
    </div>
  )
}