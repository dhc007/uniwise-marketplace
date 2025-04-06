
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

const BlockchainStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Initialize blockchain connection on mount
  useEffect(() => {
    const initBlockchain = async () => {
      try {
        // Simulate blockchain connection
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsConnected(true);
        setLastUpdated(new Date());
        setTransactionCount(Math.floor(Math.random() * 50) + 10);
        toast({
          title: "Blockchain Connected",
          description: "Successfully connected to UniMart blockchain network",
        });
      } catch (error) {
        console.error("Failed to connect to blockchain:", error);
        setIsConnected(false);
        toast({
          title: "Blockchain Connection Failed",
          description: "Could not connect to UniMart blockchain network",
          variant: "destructive",
        });
      }
    };

    initBlockchain();
    
    // Regular updates
    const interval = setInterval(() => {
      if (isConnected) {
        // Simulate new transactions
        if (Math.random() > 0.5) {
          const newTransactions = Math.floor(Math.random() * 3) + 1;
          setTransactionCount(prev => prev + newTransactions);
          setLastUpdated(new Date());
          
          if (newTransactions > 1) {
            toast({
              title: "New Transactions",
              description: `${newTransactions} new items verified on blockchain`,
            });
          }
        }
      } else {
        // Try to reconnect
        if (Math.random() > 0.7) {
          setIsConnected(true);
          toast({
            title: "Blockchain Reconnected",
            description: "Successfully reconnected to UniMart blockchain network",
          });
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleClick = () => {
    toast({
      title: "Blockchain Status",
      description: `Connected: ${isConnected ? 'Yes' : 'No'}, Transactions: ${transactionCount}, Last updated: ${lastUpdated?.toLocaleTimeString() || 'Never'}`,
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center cursor-pointer" onClick={handleClick}>
            <motion.div 
              className={`h-2 w-2 rounded-full mr-2 ${
                isConnected ? 'bg-green-500' : 'bg-orange-500'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
            <Link className="h-[1.2rem] w-[1.2rem] text-gray-600" />
            {transactionCount > 0 && (
              <motion.span 
                className="text-xs ml-1 text-unimart-600 font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {transactionCount}
              </motion.span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">Blockchain Status</p>
            <p className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Connecting...'}
            </p>
            <p className="text-xs text-muted-foreground">
              Transactions: {transactionCount}
            </p>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BlockchainStatus;
