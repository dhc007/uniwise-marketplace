
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MainLayout from "@/layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

// List of available subjects
const subjects = [
  "Engineering Graphics",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Workshop",
  "Computer Science",
  "Electronics",
  "Mechanics",
  "Other"
];

// Schema for product listing form
const productSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid price",
  }),
  category: z.string().min(1, "Please select a category"),
  condition: z.string().min(1, "Please select condition"),
  subject: z.string().min(1, "Please select related subject"),
  useBlockchain: z.boolean().default(false),
  image: z.string().optional(),
  location: z.string().min(1, "Please select your location")
});

const Sell = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is logged in (based on mock auth)
  const userString = localStorage.getItem("unimart_user");
  const user = userString ? JSON.parse(userString) : null;

  // Form setup
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      condition: "",
      subject: "",
      useBlockchain: false,
      location: ""
    },
  });

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    if (!user?.isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please login to sell items",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!selectedImage) {
      toast({
        title: "Image required",
        description: "Please upload at least one image of your product",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would be an API call to create a product
      // For demonstration, we'll use localStorage to simulate saving products
      const productsString = localStorage.getItem("unimart_products") || "[]";
      const products = JSON.parse(productsString);

      // Create new product with mock ID
      const newProduct = {
        id: Date.now().toString(),
        ...values,
        price: Number(values.price),
        image: selectedImage,
        seller: user.name,
        isBlockchainVerified: values.useBlockchain,
        postedDate: "Just now",
        rating: 5.0
      };

      // Save to local storage
      localStorage.setItem("unimart_products", JSON.stringify([newProduct, ...products]));

      toast({
        title: "Product Listed",
        description: "Your item has been successfully listed!",
      });
      
      // Redirect to products page
      navigate("/products");
    } catch (error) {
      toast({
        title: "Listing failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not logged in, show login prompt
  if (!user?.isLoggedIn) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="mb-6">You need to login with your college email to sell items.</p>
          <Button onClick={() => navigate("/auth")}>
            Login to Continue
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-2">Sell Your Item</h1>
          <p className="text-gray-600 mb-8">List your unused college items for other students to buy</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
                <h2 className="text-xl font-semibold mb-2">Basic Information</h2>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Engineering Graphics Drafting Kit" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your item in detail. Include condition, usage history, etc." 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Textbooks">Textbooks</SelectItem>
                            <SelectItem value="Lab Coats">Lab Coats</SelectItem>
                            <SelectItem value="Drafting Tools">Drafting Tools</SelectItem>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Tools">Tools</SelectItem>
                            <SelectItem value="Lab Equipment">Lab Equipment</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Like New">Like New</SelectItem>
                            <SelectItem value="Very Good">Very Good</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Acceptable">Acceptable</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related Subject</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjects.map(subject => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
                <h2 className="text-xl font-semibold mb-2">Images</h2>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {selectedImage ? (
                      <div className="space-y-4">
                        <img 
                          src={selectedImage} 
                          alt="Product preview" 
                          className="mx-auto max-h-64 object-contain" 
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setSelectedImage(null)}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-500 mb-2">Upload product images</p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="mx-auto max-w-xs"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Clear, well-lit photos help your item sell faster
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
                <h2 className="text-xl font-semibold mb-2">Additional Details</h2>
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="North Campus">North Campus</SelectItem>
                          <SelectItem value="South Campus">South Campus</SelectItem>
                          <SelectItem value="Main Building">Main Building</SelectItem>
                          <SelectItem value="Science Block">Science Block</SelectItem>
                          <SelectItem value="Engineering Block">Engineering Block</SelectItem>
                          <SelectItem value="Library">Library</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="useBlockchain"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Blockchain Verification</FormLabel>
                        <FormDescription>
                          Use blockchain to verify the authenticity of your item
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-unimart-600 hover:bg-unimart-700 py-6 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Listing your item..." : "List Item for Sale"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Sell;
