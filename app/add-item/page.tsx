"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Upload, X, Plus, Camera, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddItemPage() {
  const [images, setImages] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    size: "",
    condition: "",
    brand: "",
    material: "",
    color: "",
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages].slice(0, 6)) // Max 6 images
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags((prev) => [...prev, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} userPoints={125} />

      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Add New Item</h1>
            <p className="text-muted-foreground">Share your pre-loved fashion with the ReWear community</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Images Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                  <CardDescription>Add up to 6 high-quality photos of your item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    {images.length < 6 && (
                      <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                        <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Add Photo</span>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>

                  {images.length === 0 && (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Upload your first photo</h3>
                      <p className="text-muted-foreground mb-4">Drag and drop your images here, or click to browse</p>
                      <label>
                        <Button variant="outline">Choose Files</Button>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Basic Information */}
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
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the item's condition, style, and any special features..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tops">Tops & T-Shirts</SelectItem>
                          <SelectItem value="dresses">Dresses</SelectItem>
                          <SelectItem value="outerwear">Outerwear</SelectItem>
                          <SelectItem value="bottoms">Bottoms</SelectItem>
                          <SelectItem value="shoes">Shoes</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Input
                        id="type"
                        placeholder="e.g., Jacket, Dress, Sneakers"
                        value={formData.type}
                        onChange={(e) => handleInputChange("type", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="size">Size *</Label>
                      <Select value={formData.size} onValueChange={(value) => handleInputChange("size", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xs">XS</SelectItem>
                          <SelectItem value="s">S</SelectItem>
                          <SelectItem value="m">M</SelectItem>
                          <SelectItem value="l">L</SelectItem>
                          <SelectItem value="xl">XL</SelectItem>
                          <SelectItem value="xxl">XXL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition *</Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) => handleInputChange("condition", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="like-new">Like New</SelectItem>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="very-good">Very Good</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        placeholder="e.g., Blue, Black"
                        value={formData.color}
                        onChange={(e) => handleInputChange("color", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        placeholder="e.g., Levi's, Zara, H&M"
                        value={formData.brand}
                        onChange={(e) => handleInputChange("brand", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        placeholder="e.g., 100% Cotton, Polyester"
                        value={formData.material}
                        onChange={(e) => handleInputChange("material", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                  <CardDescription>Add tags to help others find your item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                    />
                    <Button onClick={addTag} disabled={!newTag.trim() || tags.length >= 10}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                          <span>#{tag}</span>
                          <button onClick={() => removeTag(tag)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">{tags.length}/10 tags used</p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How your item will appear</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    {images.length > 0 ? (
                      <img
                        src={images[0] || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Camera className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold">{formData.title || "Item Title"}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {formData.description || "Item description will appear here..."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {formData.category && (
                        <Badge variant="outline" className="text-xs">
                          {formData.category}
                        </Badge>
                      )}
                      {formData.size && (
                        <Badge variant="outline" className="text-xs">
                          Size {formData.size}
                        </Badge>
                      )}
                    </div>
                    <div className="text-primary font-semibold">~45 pts</div>
                  </div>
                </CardContent>
              </Card>

              {/* Guidelines */}
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
                <Button className="w-full" size="lg" asChild>
                  <Link href="/dashboard">Submit for Review</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Save as Draft
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Your item will be reviewed within 24 hours before going live
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
