"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Search, Heart, Star, Grid, List, SlidersHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ItemListingPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const items = [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      description: "Classic blue denim jacket in excellent condition. Perfect for layering.",
      category: "Outerwear",
      size: "M",
      condition: "Excellent",
      points: 45,
      image: "/placeholder.svg?height=300&width=300",
      user: "Sarah M.",
      userAvatar: "/placeholder.svg?height=40&width=40",
      location: "New York, NY",
      uploadedAt: "2 days ago",
      tags: ["vintage", "denim", "casual"],
    },
    {
      id: 2,
      title: "Designer Summer Dress",
      description: "Flowy summer dress from a premium brand. Worn only once to a wedding.",
      category: "Dresses",
      size: "S",
      condition: "Like New",
      points: 60,
      image: "/placeholder.svg?height=300&width=300",
      user: "Emma K.",
      userAvatar: "/placeholder.svg?height=40&width=40",
      location: "Los Angeles, CA",
      uploadedAt: "1 day ago",
      tags: ["designer", "summer", "formal"],
    },
    {
      id: 3,
      title: "Casual Cotton T-Shirt",
      description: "Soft cotton t-shirt in navy blue. Great for everyday wear.",
      category: "Tops",
      size: "L",
      condition: "Good",
      points: 25,
      image: "/placeholder.svg?height=300&width=300",
      user: "Alex R.",
      userAvatar: "/placeholder.svg?height=40&width=40",
      location: "Chicago, IL",
      uploadedAt: "3 days ago",
      tags: ["cotton", "casual", "basic"],
    },
    {
      id: 4,
      title: "Wool Winter Coat",
      description: "Warm wool coat perfect for cold weather. Classic black color.",
      category: "Outerwear",
      size: "M",
      condition: "Very Good",
      points: 80,
      image: "/placeholder.svg?height=300&width=300",
      user: "Maria L.",
      userAvatar: "/placeholder.svg?height=40&width=40",
      location: "Boston, MA",
      uploadedAt: "1 week ago",
      tags: ["wool", "winter", "formal"],
    },
    {
      id: 5,
      title: "Athletic Running Shoes",
      description: "Lightweight running shoes with minimal wear. Great for workouts.",
      category: "Shoes",
      size: "9",
      condition: "Good",
      points: 35,
      image: "/placeholder.svg?height=300&width=300",
      user: "Mike T.",
      userAvatar: "/placeholder.svg?height=40&width=40",
      location: "Seattle, WA",
      uploadedAt: "4 days ago",
      tags: ["athletic", "running", "sports"],
    },
    {
      id: 6,
      title: "Silk Blouse",
      description: "Elegant silk blouse in cream color. Perfect for professional settings.",
      category: "Tops",
      size: "M",
      condition: "Excellent",
      points: 50,
      image: "/placeholder.svg?height=300&width=300",
      user: "Lisa W.",
      userAvatar: "/placeholder.svg?height=40&width=40",
      location: "Miami, FL",
      uploadedAt: "5 days ago",
      tags: ["silk", "professional", "elegant"],
    },
  ]

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} userPoints={125} />

      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col space-y-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Browse Items</h1>
            <p className="text-muted-foreground">Discover amazing pre-loved fashion from our community</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for items, brands, or styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tops">Tops</SelectItem>
                  <SelectItem value="dresses">Dresses</SelectItem>
                  <SelectItem value="outerwear">Outerwear</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="s">S</SelectItem>
                  <SelectItem value="m">M</SelectItem>
                  <SelectItem value="l">L</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Condition</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem>Like New</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Excellent</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Very Good</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Good</DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Points Range</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem>0-25 points</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>26-50 points</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>51-75 points</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>76+ points</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* View Toggle and Sort */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground ml-4">{filteredItems.length} items found</span>
            </div>

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="points-low">Points: Low to High</SelectItem>
                <SelectItem value="points-high">Points: High to Low</SelectItem>
                <SelectItem value="condition">Best Condition</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Items Grid/List */}
        <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md"
            >
              <CardContent className="p-0">
                {viewMode === "grid" ? (
                  <Link href={`/items/${item.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge className="absolute top-3 left-3" variant="secondary">
                        {item.condition}
                      </Badge>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Size {item.size}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1 text-primary font-semibold">
                          <Star className="h-4 w-4 fill-current" />
                          <span>{item.points}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2 border-t">
                        <Image
                          src={item.userAvatar || "/placeholder.svg"}
                          alt={item.user}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="text-sm text-muted-foreground">{item.user}</span>
                        <span className="text-xs text-muted-foreground">• {item.uploadedAt}</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <Link href={`/items/${item.id}`} className="flex p-4 space-x-4">
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                      />
                      <Badge className="absolute -top-2 -right-2" variant="secondary">
                        {item.condition}
                      </Badge>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground line-clamp-2">{item.description}</p>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge variant="outline">Size {item.size}</Badge>
                        <div className="flex items-center space-x-1 text-primary font-semibold ml-auto">
                          <Star className="h-4 w-4 fill-current" />
                          <span>{item.points} pts</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          <Image
                            src={item.userAvatar || "/placeholder.svg"}
                            alt={item.user}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="text-sm text-muted-foreground">{item.user}</span>
                          <span className="text-xs text-muted-foreground">• {item.location}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{item.uploadedAt}</span>
                      </div>
                    </div>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Items
          </Button>
        </div>
      </div>
    </div>
  )
}
