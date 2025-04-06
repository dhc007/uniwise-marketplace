
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

interface BlockchainTransaction {
  id: string;
  timestamp: Date;
  productId?: string;
  productTitle?: string;
  type: 'verification' | 'listing' | 'purchase';
  status: 'confirmed' | 'pending';
}

const BlockchainStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Initialize blockchain connection on mount
  useEffect(() => {
    const initBlockchain = async () => {
      try {
        // Simulate blockchain connection
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Mock initial transactions
        const initialTransactions: BlockchainTransaction[] = [
          {
            id: 'tx_' + Math.random().toString(36).substring(2, 10),
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            productId: '1',
            productTitle: 'Engineering Graphics Drafting Kit',
            type: 'verification',
            status: 'confirmed'
          },
          {
            id: 'tx_' + Math.random().toString(36).substring(2, 10),
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            productId: '3',
            productTitle: 'Data Structures and Algorithms Textbook',
            type: 'listing',
            status: 'confirmed'
          }
        ];
        
        setTransactions(initialTransactions);
        setIsConnected(true);
        setTransactionCount(initialTransactions.length);
        setLastUpdated(new Date());
        
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
        // Simulate new transactions with approximately 30% chance
        if (Math.random() > 0.7) {
          const transactionTypes = ['verification', 'listing', 'purchase'] as const;
          const productTitles = [
            'Engineering Graphics Drafting Kit',
            'Chemistry Lab Coat (White)',
            'Data Structures and Algorithms Textbook',
            'Mechanical Engineering Drawing Tools',
            'Circuit Analysis Textbook',
            'Scientific Calculator'
          ];
          
          const newTransaction: BlockchainTransaction = {
            id: 'tx_' + Math.random().toString(36).substring(2, 10),
            timestamp: new Date(),
            productId: String(Math.floor(Math.random() * 10) + 1),
            productTitle: productTitles[Math.floor(Math.random() * productTitles.length)],
            type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
            status: Math.random() > 0.2 ? 'confirmed' : 'pending'
          };
          
          setTransactions(prev => [newTransaction, ...prev].slice(0, 20)); // Keep last 20 transactions
          setTransactionCount(prev => prev + 1);
          setLastUpdated(new Date());
          
          // Only notify for certain transaction types
          if (newTransaction.type === 'verification' || newTransaction.type === 'purchase') {
            toast({
              title: `New Blockchain ${newTransaction.type === 'verification' ? 'Verification' : 'Transaction'}`,
              description: `${newTransaction.productTitle} was ${newTransaction.type === 'verification' ? 'verified' : 'purchased'} on the blockchain`,
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
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleClick = () => {
    if (transactions.length > 0) {
      toast({
        title: "Recent Blockchain Activity",
        description: `${transactions[0].productTitle} was recently ${transactions[0].type}d (${transactions[0].status})`,
      });
    } else {
      toast({
        title: "Blockchain Status",
        description: `Connected: ${isConnected ? 'Yes' : 'No'}, Transactions: ${transactionCount}, Last updated: ${lastUpdated?.toLocaleTimeString() || 'Never'}`,
      });
    }
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
          <div className="text-sm max-w-[300px]">
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
            
            {transactions.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs font-medium mb-1">Latest Activity:</p>
                <div className="max-h-[100px] overflow-y-auto">
                  {transactions.slice(0, 3).map(tx => (
                    <div key={tx.id} className="text-xs mb-1 last:mb-0">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1 ${tx.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      {tx.productTitle} - {tx.type}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BlockchainStatus;
