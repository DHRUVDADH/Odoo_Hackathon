"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
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
  LogOut,
} from "lucide-react";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout } = useAuth();

  const userStats = {
    totalPoints: user?.points || 0,
    itemsListed: user?.stats?.itemsListed || 0,
    successfulSwaps: user?.stats?.swapsCompleted || 0,
    rating:
      user?.stats?.totalReviews > 0
        ? (
            (user?.stats?.positiveReviews / user?.stats?.totalReviews) *
            5
          ).toFixed(1)
        : "0.0",
    joinedDate: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "Recently",
  };

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
  ];

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
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "swapped":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Eye className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "swapped":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar isAuthenticated={true} userPoints={userStats.totalPoints} />

        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user?.avatar || "/placeholder.svg"}
                  alt={user?.firstName || "User"}
                />
                <AvatarFallback className="text-2xl">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-muted-foreground">
                  Member since {userStats.joinedDate}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{userStats.rating}</span>
                  </div>
                  <Badge variant="secondary">
                    {userStats.successfulSwaps} swaps completed
                  </Badge>
                </div>
              </div>
            </div>

            <div className="lg:ml-auto flex space-x-2">
              <Button asChild>
                <Link href="/add-item">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Item
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Points
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {userStats.totalPoints}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Items Listed
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStats.itemsListed}
                </div>
                <p className="text-xs text-muted-foreground">
                  3 active listings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Successful Swaps
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStats.successfulSwaps}
                </div>
                <p className="text-xs text-muted-foreground">+2 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Rating
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.rating}</div>
                <p className="text-xs text-muted-foreground">
                  Based on {user?.stats?.totalReviews || 0} reviews
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="my-items">My Items</TabsTrigger>
              <TabsTrigger value="swap-history">Swap History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Your latest interactions and updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New item listed</p>
                        <p className="text-xs text-muted-foreground">
                          Vintage Denim Jacket - 2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Swap completed</p>
                        <p className="text-xs text-muted-foreground">
                          Designer Handbag for Silk Scarf - 1 day ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          New message received
                        </p>
                        <p className="text-xs text-muted-foreground">
                          From Emma K. about your jacket - 3 days ago
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Progress Goals</CardTitle>
                    <CardDescription>
                      Track your sustainable fashion journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Items Swapped</span>
                        <span>{userStats.successfulSwaps}/20</span>
                      </div>
                      <Progress
                        value={(userStats.successfulSwaps / 20) * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Points Earned</span>
                        <span>{userStats.totalPoints}/500</span>
                      </div>
                      <Progress
                        value={(userStats.totalPoints / 500) * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Positive Reviews</span>
                        <span>{user?.stats?.positiveReviews || 0}/10</span>
                      </div>
                      <Progress
                        value={((user?.stats?.positiveReviews || 0) / 10) * 100}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="my-items" className="space-y-6">
              <div className="grid gap-6">
                {myItems.map((item) => (
                  <Card key={item.id} className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-48 h-48 md:h-auto">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                      />
                      <div
                        className={`absolute top-2 left-2 w-2 h-2 rounded-full ${getStatusColor(
                          item.status
                        )}`}
                      ></div>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.category} • {item.condition}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">{item.points}</p>
                          <p className="text-muted-foreground">Points</p>
                        </div>
                        <div>
                          <p className="font-medium">{item.views}</p>
                          <p className="text-muted-foreground">Views</p>
                        </div>
                        <div>
                          <p className="font-medium">{item.likes}</p>
                          <p className="text-muted-foreground">Likes</p>
                        </div>
                        <div>
                          <p className="font-medium">{item.messages}</p>
                          <p className="text-muted-foreground">Messages</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-muted-foreground">
                          Listed {item.listedDate}
                        </span>
                        <Badge
                          variant="outline"
                          className="flex items-center space-x-1"
                        >
                          {getStatusIcon(item.status)}
                          <span className="capitalize">{item.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="swap-history" className="space-y-6">
              <div className="grid gap-4">
                {swapHistory.map((swap) => (
                  <Card key={swap.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              swap.type === "completed"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          ></div>
                          <div>
                            <h3 className="font-semibold">{swap.item}</h3>
                            <p className="text-sm text-muted-foreground">
                              Swapped with {swap.swappedWith} • {swap.partner}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            +{swap.pointsEarned} points
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {swap.date}
                          </p>
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
    </ProtectedRoute>
  );
}
