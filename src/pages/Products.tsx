
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import ProductCard, { ProductCardProps } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Tag,
  SlidersHorizontal,
  X,
  BookOpen
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";

// Sample products data - acts as fallback if no localStorage products
const initialProducts: ProductCardProps[] = [
  {
    id: "1",
    title: "Engineering Graphics Drafting Kit",
    price: 850,
    description: "Complete drafting kit for Engineering Graphics course. Includes compass, set squares, scales, and more. Used for one semester only.",
    image: "https://images.unsplash.com/photo-1611784728558-6a9848d4c72d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    category: "Drafting Tools",
    condition: "Like New",
    seller: "Rahul M.",
    subject: "Engineering Graphics",
    rating: 4.8,
    postedDate: "3 days ago",
    isBlockchainVerified: true
  },
  {
    id: "2",
    title: "Chemistry Lab Coat (White)",
    price: 350,
    description: "Standard white lab coat for chemistry labs. Size M. Used for just one semester, still in great condition.",
    image: "https://images.unsplash.com/photo-1581056771107-24247a7e6794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    category: "Lab Coats",
    condition: "Good",
    seller: "Priya S.",
    subject: "Chemistry",
    rating: 4.5,
    postedDate: "1 week ago"
  },
  {
    id: "3",
    title: "Calculus Textbook (8th Edition)",
    price: 450,
    description: "Calculus: Early Transcendentals by James Stewart. Minimal highlighting, all pages intact. Perfect for first year calculus.",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    category: "Textbooks",
    condition: "Good",
    seller: "Aditya K.",
    subject: "Mathematics",
    rating: 4.2,
    postedDate: "2 days ago",
    isBlockchainVerified: true
  },
  {
    id: "4",
    title: "Workshop Tools Set",
    price: 1200,
    description: "Complete set of basic workshop tools required for the Engineering Workshop course. Includes all necessary tools in a carrying case.",
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    category: "Tools",
    condition: "Very Good",
    seller: "Vikram P.",
    subject: "Workshop",
    rating: 4.7,
    postedDate: "5 days ago"
  },
  {
    id: "5",
    title: "Physics Laboratory Manual",
    price: 200,
    description: "First year Physics lab manual with all experiments. Minimal writing, all pages intact. Perfect for your lab sessions.",
    image: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    category: "Textbooks",
    condition: "Good",
    seller: "Sneha R.",
    subject: "Physics",
    rating: 4.0,
    postedDate: "2 weeks ago"
  },
  {
    id: "6",
    title: "Scientific Calculator (Casio FX-991EX)",
    price: 900,
    description: "Advanced scientific calculator perfect for engineering courses. All functions working perfectly, like new condition.",
    image: "https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    category: "Electronics",
    condition: "Like New",
    seller: "Arjun T.",
    subject: "Mathematics",
    rating: 4.9,
    postedDate: "4 days ago",
    isBlockchainVerified: true
  },
  {
    id: "7",
    title: "Blue Lab Coat for Workshop",
    price: 300,
    description: "Blue lab coat required for mechanical workshop classes. Size L. Used for just one semester, good condition.",
    image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    category: "Lab Coats",
    condition: "Good",
    seller: "Sanjay G.",
    subject: "Workshop",
    rating: 4.3,
    postedDate: "1 week ago"
  },
  {
    id: "8",
    title: "Computer Networks Textbook",
    price: 400,
    description: "Computer Networks by Tanenbaum, 5th Edition. Perfect for Computer Science students. Minimal wear, all pages intact.",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    category: "Textbooks",
    condition: "Very Good",
    seller: "Amit D.",
    subject: "Computer Science",
    rating: 4.6,
    postedDate: "3 days ago"
  }
];

// Categories
const categories = [
  "All Categories",
  "Textbooks",
  "Lab Coats",
  "Drafting Tools",
  "Electronics",
  "Tools",
  "Lab Equipment"
];

// Subjects
const subjects = [
  "All Subjects",
  "Engineering Graphics",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Workshop",
  "Computer Science",
  "Electronics",
  "Mechanics",
  "Other"
];

// Condition options
const conditions = [
  "All Conditions",
  "Like New",
  "Very Good",
  "Good",
  "Acceptable"
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductCardProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedCondition, setSelectedCondition] = useState("All Conditions");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [sortOption, setSortOption] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [blockchainVerifiedOnly, setBlockchainVerifiedOnly] = useState(false);
  const isMobile = useIsMobile();

  // Load products from localStorage or use initial data
  useEffect(() => {
    const localStorageProducts = localStorage.getItem("unimart_products");
    if (localStorageProducts) {
      try {
        const parsedProducts = JSON.parse(localStorageProducts);
        setProducts([...parsedProducts, ...initialProducts]);
      } catch (error) {
        console.error("Error parsing products from localStorage", error);
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
    }
  }, []);

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get("category");
    const subject = searchParams.get("subject");
    const search = searchParams.get("search");
    
    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    }
    
    if (subject && subjects.includes(subject)) {
      setSelectedSubject(subject);
    }
    
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let result = [...products];
    
    // Apply search query filter
    if (searchQuery) {
      result = result.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "All Categories") {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply subject filter
    if (selectedSubject !== "All Subjects") {
      result = result.filter(product => product.subject === selectedSubject);
    }
    
    // Apply condition filter
    if (selectedCondition !== "All Conditions") {
      result = result.filter(product => product.condition === selectedCondition);
    }
    
    // Apply price range filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply blockchain verified only filter
    if (blockchainVerifiedOnly) {
      result = result.filter(product => product.isBlockchainVerified);
    }
    
    // Apply sorting
    switch (sortOption) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // For demo purposes, we'll use a simple sort based on postedDate
        result.sort((a, b) => {
          const dateA = a.postedDate?.includes("Just now") ? new Date() : 
                      a.postedDate?.includes("day") ? new Date(Date.now() - parseInt(a.postedDate.split(" ")[0]) * 24 * 60 * 60 * 1000) : 
                      a.postedDate?.includes("week") ? new Date(Date.now() - parseInt(a.postedDate.split(" ")[0]) * 7 * 24 * 60 * 60 * 1000) : 
                      new Date();
          
          const dateB = b.postedDate?.includes("Just now") ? new Date() : 
                      b.postedDate?.includes("day") ? new Date(Date.now() - parseInt(b.postedDate.split(" ")[0]) * 24 * 60 * 60 * 1000) : 
                      b.postedDate?.includes("week") ? new Date(Date.now() - parseInt(b.postedDate.split(" ")[0]) * 7 * 24 * 60 * 60 * 1000) : 
                      new Date();
                      
          return dateB.getTime() - dateA.getTime();
        });
        break;
    }
    
    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, selectedSubject, selectedCondition, priceRange, blockchainVerifiedOnly, sortOption]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
    
    // Show toast for search
    if (searchQuery) {
      toast({
        title: "Searching for products",
        description: `Showing results for "${searchQuery}"`,
      });
    }
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (value !== "All Categories") {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    setSearchParams(params);
  };

  // Handle subject change
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (value !== "All Subjects") {
      params.set("subject", value);
    } else {
      params.delete("subject");
    }
    setSearchParams(params);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedSubject("All Subjects");
    setSelectedCondition("All Conditions");
    setPriceRange([0, 1500]);
    setSortOption("newest");
    setBlockchainVerifiedOnly(false);
    setSearchParams({});
    
    toast({
      title: "Filters reset",
      description: "Showing all available products",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 pt-8 pb-16">
        {/* Page header */}
        <div className="mb-8">
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Browse Products
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Find what you need from fellow students at affordable prices.
          </motion.p>

          {/* Sell Button */}
          <motion.div 
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Link to="/sell">
              <Button className="bg-unimart-600 hover:bg-unimart-700">
                Sell Your Items
              </Button>
            </Link>
          </motion.div>
        </div>
        
        {/* Search and filters top bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="md:flex-1">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-grow">
                <Input 
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <Button type="submit" className="ml-2 bg-unimart-600 hover:bg-unimart-700">
                Search
              </Button>
            </form>
          </div>
          
          <div className="flex gap-2">
            <Select
              value={sortOption}
              onValueChange={(value) => setSortOption(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
            
            {isMobile && (
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {isFilterOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar (desktop or mobile when opened) */}
          {(!isMobile || isFilterOpen) && (
            <motion.div 
              className="w-full md:w-64 bg-white p-4 rounded-lg border border-gray-200"
              initial={isMobile ? { opacity: 0, height: 0 } : { opacity: 0, x: -20 }}
              animate={isMobile ? { opacity: 1, height: 'auto' } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <h3 className="font-medium">Filters</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-gray-500"
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Category filter */}
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Subject filter - NEW */}
                <div>
                  <Label className="text-sm font-medium">Subject</Label>
                  <Select
                    value={selectedSubject}
                    onValueChange={handleSubjectChange}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Condition filter */}
                <div>
                  <Label className="text-sm font-medium">Condition</Label>
                  <Select
                    value={selectedCondition}
                    onValueChange={(value) => setSelectedCondition(value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Price range filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Price Range</Label>
                    <span className="text-sm text-gray-500">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 1500]}
                    max={1500}
                    step={50}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="mt-2"
                  />
                </div>
                
                {/* Blockchain verified only filter */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="blockchain-verified"
                    className="h-4 w-4 rounded border-gray-300 text-unimart-600 focus:ring-unimart-500"
                    checked={blockchainVerifiedOnly}
                    onChange={(e) => setBlockchainVerifiedOnly(e.target.checked)}
                  />
                  <label htmlFor="blockchain-verified" className="text-sm text-gray-600">
                    Blockchain verified only
                  </label>
                </div>
              </div>
              
              {isMobile && (
                <Button 
                  className="w-full mt-6 bg-unimart-600 hover:bg-unimart-700"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              )}
            </motion.div>
          )}
          
          {/* Products grid */}
          <div className="flex-1">
            {/* Active filters */}
            {(selectedCategory !== "All Categories" || 
              selectedSubject !== "All Subjects" ||
              selectedCondition !== "All Conditions" || 
              priceRange[0] > 0 || priceRange[1] < 1500 || 
              blockchainVerifiedOnly ||
              searchQuery) && (
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Active filters:
                </span>
                
                {searchQuery && (
                  <Badge className="p-2 bg-unimart-50 text-unimart-800 border border-unimart-200 hover:bg-unimart-100 cursor-pointer" onClick={() => setSearchQuery("")}>
                    Search: {searchQuery}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                
                {selectedCategory !== "All Categories" && (
                  <Badge className="p-2 bg-unimart-50 text-unimart-800 border border-unimart-200 hover:bg-unimart-100 cursor-pointer" onClick={() => handleCategoryChange("All Categories")}>
                    Category: {selectedCategory}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                
                {selectedSubject !== "All Subjects" && (
                  <Badge className="p-2 bg-unimart-50 text-unimart-800 border border-unimart-200 hover:bg-unimart-100 cursor-pointer" onClick={() => handleSubjectChange("All Subjects")}>
                    <BookOpen className="h-3 w-3 mr-1" />
                    Subject: {selectedSubject}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                
                {selectedCondition !== "All Conditions" && (
                  <Badge className="p-2 bg-unimart-50 text-unimart-800 border border-unimart-200 hover:bg-unimart-100 cursor-pointer" onClick={() => setSelectedCondition("All Conditions")}>
                    Condition: {selectedCondition}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                
                {(priceRange[0] > 0 || priceRange[1] < 1500) && (
                  <Badge className="p-2 bg-unimart-50 text-unimart-800 border border-unimart-200 hover:bg-unimart-100 cursor-pointer" onClick={() => setPriceRange([0, 1500])}>
                    Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                
                {blockchainVerifiedOnly && (
                  <Badge className="p-2 bg-unimart-50 text-unimart-800 border border-unimart-200 hover:bg-unimart-100 cursor-pointer" onClick={() => setBlockchainVerifiedOnly(false)}>
                    Blockchain Verified Only
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
              </div>
            )}
            
            {/* Results count */}
            <div className="mb-4 text-sm text-gray-500">
              Showing {filteredProducts.length} results
            </div>
            
            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
