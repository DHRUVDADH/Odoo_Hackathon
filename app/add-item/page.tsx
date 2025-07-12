"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { Upload, X, Plus, Camera, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AddItemPage() {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    size: "",
    condition: "",
    brand: "",
    material: "",
    color: "",
    price: "",
    originalPrice: "",
    location: "",
    isSwapOnly: false,
  });

  const { user } = useAuth();
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const validFiles = newFiles.filter(
        (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
      );

      if (validFiles.length + images.length > 6) {
        setError("Maximum 6 images allowed");
        return;
      }

      setImages((prev) => [...prev, ...validFiles]);

      // Create preview URLs
      validFiles.forEach((file) => {
        const url = URL.createObjectURL(file);
        setImageUrls((prev) => [...prev, url]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleInputChange = useCallback(
    (field: string, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.category) {
      setError("Category is required");
      return false;
    }
    if (!formData.size) {
      setError("Size is required");
      return false;
    }
    if (!formData.condition) {
      setError("Condition is required");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Valid price is required");
      return false;
    }
    if (images.length === 0) {
      setError("At least one image is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add form fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("size", formData.size);
      formDataToSend.append("condition", formData.condition);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("material", formData.material);
      formDataToSend.append("color", formData.color);
      formDataToSend.append("price", formData.price);
      if (formData.originalPrice) {
        formDataToSend.append("originalPrice", formData.originalPrice);
      }
      formDataToSend.append("location", formData.location);
      formDataToSend.append("isSwapOnly", formData.isSwapOnly.toString());
      formDataToSend.append("tags", JSON.stringify(tags));

      // Add images
      console.log("Images to upload:", images.length);
      images.forEach((image, index) => {
        console.log(
          `Adding image ${index}:`,
          image.name,
          image.size,
          image.type
        );
        formDataToSend.append("images", image);
      });

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      console.log("Sending request to backend...");
      const response = await apiClient.createItem(formDataToSend);
      console.log("Backend response:", response);

      if (response.success) {
        router.push("/dashboard");
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.error("Error creating item:", err);
      setError(err.message || "Failed to create item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background">
        <Navbar isAuthenticated={true} userPoints={user?.points || 0} />

      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
            <Link
              href="/dashboard"
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Add New Item</h1>
              <p className="text-muted-foreground">
                Share your pre-loved fashion with the ReWear community
              </p>
          </div>

            <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
                {/* Image Upload */}
                <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                      <CardDescription>
                        Add up to 6 photos of your item
                      </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative aspect-square">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                        />
                        <Button
                              type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                        {imageUrls.length < 6 && (
                          <div className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center space-y-2">
                              <Camera className="h-8 w-8 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Add Photo
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImageUpload}
                              />
                      </label>
                    </div>
                  )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Upload clear, well-lit photos from multiple angles
                      </p>
                </CardContent>
              </Card>

                  {/* Tags */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                      <CardDescription>
                        Add relevant tags to increase visibility
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add a tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addTag())
                          }
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          disabled={tags.length >= 10}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center space-x-1"
                          >
                            <span>{tag}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => removeTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Tell us about your item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Vintage Denim Jacket"
                      value={formData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          required
                          disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the item's condition, style, and any special features..."
                      rows={4}
                      value={formData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          required
                          disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) =>
                              handleInputChange("category", value)
                            }
                            disabled={isLoading}
                          >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                              <SelectItem value="Tops">Tops</SelectItem>
                              <SelectItem value="Dresses">Dresses</SelectItem>
                              <SelectItem value="Outerwear">
                                Outerwear
                              </SelectItem>
                              <SelectItem value="Bottoms">Bottoms</SelectItem>
                              <SelectItem value="Shoes">Shoes</SelectItem>
                              <SelectItem value="Accessories">
                                Accessories
                              </SelectItem>
                              <SelectItem value="Bags">Bags</SelectItem>
                              <SelectItem value="Jewelry">Jewelry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="size">Size *</Label>
                          <Select
                            value={formData.size}
                            onValueChange={(value) =>
                              handleInputChange("size", value)
                            }
                            disabled={isLoading}
                          >
                        <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                              <SelectItem value="XS">XS</SelectItem>
                              <SelectItem value="S">S</SelectItem>
                              <SelectItem value="M">M</SelectItem>
                              <SelectItem value="L">L</SelectItem>
                              <SelectItem value="XL">XL</SelectItem>
                              <SelectItem value="XXL">XXL</SelectItem>
                              <SelectItem value="Free Size">
                                Free Size
                              </SelectItem>
                        </SelectContent>
                      </Select>
                        </div>
                    </div>

                      <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition *</Label>
                      <Select
                        value={formData.condition}
                            onValueChange={(value) =>
                              handleInputChange("condition", value)
                            }
                            disabled={isLoading}
                      >
                        <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                              <SelectItem value="Like New">Like New</SelectItem>
                              <SelectItem value="Excellent">
                                Excellent
                              </SelectItem>
                              <SelectItem value="Very Good">
                                Very Good
                              </SelectItem>
                              <SelectItem value="Good">Good</SelectItem>
                              <SelectItem value="Fair">Fair</SelectItem>
                              <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                          <Label htmlFor="brand">Brand</Label>
                      <Input
                            id="brand"
                            placeholder="e.g., Levi's, Nike"
                            value={formData.brand}
                            onChange={(e) =>
                              handleInputChange("brand", e.target.value)
                            }
                            disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                          <Label htmlFor="material">Material</Label>
                      <Input
                            id="material"
                            placeholder="e.g., Cotton, Denim, Silk"
                            value={formData.material}
                            onChange={(e) =>
                              handleInputChange("material", e.target.value)
                            }
                            disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                          <Label htmlFor="color">Color</Label>
                      <Input
                            id="color"
                            placeholder="e.g., Blue, Black, Red"
                            value={formData.color}
                            onChange={(e) =>
                              handleInputChange("color", e.target.value)
                            }
                            disabled={isLoading}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                      <CardTitle>Pricing & Location</CardTitle>
                      <CardDescription>
                        Set your price and location
                      </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price (Points) *</Label>
                    <Input
                            id="price"
                            type="number"
                            placeholder="0"
                            value={formData.price}
                            onChange={(e) =>
                              handleInputChange("price", e.target.value)
                            }
                            required
                            disabled={isLoading}
                          />
                  </div>

                        <div className="space-y-2">
                          <Label htmlFor="originalPrice">
                            Original Price (Optional)
                          </Label>
                          <Input
                            id="originalPrice"
                            type="number"
                            placeholder="0"
                            value={formData.originalPrice}
                            onChange={(e) =>
                              handleInputChange("originalPrice", e.target.value)
                            }
                            disabled={isLoading}
                          />
                    </div>
            </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., New York, NY"
                          value={formData.location}
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                          disabled={isLoading}
                        />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Listing Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>Use clear, well-lit photos from multiple angles</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>Be honest about the item's condition</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>Include detailed measurements when possible</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>Add relevant tags to increase visibility</p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="space-y-4">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Item..." : "Submit for Review"}
                    </Button>

                    {/* Test Upload Button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={async () => {
                        if (images.length === 0) {
                          alert("Please select at least one image first");
                          return;
                        }

                        const testFormData = new FormData();
                        testFormData.append("title", "Test Item");
                        testFormData.append("description", "Test Description");
                        testFormData.append("category", "Tops");
                        testFormData.append("size", "M");
                        testFormData.append("condition", "Good");
                        testFormData.append("price", "50");

                        images.forEach((image) => {
                          testFormData.append("images", image);
                        });

                        try {
                          console.log("Testing upload...");
                          const response = await fetch(
                            "http://localhost:5000/api/v1/items/test-upload",
                            {
                              method: "POST",
                              body: testFormData,
                            }
                          );
                          const result = await response.json();
                          console.log("Test upload result:", result);
                          alert(
                            "Test upload completed! Check console for details."
                          );
                        } catch (error) {
                          console.error("Test upload error:", error);
                          alert(
                            "Test upload failed! Check console for details."
                          );
                        }
                      }}
                    >
                      Test Upload (Debug)
                </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-transparent"
                      disabled={isLoading}
                    >
                  Save as Draft
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                      Your item will be reviewed within 24 hours before going
                      live
                </p>
              </div>
            </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
