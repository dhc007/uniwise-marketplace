
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, Send, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Bot greeting when chat is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          addBotMessage("Hi there! I'm UniBot. How can I help you find what you need today?");
          setIsTyping(false);
        }, 1500);
      }, 500);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const addBotMessage = (content: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        content,
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [
      ...prev, 
      {
        id: Date.now().toString(),
        content: input.trim(),
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Clear input and simulate typing
    setInput("");
    setIsTyping(true);
    
    // Simulate bot response
    setTimeout(() => {
      const userQuery = input.toLowerCase();
      let botResponse = "";
      
      if (userQuery.includes("lab coat") || userQuery.includes("coat")) {
        botResponse = "I found several lab coats available! There are white coats for chemistry labs and blue ones for workshop classes. Would you like me to show you the listings?";
      } else if (userQuery.includes("drafting") || userQuery.includes("drafter") || userQuery.includes("engineering graphics")) {
        botResponse = "We have 5 drafting kits available from seniors who completed Engineering Graphics last semester. Would you like to see them?";
      } else if (userQuery.includes("textbook") || userQuery.includes("book")) {
        botResponse = "There are several textbooks available. Could you specify which subject you're looking for?";
      } else if (userQuery.includes("blockchain")) {
        botResponse = "UniMart uses blockchain technology to securely record all transactions, ensuring transparency and trust between buyers and sellers. Each transaction gets a unique identifier on our blockchain!";
      } else {
        botResponse = "I'd be happy to help you find what you need! Could you tell me more about what specific item you're looking for?";
      }
      
      addBotMessage(botResponse);
      setIsTyping(false);
    }, 1500);
  };

  // Chat bubble animations
  const bubbleVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  // Button animations
  const fabVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 30 } },
    tap: { scale: 0.9 }
  };

  // Chat container animations
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 500, damping: 30 } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20, 
      transition: { duration: 0.2 } 
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial="hidden"
        animate="visible"
        variants={fabVariants}
        whileTap="tap"
      >
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full shadow-lg bg-unimart-600 hover:bg-unimart-700"
          >
            <Bot className="h-6 w-6" />
          </Button>
        )}
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed ${isExpanded ? 'inset-4' : 'bottom-6 right-6 w-80 sm:w-96'} z-50 
            bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            {/* Chat header */}
            <div className="bg-unimart-600 text-white p-3 flex justify-between items-center">
              <div className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                <h3 className="font-medium">UniMart Assistant</h3>
              </div>
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-white hover:bg-unimart-700"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-white hover:bg-unimart-700"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat messages */}
            <ScrollArea 
              className={`p-4 ${isExpanded ? 'h-[calc(100vh-13rem)]' : 'h-[350px]'}`}
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    variants={bubbleVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex items-start max-w-[85%]">
                      {message.sender === 'bot' && (
                        <Avatar className="mt-0.5 mr-2 h-8 w-8 bg-unimart-100">
                          <AvatarFallback className="bg-unimart-100 text-unimart-700">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div 
                        className={`rounded-lg p-3 ${
                          message.sender === 'user' 
                            ? 'bg-unimart-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    variants={bubbleVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex items-start max-w-[85%]">
                      <Avatar className="mt-0.5 mr-2 h-8 w-8">
                        <AvatarFallback className="bg-unimart-100 text-unimart-700">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg p-3 text-gray-800">
                        <div className="flex space-x-1">
                          <motion.div 
                            className="h-2 w-2 bg-gray-400 rounded-full"
                            animate={{ scale: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          <motion.div 
                            className="h-2 w-2 bg-gray-400 rounded-full"
                            animate={{ scale: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div 
                            className="h-2 w-2 bg-gray-400 rounded-full"
                            animate={{ scale: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>

            {/* Chat input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100">
              <div className="flex items-end gap-2">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me about products..."
                  className="resize-none min-h-[44px] max-h-[120px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="h-[44px] w-[44px] bg-unimart-600 hover:bg-unimart-700"
                  disabled={!input.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
