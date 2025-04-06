
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Featured products data
  const featuredProducts = [
    {
      id: "1",
      title: "Engineering Graphics Drafting Kit",
      price: 850,
      description: "Complete drafting kit for Engineering Graphics course with all necessary tools.",
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
      description: "Standard white lab coat for chemistry labs. Size M. Used for just one semester.",
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
      description: "Calculus: Early Transcendentals by James Stewart. Minimal highlighting, all pages intact.",
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
      description: "Complete set of basic workshop tools required for the Engineering Workshop course.",
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      category: "Tools",
      condition: "Very Good",
      seller: "Vikram P.",
      subject: "Workshop",
      rating: 4.7,
      postedDate: "5 days ago"
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out these popular items from fellow students in your university.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/products">
              <Button className="bg-unimart-600 hover:bg-unimart-700">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
