
// MongoDB connection service
import { MongoClient, ServerApiVersion, Db } from 'mongodb';

class MongoDBService {
  private static instance: MongoDBService;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected: boolean = false;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  // Connect to MongoDB
  async connect(uri: string = "mongodb://localhost:27017/unimart"): Promise<boolean> {
    try {
      if (this.isConnected) {
        console.log("Already connected to MongoDB");
        return true;
      }

      this.client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

      await this.client.connect();
      console.log("Connected to MongoDB");
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
  async fetchProducts() {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      const collection = this.getCollection('products');
      return await collection.find({}).toArray();
    } catch (error) {
      console.error("Error fetching products:", error);
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
}

export default MongoDBService;
