
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, ChevronUp, Search, ShoppingBag, User, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductCardProps } from "./ProductCard";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    text: "Hello! I'm UniBot, your personal assistant for UniMart. Ask me anything about our products, how to sell items, or help finding what you need!",
    sender: "bot",
    timestamp: new Date(),
  },
];

const productSuggestions = [
  "Show me drafting tools",
  "I need a chemistry lab coat",
  "Looking for calculus textbooks",
  "Find electronics for sale",
];

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response after delay
    setTimeout(() => {
      const products = loadProductsFromLocalStorage();
      const botResponse = generateResponse(inputValue, products);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const loadProductsFromLocalStorage = (): ProductCardProps[] => {
    try {
      const storedProducts = localStorage.getItem("unimart_products");
      if (storedProducts) {
        return JSON.parse(storedProducts);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
    return [];
  }

  const generateResponse = (input: string, products: ProductCardProps[]): string => {
    const normalizedInput = input.toLowerCase();
    
    // Search for products
    if (normalizedInput.includes("search") || normalizedInput.includes("find") || normalizedInput.includes("show")) {
      const searchTerms = normalizedInput.split(/\s+/).filter(term => 
        term.length > 3 && 
        !["search", "find", "show", "looking", "need", "want", "for", "about", "the", "and"].includes(term)
      );
      
      if (searchTerms.length > 0) {
        const matchedProducts = products.filter(product => {
          return searchTerms.some(term => 
            product.title.toLowerCase().includes(term) || 
            product.description.toLowerCase().includes(term) || 
            product.category.toLowerCase().includes(term) ||
            (product.subject && product.subject.toLowerCase().includes(term))
          );
        });
        
        if (matchedProducts.length > 0) {
          const productList = matchedProducts.slice(0, 3).map(p => 
            `- ${p.title} (₹${p.price}) - ${p.condition}`
          ).join('\n');
          
          return `I found ${matchedProducts.length} products that match your search. Here are a few:\n\n${productList}\n\nYou can view all results by visiting the Products page.`;
        } else {
          return "I couldn't find any products matching your search. Try browsing the Products page or using different keywords.";
        }
      }
    }
    
    // How to sell items
    if (normalizedInput.includes("sell") || normalizedInput.includes("selling") || normalizedInput.includes("list")) {
      return "To sell an item on UniMart:\n\n1. Make sure you're logged in with your @pccegoa.edu.in email\n2. Click on 'Sell' in the navigation menu\n3. Fill out the product details form\n4. Upload clear photos\n5. Set your price\n6. Submit the listing\n\nYour item will be verified on our blockchain and made available to buyers!";
    }
    
    // Authentication help
    if (normalizedInput.includes("login") || normalizedInput.includes("signup") || normalizedInput.includes("sign up") || normalizedInput.includes("register") || normalizedInput.includes("account")) {
      return "To use UniMart, you need to have a valid @pccegoa.edu.in email address. Visit the login page to sign in or create a new account. This helps ensure that our marketplace is exclusively for students at our college.";
    }
    
    // Blockchain information
    if (normalizedInput.includes("blockchain") || normalizedInput.includes("verified") || normalizedInput.includes("verification")) {
      return "UniMart uses blockchain technology to verify the authenticity of listings and transactions. Products with a 'Verified' badge have been recorded on our blockchain, creating a transparent and secure record of ownership. This helps build trust between buyers and sellers in our community.";
    }
    
    // General inquiry about subjects
    if (normalizedInput.includes("subject") || normalizedInput.includes("course") || normalizedInput.includes("study")) {
      return "UniMart organizes products by subjects like Engineering Graphics, Chemistry, Physics, Mathematics, Workshop, Computer Science, and more. You can filter products by subject on our Products page to find exactly what you need for your courses.";
    }
    
    // Default response
    return "I'm here to help you find products, learn how to sell items, or answer questions about UniMart. You can ask me about specific products, subjects, or how our blockchain verification works.";
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-5 w-80 sm:w-96 h-[500px] sm:h-[600px] bg-white rounded-xl shadow-2xl z-40 flex flex-col border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Chat header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-unimart-600 to-unimart-800 text-white">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 bg-white/20">
                  <AvatarFallback className="text-white text-sm">UB</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">UniBot</h3>
                  <p className="text-xs text-white/70">Your marketplace assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-xl ${
                        message.sender === "user"
                          ? "bg-unimart-600 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <div className="whitespace-pre-line">{message.text}</div>
                      <div
                        className={`text-xs mt-1 ${
                          message.sender === "user" ? "text-white/70" : "text-gray-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] px-4 py-3 rounded-xl bg-gray-100 text-gray-800 rounded-bl-none">
                      <div className="flex space-x-1">
                        <motion.div
                          className="h-2 w-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            ease: "easeInOut",
                            delay: 0,
                          }}
                        />
                        <motion.div
                          className="h-2 w-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            ease: "easeInOut",
                            delay: 0.15,
                          }}
                        />
                        <motion.div
                          className="h-2 w-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            ease: "easeInOut",
                            delay: 0.3,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Suggestion chips */}
            <div className="px-4 py-2 border-t border-gray-100 overflow-x-auto">
              <div className="flex space-x-2">
                {productSuggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap text-xs py-1 px-3 h-auto bg-gray-50 border-gray-200 hover:bg-gray-100"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
              <div className="flex">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  className="ml-2 bg-unimart-600 hover:bg-unimart-700"
                  disabled={!inputValue.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        className={`fixed bottom-5 right-5 p-3 rounded-full shadow-lg z-40 ${
          isOpen ? "bg-gray-200 text-gray-600" : "bg-unimart-600 text-white"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <ChevronUp className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </motion.button>
    </>
  );
};

export default AIChat;
