
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const BlockchainStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [transactionCount, setTransactionCount] = useState(0);

  // Simulate blockchain connection status
  useEffect(() => {
    const interval = setInterval(() => {
      // Random connection status for demo purposes
      if (Math.random() > 0.95) {
        setIsConnected(prev => !prev);
      }
      
      // Simulate new blockchain transactions
      if (Math.random() > 0.7) {
        setTransactionCount(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center cursor-pointer">
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
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BlockchainStatus;
