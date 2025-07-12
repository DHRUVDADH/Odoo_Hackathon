"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/navbar";
import {
  Search,
  Check,
  X,
  Eye,
  AlertTriangle,
  Users,
  Package,
  TrendingUp,
  Calendar,
  Flag,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const adminStats = {
    totalUsers: 1247,
    activeListings: 342,
    pendingReviews: 23,
    completedSwaps: 1856,
    flaggedItems: 5,
  };

  const pendingItems = [
    {
      id: 1,
      title: "Vintage Leather Jacket",
      user: "Sarah M.",
      category: "Outerwear",
      condition: "Excellent",
      submittedAt: "2 hours ago",
      images: ["/placeholder.svg?height=100&width=100"],
      description: "Classic brown leather jacket in excellent condition...",
      status: "pending",
    },
    {
      id: 2,
      title: "Designer Summer Dress",
      user: "Emma K.",
      category: "Dresses",
      condition: "Like New",
      submittedAt: "4 hours ago",
      images: ["/placeholder.svg?height=100&width=100"],
      description: "Beautiful floral summer dress from premium brand...",
      status: "pending",
    },
    {
      id: 3,
      title: "Athletic Running Shoes",
      user: "Mike T.",
      category: "Shoes",
      condition: "Good",
      submittedAt: "6 hours ago",
      images: ["/placeholder.svg?height=100&width=100"],
      description: "Lightweight running shoes with minimal wear...",
      status: "pending",
    },
  ];

  const flaggedItems = [
    {
      id: 4,
      title: "Suspicious Designer Bag",
      user: "Unknown User",
      reason: "Potential counterfeit",
      reportedBy: "Community",
      flaggedAt: "1 day ago",
      images: ["/placeholder.svg?height=100&width=100"],
      status: "flagged",
    },
    {
      id: 5,
      title: "Inappropriate Content",
      user: "Test User",
      reason: "Inappropriate images",
      reportedBy: "Auto-detection",
      flaggedAt: "2 days ago",
      images: ["/placeholder.svg?height=100&width=100"],
      status: "flagged",
    },
  ];

  const recentActions = [
    {
      id: 1,
      action: "Approved",
      item: "Vintage Denim Jacket",
      user: "Alex R.",
      timestamp: "10 minutes ago",
      admin: "Admin",
    },
    {
      id: 2,
      action: "Rejected",
      item: "Damaged T-Shirt",
      user: "John D.",
      timestamp: "1 hour ago",
      admin: "Admin",
    },
    {
      id: 3,
      action: "Removed",
      item: "Spam Listing",
      user: "Spam User",
      timestamp: "2 hours ago",
      admin: "Admin",
    },
  ];

  const handleApprove = (itemId: number) => {
    console.log(`Approved item ${itemId}`);
  };

  const handleReject = (itemId: number) => {
    console.log(`Rejected item ${itemId}`);
  };

  const handleRemove = (itemId: number) => {
    console.log(`Removed item ${itemId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} userPoints={125} />

      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage listings and moderate content
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Admin Access
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adminStats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Listings
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adminStats.activeListings}
              </div>
              <p className="text-xs text-muted-foreground">
                +8% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Reviews
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {adminStats.pendingReviews}
              </div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Swaps
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adminStats.completedSwaps.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Flagged Items
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {adminStats.flaggedItems}
              </div>
              <p className="text-xs text-muted-foreground">Needs review</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">
              Pending Reviews ({adminStats.pendingReviews})
            </TabsTrigger>
            <TabsTrigger value="flagged">
              Flagged Items ({adminStats.flaggedItems})
            </TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pending items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pending Items List */}
            <div className="space-y-4">
              {pendingItems.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.title}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              by {item.user}
                            </p>
                          </div>
                          <Badge variant="outline">{item.status}</Badge>
                        </div>

                        <p className="text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center space-x-4 text-sm">
                          <Badge variant="secondary">{item.category}</Badge>
                          <Badge variant="secondary">{item.condition}</Badge>
                          <span className="text-muted-foreground">
                            Submitted {item.submittedAt}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(item.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Item</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to reject "{item.title}"?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleReject(item.id)}
                              >
                                Reject
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="flagged" className="space-y-6">
            <div className="space-y-4">
              {flaggedItems.map((item) => (
                <Card
                  key={item.id}
                  className="border-red-200 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.title}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              by {item.user}
                            </p>
                          </div>
                          <Badge variant="destructive">
                            <Flag className="h-3 w-3 mr-1" />
                            Flagged
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm">
                            <strong>Reason:</strong> {item.reason}
                          </p>
                          <p className="text-sm">
                            <strong>Reported by:</strong> {item.reportedBy}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Flagged {item.flaggedAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <X className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remove Flagged Item
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove "{item.title}"?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemove(item.id)}
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  User management features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="space-y-4">
              {recentActions.map((action) => (
                <Card
                  key={action.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            action.action === "Approved"
                              ? "bg-green-500"
                              : action.action === "Rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">
                            {action.action} "{action.item}"
                          </p>
                          <p className="text-sm text-muted-foreground">
                            by {action.user}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{action.admin}</p>
                        <p className="text-xs text-muted-foreground">
                          {action.timestamp}
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
  );
}
