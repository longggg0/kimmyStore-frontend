import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./style/globals.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "./Context/AuthContext.tsx"
import { CartProvider } from "./Context/CartContext.tsx"
import { WishlistProvider } from "./Context/WishlistContext.tsx"
import { LanguageProvider } from "./Context/LanguageContext.tsx"
import ScrollToTop from "./utils/ScrollToTop.tsx"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
        <ScrollToTop />
          <AuthProvider>  
            <LanguageProvider>
            <CartProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </CartProvider>
            </LanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)