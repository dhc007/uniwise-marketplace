
// MongoDB mock service for browser environment
class MongoDBService {
  private static instance: MongoDBService;
  private isConnected: boolean = false;
  private mockData: any = {};

  private constructor() {
    // Initialize with mock data
    this.initializeMockData();
  }

  public static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  // Set connection status
  setConnectionURI(uri: string): void {
    console.log("Connection URI updated (mock)");
  }

  // Mock connect method that always succeeds
  async connect(): Promise<boolean> {
    try {
      console.log("Mock MongoDB connection established");
      this.isConnected = true;
      return true;
    } catch (err) {
      console.error("Error with mock connection:", err);
      return false;
    }
  }

  // Get database instance
  getDb(): any {
    return this.mockData;
  }

  // Check connection status
  isConnectedToMongoDB(): boolean {
    return this.isConnected;
  }

  // Close connection
  async close(): Promise<void> {
    this.isConnected = false;
    console.log("Mock MongoDB connection closed");
  }

  // Get collection
  getCollection(collectionName: string) {
    if (!this.mockData[collectionName]) {
      this.mockData[collectionName] = [];
    }
    return {
      find: (query: any = {}) => {
        return {
          toArray: async () => {
            // Simple mock implementation that doesn't actually filter
            return this.mockData[collectionName];
          }
        };
      },
      insertOne: async (document: any) => {
        const id = Math.random().toString(36).substring(2, 10);
        const newDoc = { ...document, _id: id };
        this.mockData[collectionName].push(newDoc);
        return { insertedId: id, acknowledged: true };
      },
      insertMany: async (documents: any[]) => {
        const ids = [];
        for (const doc of documents) {
          const id = Math.random().toString(36).substring(2, 10);
          const newDoc = { ...doc, _id: id };
          this.mockData[collectionName].push(newDoc);
          ids.push(id);
        }
        return { insertedIds: ids, acknowledged: true };
      },
      countDocuments: async () => this.mockData[collectionName].length,
    };
  }

  // Generic fetch products method
  async fetchProducts(filters: any = {}) {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return this.mockData.products || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  // Fetch products by subject
  async fetchProductsBySubject(subject: string) {
    try {
      const products = this.mockData.products || [];
      return products.filter((p: any) => 
        p.subject && p.subject.toLowerCase().includes(subject.toLowerCase())
      );
    } catch (error) {
      console.error(`Error fetching products by subject ${subject}:`, error);
      return [];
    }
  }

  // Fetch products by category
  async fetchProductsByCategory(category: string) {
    try {
      const products = this.mockData.products || [];
      return products.filter((p: any) => 
        p.category && p.category.toLowerCase().includes(category.toLowerCase())
      );
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
      return await collection.insertOne(product);
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
      const products = this.mockData.products || [];
      return products.filter((p: any) => {
        const searchableFields = ['title', 'description', 'category', 'subject'];
        return searchableFields.some(field => 
          p[field] && p[field].toLowerCase().includes(query.toLowerCase())
        );
      });
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  }

  // Initialize with sample data
  async initializeMockData() {
    console.log("Initializing sample product data...");
    this.mockData.products = [
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
    this.isConnected = true;
    console.log("Sample product data initialized");
  }
}

export default MongoDBService;
