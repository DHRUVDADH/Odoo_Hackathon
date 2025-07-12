"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/navbar";
import {
  Heart,
  Share2,
  Star,
  MapPin,
  Package,
  Shield,
  MessageCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ProductDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const item = {
    id: 1,
    title: "Vintage Denim Jacket",
    description:
      "This classic blue denim jacket is in excellent condition and perfect for layering. It features a timeless design with button closure, chest pockets, and a comfortable fit. The jacket has been well-maintained and shows minimal signs of wear. Perfect for casual outings or adding a vintage touch to any outfit.",
    category: "Outerwear",
    size: "M",
    condition: "Excellent",
    points: 45,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    user: {
      name: "Sarah M.",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 4.8,
      totalSwaps: 23,
      joinedDate: "January 2023",
      location: "New York, NY",
    },
    uploadedAt: "2 days ago",
    views: 124,
    likes: 18,
    tags: ["vintage", "denim", "casual", "layering"],
    measurements: {
      chest: "42 inches",
      length: "24 inches",
      sleeves: "25 inches",
    },
    material: "100% Cotton Denim",
    brand: "Levi's",
    availability: "Available",
  };

  const similarItems = [
    {
      id: 2,
      title: "Classic Leather Jacket",
      points: 65,
      image: "/placeholder.svg?height=200&width=200",
      condition: "Very Good",
    },
    {
      id: 3,
      title: "Wool Peacoat",
      points: 55,
      image: "/placeholder.svg?height=200&width=200",
      condition: "Excellent",
    },
    {
      id: 4,
      title: "Bomber Jacket",
      points: 40,
      image: "/placeholder.svg?height=200&width=200",
      condition: "Good",
    },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + item.images.length) % item.images.length
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} userPoints={125} />

      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6 text-sm text-muted-foreground">
          <Link
            href="/items"
            className="hover:text-foreground flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Items
          </Link>
          <span>/</span>
          <span>{item.category}</span>
          <span>/</span>
          <span className="text-foreground">{item.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <Image
                src={item.images[currentImageIndex] || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover"
              />

              {item.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}

              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <Badge className="absolute top-4 left-4" variant="secondary">
                {item.condition}
              </Badge>
            </div>

            {/* Thumbnail Gallery */}
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${item.title} ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2 dark:text-[#00c49a]">
                    {item.title}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{item.category}</Badge>
                    <Badge variant="outline">Size {item.size}</Badge>
                    <Badge variant="outline">{item.brand}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-2xl font-bold text-primary">
                    <Star className="h-6 w-6 fill-current" />
                    <span>{item.points}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">points</p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button size="lg" className="flex-1">
                <MessageCircle className="mr-2 h-5 w-5" />
                Request Swap
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 bg-transparent"
              >
                <Star className="mr-2 h-5 w-5" />
                Redeem with Points
              </Button>
            </div>

            {/* Item Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Item Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Condition:</span>
                    <p className="font-medium">{item.condition}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Material:</span>
                    <p className="font-medium">{item.material}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Brand:</span>
                    <p className="font-medium">{item.brand}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Availability:</span>
                    <p className="font-medium text-green-600">
                      {item.availability}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Measurements</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Chest:</span>
                      <p className="font-medium">{item.measurements.chest}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Length:</span>
                      <p className="font-medium">{item.measurements.length}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sleeves:</span>
                      <p className="font-medium">{item.measurements.sleeves}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={item.user.avatar || "/placeholder.svg"}
                      alt={item.user.name}
                    />
                    <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.user.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{item.user.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{item.user.totalSwaps} swaps</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{item.user.location}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Member since {item.user.joinedDate}
                    </p>
                  </div>
                  <Button variant="outline">View Profile</Button>
                </div>
              </CardContent>
            </Card>

            {/* Item Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Package className="h-4 w-4" />
                  <span>Listed {item.uploadedAt}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{item.likes} likes</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>ReWear Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Items */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarItems.map((similarItem) => (
              <Card
                key={similarItem.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={similarItem.image || "/placeholder.svg"}
                      alt={similarItem.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge
                      className="absolute top-3 left-3"
                      variant="secondary"
                    >
                      {similarItem.condition}
                    </Badge>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {similarItem.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-primary font-semibold">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{similarItem.points} pts</span>
                      </div>
                      <Button size="sm" variant="outline">
                        View Item
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
