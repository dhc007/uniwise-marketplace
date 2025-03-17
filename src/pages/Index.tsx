
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import Hero from "@/components/Hero";
import ProductCard, { ProductCardProps } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { BookOpen, Shirt, Beaker, Ruler } from "lucide-react";

// Sample products data
const featuredProducts: ProductCardProps[] = [
  {
    id: "1",
    title: "Engineering Graphics Drafting Kit",
    price: 850,
    description: "Complete drafting kit for Engineering Graphics course. Includes compass, set squares, scales, and more. Used for one semester only.",
    image: "https://images.unsplash.com/photo-1611784728558-6a9848d4c72d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    category: "Drafting Tools",
    condition: "Like New",
    seller: "Rahul M.",
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
    rating: 4.7,
    postedDate: "5 days ago"
  }
];

// Categories data
const categories = [
  { id: "textbooks", name: "Textbooks", icon: BookOpen, count: 128, color: "from-amber-400 to-orange-500" },
  { id: "lab-coats", name: "Lab Coats", icon: Shirt, count: 64, color: "from-blue-400 to-indigo-500" },
  { id: "lab-equipment", name: "Lab Equipment", icon: Beaker, count: 95, color: "from-green-400 to-teal-500" },
  { id: "drafting", name: "Drafting Tools", icon: Ruler, count: 47, color: "from-purple-400 to-pink-500" }
];

const Index = () => {
  const navigate = useNavigate();
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.span 
              className="text-sm font-medium text-unimart-600 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              HANDPICKED FOR YOU
            </motion.span>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Featured Listings
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Browse these quality items from fellow students that might be exactly what you need for your courses.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <Button 
              onClick={() => navigate('/products')}
              className="px-8 bg-unimart-600 hover:bg-unimart-700"
            >
              Browse All Listings
            </Button>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.span 
              className="text-sm font-medium text-unimart-600 mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              EXPLORE BY CATEGORY
            </motion.span>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              What are you looking for?
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Find everything you need for your courses, organized by category.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div 
                key={category.id}
                className="relative overflow-hidden rounded-xl cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/products?category=${category.name}`)}
              >
                <div className={`h-44 bg-gradient-to-r ${category.color} p-6 flex flex-col justify-between text-white`}>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-white/80">{category.count} items</p>
                  </div>
                  <category.icon className="h-10 w-10 opacity-90" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.span 
              className="text-sm font-medium text-unimart-600 mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              GET STARTED
            </motion.span>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              How UniMart Works
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our blockchain-powered platform makes buying and selling seamless and secure.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "List Your Items",
                description: "Take a few photos, add details, and set your price. Your listing is encrypted and stored on our blockchain.",
                icon: "📝",
                delay: 0
              },
              {
                title: "Connect With Buyers",
                description: "Our AI assistant helps match your items with potential buyers looking for exactly what you're selling.",
                icon: "🤝",
                delay: 0.2
              },
              {
                title: "Secure Exchange",
                description: "Each transaction is verified and recorded on our blockchain, ensuring transparency and trust.",
                icon: "🔒",
                delay: 0.4
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step.delay }}
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button onClick={() => navigate('/profile')} className="px-8 bg-unimart-600 hover:bg-unimart-700">
              Start Selling
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">UniMart</h3>
              <p className="text-gray-400">Your university marketplace powered by blockchain technology.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Browse</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Sell</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Textbooks</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Lab Equipment</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Drafting Tools</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Lab Coats</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>University Engineering College</li>
                <li>support@unimart.com</li>
                <li>+91 98765 43210</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2023 UniMart. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-500 text-sm">Secured by blockchain technology</p>
            </div>
          </div>
        </div>
      </footer>
    </MainLayout>
  );
};

export default Index;
