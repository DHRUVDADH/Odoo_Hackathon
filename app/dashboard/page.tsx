"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "@/components/navbar"
import {
  Star,
  Plus,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react"

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const userStats = {
    totalPoints: 125,
    itemsListed: 8,
    successfulSwaps: 12,
    rating: 4.8,
    joinedDate: "March 2024",
  }

  const myItems = [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      category: "Outerwear",
      condition: "Excellent",
      points: 45,
      image: "/placeholder.svg?height=200&width=200",
      status: "active",
      views: 24,
      likes: 8,
      messages: 3,
      listedDate: "2 days ago",
    },
    {
      id: 2,
      title: "Summer Floral Dress",
      category: "Dresses",
      condition: "Like New",
      points: 55,
      image: "/placeholder.svg?height=200&width=200",
      status: "pending",
      views: 18,
      likes: 12,
      messages: 5,
      listedDate: "1 week ago",
    },
    {
      id: 3,
      title: "Leather Boots",
      category: "Shoes",
      condition: "Good",
      points: 40,
      image: "/placeholder.svg?height=200&width=200",
      status: "swapped",
      views: 31,
      likes: 15,
      messages: 8,
      listedDate: "2 weeks ago",
    },
  ]

  const swapHistory = [
    {
      id: 1,
      type: "completed",
      item: "Designer Handbag",
      swappedWith: "Silk Scarf",
      partner: "Emma K.",
      date: "1 week ago",
      pointsEarned: 60,
    },
    {
      id: 2,
      type: "completed",
      item: "Winter Coat",
      swappedWith: "Casual Sneakers",
      partner: "Alex R.",
      date: "2 weeks ago",
      pointsEarned: 45,
    },
    {
      id: 3,
      type: "pending",
      item: "Vintage T-Shirt",
      swappedWith: "Denim Jeans",
      partner: "Sarah M.",
      date: "3 days ago",
      pointsEarned: 35,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "swapped":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Eye className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "swapped":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} userPoints={userStats.totalPoints} />

      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback className="text-2xl">JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">John Doe</h1>
              <p className="text-muted-foreground">Member since {userStats.joinedDate}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{userStats.rating}</span>
                </div>
                <Badge variant="secondary">{userStats.successfulSwaps} swaps completed</Badge>
              </div>
            </div>
          </div>

          <div className="lg:ml-auto">
            <Button asChild>
              <Link href="/add-item">
                <Plus className="mr-2 h-4 w-4" />
                Add New Item
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{userStats.totalPoints}</div>
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Listed</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.itemsListed}</div>
              <p className="text-xs text-muted-foreground">3 active listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Swaps</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.successfulSwaps}</div>
              <p className="text-xs text-muted-foreground">95% success rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.rating}</div>
              <p className="text-xs text-muted-foreground">Based on 24 reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="items">My Items</TabsTrigger>
            <TabsTrigger value="swaps">Swap History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest interactions on ReWear</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New swap request received</p>
                      <p className="text-xs text-muted-foreground">
                        Emma K. wants to swap for your Vintage Denim Jacket
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Item approved</p>
                      <p className="text-xs text-muted-foreground">Your Summer Floral Dress is now live</p>
                    </div>
                    <span className="text-xs text-muted-foreground">1d ago</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Points earned</p>
                      <p className="text-xs text-muted-foreground">+45 points from completed swap</p>
                    </div>
                    <span className="text-xs text-muted-foreground">3d ago</span>
                  </div>
                </CardContent>
              </Card>

              {/* Points Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Points Progress</CardTitle>
                  <CardDescription>Track your journey to the next level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Level: Silver</span>
                      <span>125 / 200 points</span>
                    </div>
                    <Progress value={62.5} className="h-2" />
                    <p className="text-xs text-muted-foreground">75 more points to reach Gold level</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-medium">Ways to earn points:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>List a new item</span>
                        <span className="text-primary">+10 pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Complete a swap</span>
                        <span className="text-primary">+25 pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Receive 5-star rating</span>
                        <span className="text-primary">+5 pts</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Items</h2>
              <Button asChild>
                <Link href="/add-item">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Item
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={`${getStatusColor(item.status)} text-white`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(item.status)}
                            <span className="capitalize">{item.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 flex space-x-1">
                        <Button size="icon" variant="secondary" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="secondary" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.condition}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1 text-primary font-semibold">
                          <Star className="h-4 w-4 fill-current" />
                          <span>{item.points} pts</span>
                        </div>
                        <span className="text-muted-foreground">{item.listedDate}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span>{item.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4 text-muted-foreground" />
                            <span>{item.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                            <span>{item.messages}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="swaps" className="space-y-6">
            <h2 className="text-2xl font-bold">Swap History</h2>

            <div className="space-y-4">
              {swapHistory.map((swap) => (
                <Card key={swap.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            swap.type === "completed" ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        ></div>
                        <div>
                          <p className="font-medium">
                            Swapped <span className="text-primary">{swap.item}</span> for{" "}
                            <span className="text-primary">{swap.swappedWith}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            with {swap.partner} • {swap.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-primary font-semibold">
                            <Star className="h-4 w-4 fill-current" />
                            <span>+{swap.pointsEarned}</span>
                          </div>
                        </div>
                        <Badge variant={swap.type === "completed" ? "default" : "secondary"}>
                          {swap.type === "completed" ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
