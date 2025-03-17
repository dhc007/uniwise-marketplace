
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Search, BookOpen, Shirt, Ruler, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] 
      } 
    })
  };

  const categories = [
    { name: "Textbooks", icon: BookOpen, color: "bg-amber-50 text-amber-600" },
    { name: "Lab Equipment", icon: Beaker, color: "bg-blue-50 text-blue-600" },
    { name: "Drafting Tools", icon: Ruler, color: "bg-green-50 text-green-600" },
    { name: "Lab Coats", icon: Shirt, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 hero-gradient opacity-10"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }} 
      />
      
      <div className="container mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column (text) */}
          <div className="flex flex-col max-w-2xl">
            <motion.div
              className="inline-flex items-center px-3 py-1 rounded-full bg-unimart-50 border border-unimart-100 text-unimart-800 text-sm font-medium mb-6"
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeVariants}
            >
              <span className="mr-1">For students, by students</span>
              <ChevronRight className="h-4 w-4" />
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance"
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeVariants}
            >
              Your University <br/>
              <span className="bg-gradient-to-r from-unimart-700 to-unimart-500 bg-clip-text text-transparent">
                Marketplace
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-lg text-gray-600 max-w-lg text-balance"
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeVariants}
            >
              Buy and sell university essentials from fellow students. 
              From lab coats to textbooks, find what you need at prices that make sense.
            </motion.p>
            
            <motion.div 
              className="mt-8"
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeVariants}
            >
              <form onSubmit={handleSearch} className="flex max-w-md">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    type="text"
                    placeholder="Search for textbooks, lab coats..."
                    className="pl-10 h-12 rounded-r-none border-r-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="h-12 px-6 rounded-l-none bg-unimart-600 hover:bg-unimart-700"
                >
                  Search
                </Button>
              </form>
            </motion.div>

            {/* Categories */}
            <motion.div 
              className="mt-10 grid grid-cols-2 gap-3"
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeVariants}
            >
              {categories.map((category, index) => (
                <Button
                  key={category.name}
                  variant="outline"
                  className="justify-start border-gray-200 hover:border-unimart-300 hover:bg-unimart-50"
                  onClick={() => navigate(`/products?category=${category.name}`)}
                >
                  <div className={`mr-2 p-1 rounded-md ${category.color}`}>
                    <category.icon className="h-4 w-4" />
                  </div>
                  {category.name}
                </Button>
              ))}
            </motion.div>
          </div>

          {/* Right column (illustration) */}
          <motion.div 
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative rounded-xl overflow-hidden bg-white shadow-2xl border border-gray-100">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                  {/* Sample product cards */}
                  {[1, 2, 3, 4].map((item) => (
                    <motion.div 
                      key={item}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      style={{
                        y: scrollY * (0.02 * item) * (item % 2 === 0 ? -1 : 1)
                      }}
                    >
                      <div className="h-24 bg-gray-200" />
                      <div className="p-3">
                        <div className="h-3 w-3/4 bg-gray-200 rounded-full mb-2" />
                        <div className="h-2 w-1/2 bg-gray-200 rounded-full" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div 
              className="absolute -top-6 -left-6 p-4 glass-card rounded-lg w-40"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              <div className="h-2 w-1/2 bg-gray-200 rounded-full mb-2" />
              <div className="h-6 w-full bg-gray-200 rounded-lg" />
            </motion.div>

            <motion.div 
              className="absolute -bottom-4 -right-4 p-3 glass-card rounded-lg"
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "mirror",
                delay: 1
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-unimart-100" />
                <div>
                  <div className="h-2 w-16 bg-gray-200 rounded-full mb-1" />
                  <div className="h-2 w-10 bg-gray-200 rounded-full" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
