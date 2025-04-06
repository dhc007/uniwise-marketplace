
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";  // Added useState
import { toast } from "@/hooks/use-toast";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Sell from "./pages/Sell";
import About from "./pages/About";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import MongoDBService from "./services/mongodb";

const queryClient = new QueryClient();

const App = () => {
  // Added loading state to prevent rendering before MongoDB connection is established
  const [isLoading, setIsLoading] = useState(true);

  // Initialize MongoDB connection
  useEffect(() => {
    const initMongoDB = async () => {
      try {
        // Create MongoDB connection 
        const mongoService = MongoDBService.getInstance();
        
        // Try to connect first
        const isConnected = await mongoService.connect();
        
        if (isConnected) {
          toast({
            title: "Database Connected",
            description: "Successfully connected to MongoDB database",
          });
          
          // Initialize sample data if needed
          await mongoService.initializeSampleData();
        } else {
          toast({
            title: "Database Connection Failed",
            description: "Using local storage as fallback",
            variant: "destructive",
          });
          console.warn("Falling back to local storage for data persistence");
        }
      } catch (error) {
        console.error("Failed to initialize MongoDB:", error);
        toast({
          title: "Database Error",
          description: "Using local storage as fallback",
          variant: "destructive",
        });
      } finally {
        // Set loading to false regardless of connection status
        setIsLoading(false);
      }
    };

    initMongoDB();
  }, []);

  // Show a simple loading indicator while MongoDB is connecting
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-unimart-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/about" element={<About />} />
            <Route path="/wishlist" element={<Wishlist />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
