
// MongoDB service adapter for the browser
class MongoDBService {
  private static instance: MongoDBService;
  private isConnected: boolean = false;
  private mockData: any = {};
  private connectionURI: string = '';

  private constructor() {
    // Initialize with connection string
    this.connectionURI = "mongodb+srv://user1:RZmOFgVbTWOHorCK@cluster0.praei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
    this.connectionURI = uri;
    console.log("Connection URI updated");
  }

  // Connect to MongoDB
  async connect(): Promise<boolean> {
    try {
      console.log("Connecting to MongoDB...");
      // In a real app, we would connect to MongoDB here
      // Since we're in the browser, we'll simulate a connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.isConnected = true;
      console.log("Connected to MongoDB successfully");
      return true;
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
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
    console.log("MongoDB connection closed");
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
    console.log("Initializing sample product data from MongoDB adapter...");
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
    
    // Add more products from the featured items
    const featuredItems = [
      { id: '6', title: 'Drafter Set for Engineering Students', price: 320, description: "Professional quality drafting tools for engineering students. Includes all necessary tools for technical drawing.", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80", condition: 'New', category: 'Stationery', seller: 'Atisha', subject: "Engineering Graphics", rating: 4.4, postedDate: "2 weeks ago", isBlockchainVerified: true },
      { id: '7', title: 'Workshop Apron for Practical Labs', price: 270, description: "Durable workshop apron for protection during practical lab sessions. Made from high-quality material.", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80", condition: 'Good', category: 'Apparel', seller: 'Dhruv', subject: "Workshop Practice", rating: 4.1, postedDate: "3 weeks ago", isBlockchainVerified: false },
      { id: '8', title: 'Lab Coat for Chemistry and Biology Labs', price: 380, description: "Standard laboratory coat for use in chemistry and biology labs. Meets safety requirements.", image: "https://images.unsplash.com/photo-1581056771107-24247a7e6794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80", condition: 'Fair', category: 'Apparel', seller: 'Mudra', subject: "Chemistry", rating: 3.9, postedDate: "1 month ago", isBlockchainVerified: true },
      { id: '9', title: 'Engineering Graphics Textbook', price: 350, description: "Standard textbook for Engineering Graphics course. Covers all foundational concepts.", image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80", condition: 'Like New', category: 'Books', seller: 'Shawn', subject: "Engineering Graphics", rating: 4.7, postedDate: "4 days ago", isBlockchainVerified: true },
      { id: '10', title: 'Casio FX-991EX Scientific Calculator', price: 750, description: "Advanced scientific calculator with natural display. Perfect for engineering and science courses.", image: "https://images.unsplash.com/photo-1564473185935-b0c6b9150bfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80", condition: 'Used', category: 'Stationery', seller: 'Aman', subject: "Mathematics", rating: 4.8, postedDate: "1 week ago", isBlockchainVerified: false }
    ];
    
    this.mockData.products = [...this.mockData.products, ...featuredItems];
    this.isConnected = true;
    console.log("Sample product data initialized");
  }
}

export default MongoDBService;
