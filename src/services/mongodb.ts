
// MongoDB connection service
import { MongoClient, ServerApiVersion, Db } from 'mongodb';

class MongoDBService {
  private static instance: MongoDBService;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected: boolean = false;
  private connectionURI: string = "mongodb://localhost:27017/unimart";

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  // Set connection URI
  setConnectionURI(uri: string): void {
    this.connectionURI = uri;
    console.log("Connection URI updated");
  }

  // Connect to MongoDB
  async connect(uri: string = this.connectionURI): Promise<boolean> {
    try {
      if (this.isConnected) {
        console.log("Already connected to MongoDB");
        return true;
      }

      console.log("Connecting to MongoDB:", uri);
      this.client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

      await this.client.connect();
      console.log("Connected to MongoDB successfully");
      this.db = this.client.db();
      this.isConnected = true;
      return true;
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      return false;
    }
  }

  // Get database instance
  getDb(): Db | null {
    return this.db;
  }

  // Check connection status
  isConnectedToMongoDB(): boolean {
    return this.isConnected;
  }

  // Close connection
  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log("MongoDB connection closed");
    }
  }

  // Get collection
  getCollection(collectionName: string) {
    if (!this.db) {
      throw new Error("Database not connected");
    }
    return this.db.collection(collectionName);
  }

  // Generic fetch products method
  async fetchProducts(filters: any = {}) {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      const collection = this.getCollection('products');
      return await collection.find(filters).toArray();
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  // Fetch products by subject
  async fetchProductsBySubject(subject: string) {
    try {
      return this.fetchProducts({ subject: { $regex: subject, $options: 'i' } });
    } catch (error) {
      console.error(`Error fetching products by subject ${subject}:`, error);
      return [];
    }
  }

  // Fetch products by category
  async fetchProductsByCategory(category: string) {
    try {
      return this.fetchProducts({ category: { $regex: category, $options: 'i' } });
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      return [];
    }
  }

  // Insert a product
  async insertProduct(product: any) {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      const collection = this.getCollection('products');
      const result = await collection.insertOne(product);
      return result;
    } catch (error) {
      console.error("Error inserting product:", error);
      return null;
    }
  }

  // Search products
  async searchProducts(query: string) {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      const collection = this.getCollection('products');
      return await collection.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { subject: { $regex: query, $options: 'i' } }
        ]
      }).toArray();
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  }

  // Initialize with sample data if collection is empty
  async initializeSampleData() {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      
      const collection = this.getCollection('products');
      const count = await collection.countDocuments();
      
      if (count === 0) {
        console.log("Initializing sample product data...");
        const sampleProducts = [
          {
            id: "1",
            title: "Engineering Graphics Drafting Kit",
            price: 850,
            description: "Complete drafting kit for Engineering Graphics course. Includes compass, set squares, scales, and more. Used for one semester only.",
            image: "https://images.unsplash.com/photo-1611784728558-6a9848d4c72d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
            category: "Drafting Tools",
            condition: "Like New",
            seller: "Rahul M.",
            subject: "Engineering Graphics",
            rating: 4.8,
            postedDate: "3 days ago",
            isBlockchainVerified: true
          },
          {
            id: "2",
            title: "Chemistry Lab Coat (White)",
            price: 350,
            description: "Standard white lab coat for chemistry labs. Size M. Used for just one semester, still in great condition with no stains or tears.",
            image: "https://images.unsplash.com/photo-1581056771107-24247a7e6794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
            category: "Lab Equipment",
            condition: "Good",
            seller: "Priya S.",
            subject: "Chemistry",
            rating: 4.5,
            postedDate: "1 week ago",
            isBlockchainVerified: false
          },
          {
            id: "3",
            title: "Data Structures and Algorithms Textbook",
            price: 480,
            description: "Comprehensive textbook for DSA course. Has some highlighting but otherwise in good condition. Includes solutions manual.",
            image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
            category: "Textbooks",
            condition: "Good",
            seller: "Aakash D.",
            subject: "Computer Science",
            rating: 4.7,
            postedDate: "2 weeks ago",
            isBlockchainVerified: true
          },
          {
            id: "4",
            title: "Mechanical Engineering Drawing Tools",
            price: 600,
            description: "Professional drawing tools for mechanical engineering students. Includes French curves, technical pens, and precision tools.",
            image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
            category: "Drafting Tools",
            condition: "Excellent",
            seller: "Vikram P.",
            subject: "Mechanical Engineering",
            rating: 4.9,
            postedDate: "5 days ago",
            isBlockchainVerified: true
          },
          {
            id: "5",
            title: "Circuit Analysis Textbook",
            price: 420,
            description: "Fundamentals of Circuit Analysis, 5th Edition. Clean copy with no marks or dog-ears. Perfect for electrical engineering students.",
            image: "https://images.unsplash.com/photo-1623043453741-9a304a531c92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
            category: "Textbooks",
            condition: "Like New",
            seller: "Neha R.",
            subject: "Electrical Engineering",
            rating: 4.6,
            postedDate: "1 week ago",
            isBlockchainVerified: false
          }
        ];
        
        await collection.insertMany(sampleProducts);
        console.log("Sample product data initialized");
      } else {
        console.log(`${count} products already in database, skipping initialization`);
      }
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }
}

export default MongoDBService;
