
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import BlockchainStatus from "@/components/BlockchainStatus";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import MockDataService from "@/services/mockDataService";
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  MessageCircle, 
  Share2,
  BookOpen
} from "lucide-react";

// Define the Product type
interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  category: string;
  condition: string;
  subject?: string;
  seller: string;
  sellerDetails?: {
    name: string;
    department: string;
    year: string;
    avatar: string;
    rating: number;
    totalSales: number;
  };
  rating: number;
  postedDate: string;
  location?: string;
  isBlockchainVerified?: boolean;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const dataService = MockDataService.getInstance();
        const productData = await dataService.getProductById(id);
        
        if (productData) {
          // Handle product with single image vs multiple images
          if (!productData.images && productData.image) {
            productData.images = [productData.image];
          }
          
          // If no sellerDetails, create mock one from seller string
          if (!productData.sellerDetails && productData.seller) {
            const sellerName = productData.seller;
            productData.sellerDetails = {
              name: sellerName,
              department: "Student",
              year: "Current Student",
              avatar: `https://i.pravatar.cc/150?u=${sellerName.replace(/\s+/g, '')}`,
              rating: productData.rating || 4.5,
              totalSales: Math.floor(Math.random() * 15) + 1
            };
          }
          
          setProduct(productData);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  // Handle contact seller
  const handleContactSeller = () => {
    // Check if user is logged in
    const userString = localStorage.getItem("unimart_user");
    if (!userString) {
      toast({
        title: "Authentication required",
        description: "Please login to contact sellers",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    toast({
      title: "Message sent",
      description: `Your inquiry has been sent to ${product?.seller}`,
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb and back button */}
        <div className="mb-8">
          <Link to="/products" className="inline-flex items-center text-unimart-600 hover:text-unimart-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={product.images?.[activeImageIndex] || product.image} 
                alt={product.title} 
                className="object-cover w-full h-full"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`cursor-pointer h-20 w-20 rounded-md overflow-hidden border-2 ${index === activeImageIndex ? 'border-unimart-500' : 'border-transparent'}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
          
          {/* Product Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-unimart-100 text-unimart-800 hover:bg-unimart-200">
                  {product.category}
                </Badge>
                {product.subject && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {product.subject}
                  </Badge>
                )}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({
                    title: "Link copied",
                    description: "Product link copied to clipboard",
                  });
                }}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <div className="flex items-center mr-4">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500">{product.postedDate}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {product.location || "Campus"}
                </div>
              </div>
              
              <div className="text-3xl font-bold text-unimart-700 mb-6">
                ₹{product.price}
              </div>
              
              {product.isBlockchainVerified && (
                <div className="mb-6">
                  <BlockchainStatus />
                </div>
              )}
              
              <div className="prose max-w-none mb-8">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p>{product.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <h4 className="text-sm text-gray-500">Condition</h4>
                  <p className="font-medium">{product.condition}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Posted</h4>
                  <p className="font-medium">{product.postedDate}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Seller Information</h3>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={product.sellerDetails?.avatar} />
                    <AvatarFallback>{product.sellerDetails?.name.charAt(0) || product.seller.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{product.sellerDetails?.name || product.seller}</div>
                    <div className="text-sm text-gray-500">
                      {product.sellerDetails?.department}, {product.sellerDetails?.year}
                    </div>
                    <div className="flex items-center mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs ml-1">{product.sellerDetails?.rating || product.rating} • {product.sellerDetails?.totalSales || "New seller"} sales</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full bg-unimart-600 hover:bg-unimart-700"
                  onClick={handleContactSeller}
                >
                  Contact Seller
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleContactSeller}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Seller
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
