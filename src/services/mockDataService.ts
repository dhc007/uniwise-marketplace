
// Mock data service for browser environment
class MockDataService {
  private static instance: MockDataService;
  private products: any[] = [];
  private users: any[] = [];
  private initialized: boolean = false;

  private constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  // Initialize with sample data
  public async initializeSampleData(): Promise<void> {
    console.log("Initializing sample product data...");
    
    // Sample products
    this.products = [
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
    
    this.initialized = true;
    console.log("Sample product data initialized");
  }

  // Get all products
  public async getProducts(): Promise<any[]> {
    if (!this.initialized) {
      await this.initializeSampleData();
    }
    return this.products;
  }

  // Get product by ID
  public async getProductById(id: string): Promise<any | null> {
    if (!this.initialized) {
      await this.initializeSampleData();
    }
    return this.products.find(product => product.id === id) || null;
  }

  // Search products
  public async searchProducts(query: string): Promise<any[]> {
    if (!this.initialized) {
      await this.initializeSampleData();
    }
    
    if (!query || query.trim() === '') {
      return this.products;
    }
    
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(product => {
      const searchFields = ['title', 'description', 'category', 'subject', 'seller'];
      return searchFields.some(field => 
        product[field] && product[field].toLowerCase().includes(lowercaseQuery)
      );
    });
  }

  // Get products by category
  public async getProductsByCategory(category: string): Promise<any[]> {
    if (!this.initialized) {
      await this.initializeSampleData();
    }
    
    if (!category || category.trim() === '') {
      return this.products;
    }
    
    return this.products.filter(product => 
      product.category && product.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  // Get products by subject
  public async getProductsBySubject(subject: string): Promise<any[]> {
    if (!this.initialized) {
      await this.initializeSampleData();
    }
    
    if (!subject || subject.trim() === '') {
      return this.products;
    }
    
    return this.products.filter(product => 
      product.subject && product.subject.toLowerCase().includes(subject.toLowerCase())
    );
  }

  // Add a new product
  public async addProduct(product: any): Promise<any> {
    if (!this.initialized) {
      await this.initializeSampleData();
    }
    
    const newProduct = {
      ...product,
      id: String(this.products.length + 1),
      postedDate: "Just now"
    };
    
    this.products.push(newProduct);
    return newProduct;
  }
}

export default MockDataService;
