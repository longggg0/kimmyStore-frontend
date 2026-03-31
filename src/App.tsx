import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./Layouts/MainLayout";
import ProductsPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ContactPage from "./pages/ContactPage";


export default function App() {
  return (
    <div>
      
      <Routes>
        <Route element={<MainLayout/>} >
          <Route path="/" element={<HomePage />} />
          <Route path="/productPage" element={<ProductsPage />} />
          <Route path="/productDetailPage" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        
        
      </Routes> 
    </div>
  )
}