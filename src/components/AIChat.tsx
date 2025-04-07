
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, ChevronUp, Search, ShoppingBag, User, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductCardProps } from "./ProductCard";
import { toast } from "@/hooks/use-toast";
import MockDataService from "@/services/mockDataService";

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

// Mock Gemini API client for a browser environment
const mockGeminiClient = {
  async generateResponse(userMessage: string, productList: ProductCardProps[]) {
    // Format products for better context
    const formattedProducts = productList.map(product => 
      `📌 *${product.title}* (Category: ${product.category})\n💰 Price: ₹${product.price}\n🔹 Condition: ${product.condition}`
    ).join("\n\n");
    
    // In a real implementation, this would make an API call to a Gemini backend
    // For demonstration, we'll simulate the response based on the user message
    console.log("Gemini API key: AIzaSyDt4yLRKnENFE2wbWUA_5CSHpZ8_w7KUlU");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Check if user is asking about specific product categories
    if (lowerCaseMessage.includes("textbook") || lowerCaseMessage.includes("book")) {
      const books = productList.filter(p => p.category === "Textbooks" || p.category === "Books");
      if (books.length > 0) {
        return `I found ${books.length} textbooks available on UniMart:\n\n${
          books.slice(0, 3).map(b => `📚 *${b.title}* - ₹${b.price} (${b.condition})`).join("\n")
        }${books.length > 3 ? `\n\n...and ${books.length - 3} more` : ""}`;
      }
    }
    
    if (lowerCaseMessage.includes("lab coat") || lowerCaseMessage.includes("chemistry")) {
      const labCoats = productList.filter(p => 
        p.title.toLowerCase().includes("lab coat") || 
        p.category === "Lab Equipment" || 
        p.subject === "Chemistry"
      );
      if (labCoats.length > 0) {
        return `I found ${labCoats.length} lab equipment items:\n\n${
          labCoats.slice(0, 3).map(l => `🧪 *${l.title}* - ₹${l.price} (${l.condition})`).join("\n")
        }`;
      }
    }
    
    if (lowerCaseMessage.includes("drafting") || lowerCaseMessage.includes("engineering graphics")) {
      const draftingTools = productList.filter(p => 
        p.category === "Drafting Tools" || 
        p.subject === "Engineering Graphics"
      );
      if (draftingTools.length > 0) {
        return `I found ${draftingTools.length} drafting tools and related items:\n\n${
          draftingTools.slice(0, 3).map(d => `📐 *${d.title}* - ₹${d.price} (${d.condition})`).join("\n")
        }`;
      }
    }
    
    // Help with selling items
    if (lowerCaseMessage.includes("sell") || lowerCaseMessage.includes("selling")) {
      return "To sell items on UniMart:\n\n1. Sign in with your college email\n2. Click on the 'Sell' button in the navigation\n3. Fill out the product details form\n4. Upload clear images of your item\n5. Set a fair price\n6. Submit your listing\n\nYour item will be verified on our blockchain network to build trust with buyers!";
    }
    
    // About blockchain
    if (lowerCaseMessage.includes("blockchain") || lowerCaseMessage.includes("verify")) {
      return "UniMart uses blockchain technology to create trust between student buyers and sellers. When an item is verified on the blockchain, it means:\n\n1. The item details are permanently recorded\n2. The seller identity is confirmed\n3. The transaction history is transparent\n\nYou can see blockchain status by clicking the blockchain icon in the navigation bar!";
    }
    
    // Generic search
    if (lowerCaseMessage.includes("find") || lowerCaseMessage.includes("search") || lowerCaseMessage.includes("looking for")) {
      return "You can search for products using the search bar in the navigation. Or tell me what specific item or category you're looking for, and I can help find options available on UniMart.";
    }
    
    // Default response
    return "I'm here to help you find what you need on UniMart! You can ask me about specific products, how to sell items, or how our blockchain verification works. What would you like to know?";
  }
};

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load products for AI context
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const dataService = MockDataService.getInstance();
        const productList = await dataService.getProducts();
        setProducts(productList);
      } catch (error) {
        console.error("Error loading products for AI:", error);
      }
    };
    
    loadProducts();
  }, []);

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

  const handleSendMessage = async (e?: React.FormEvent) => {
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

    try {
      // Generate AI response using the mock Gemini client
      const aiResponse = await mockGeminiClient.generateResponse(inputValue, products);
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast({
        title: "AI Response Error",
        description: "Sorry, I couldn't generate a response. Please try again.",
        variant: "destructive",
      });
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I'm having trouble connecting to my knowledge base. Please try again in a moment.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const productSuggestions = [
    "Show me drafting tools",
    "I need a chemistry lab coat",
    "Looking for calculus textbooks",
    "How does blockchain work?",
  ];

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
