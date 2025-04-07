
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, ArrowUpRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [showDialog, setShowDialog] = useState(false);

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
    setShowDialog(true);
  };

  // Get transaction type badge color
  const getTransactionTypeColor = (type: BlockchainTransaction['type']) => {
    switch (type) {
      case 'verification': return 'bg-blue-100 text-blue-800';
      case 'listing': return 'bg-green-100 text-green-800';
      case 'purchase': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
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
            <p className="font-medium">Blockchain Status</p>
            <p className="text-xs text-muted-foreground">Click to view blockchain activity</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {showDialog && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <ShieldCheck className="mr-2 h-5 w-5 text-green-500" />
                  UniMart Blockchain Network
                </DialogTitle>
                <DialogDescription>
                  UniMart uses blockchain technology to verify product authenticity and secure transactions between students.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="flex items-center mt-1">
                      <div className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                      <span className="font-medium">{isConnected ? 'Connected' : 'Connecting...'}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Transactions</div>
                    <div className="flex items-center mt-1">
                      <span className="font-medium">{transactionCount}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        (Last update: {lastUpdated?.toLocaleTimeString() || 'Never'})
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                  <ScrollArea className="h-[260px] rounded-md border p-2">
                    <div className="space-y-3 pr-3">
                      {transactions.length > 0 ? (
                        transactions.map(tx => (
                          <div key={tx.id} className="flex items-start p-2 rounded-lg hover:bg-gray-50">
                            <div className={`p-2 rounded-full ${tx.status === 'confirmed' ? 'bg-green-100' : 'bg-yellow-100'} mr-3`}>
                              {tx.status === 'confirmed' ? (
                                <ShieldCheck className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-medium truncate">{tx.productTitle}</p>
                                <span className="text-xs text-gray-500">
                                  {tx.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                              </div>
                              <div className="flex items-center mt-1">
                                <Badge variant="outline" className={`text-xs ${getTransactionTypeColor(tx.type)}`}>
                                  {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                                </Badge>
                                <span className="text-xs text-gray-500 ml-2">
                                  {tx.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">No blockchain activity yet</div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium flex items-center">
                    <span>What is blockchain verification?</span>
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Blockchain verification ensures that products listed on UniMart are authentic and transactions are secure. 
                    When a product is verified, it means its details are permanently recorded on our blockchain, creating trust 
                    between buyers and sellers.
                  </p>
                  <Button variant="link" size="sm" className="px-0 py-0 h-auto text-xs mt-1 text-blue-600">
                    Learn more about our blockchain <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlockchainStatus;
