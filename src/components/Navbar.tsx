
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import BlockchainStatus from "./BlockchainStatus";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle menu animation
  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-unimart-600 to-unimart-800 bg-clip-text text-transparent">
                UniMart
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <motion.nav 
              className="mx-auto hidden space-x-10 md:flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <NavLink to="/">Home</NavLink>
              <NavLink to="/products">Browse</NavLink>
              <NavLink to="/sell">Sell</NavLink>
              <NavLink to="/about">About</NavLink>
            </motion.nav>
          )}

          {/* Desktop Right section */}
          {!isMobile && (
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BlockchainStatus />
              <Button variant="ghost" size="icon">
                <Search className="h-[1.2rem] w-[1.2rem]" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-[1.2rem] w-[1.2rem]" />
              </Button>
              <Link to="/profile">
                <Avatar className="transition-all hover:ring-2 hover:ring-unimart-500">
                  <AvatarFallback className="bg-unimart-100 text-unimart-800">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Link>
            </motion.div>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <div className="flex items-center space-x-4">
              <BlockchainStatus />
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-[1.2rem] w-[1.2rem]" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isMobile && (
          <motion.div 
            className="md:hidden overflow-hidden"
            initial="hidden"
            animate={isMenuOpen ? "visible" : "hidden"}
            variants={menuVariants}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pb-4 pt-2 space-y-1">
              <MobileNavLink to="/">Home</MobileNavLink>
              <MobileNavLink to="/products">Browse</MobileNavLink>
              <MobileNavLink to="/sell">Sell</MobileNavLink>
              <MobileNavLink to="/about">About</MobileNavLink>
              <MobileNavLink to="/profile">Profile</MobileNavLink>
              <div className="pt-2">
                <Button className="w-full justify-start" variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink = ({ to, children }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative px-1 py-2 text-sm font-medium transition-colors`}
    >
      {children}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 w-full bg-unimart-500"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0, scaleX: isActive ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </Link>
  );
};

const MobileNavLink = ({ to, children }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
        isActive 
          ? 'bg-unimart-50 text-unimart-700' 
          : 'hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
