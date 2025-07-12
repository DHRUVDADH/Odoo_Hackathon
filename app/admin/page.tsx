"use client";

import { useEffect, useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { apiClient, Item } from "@/lib/api";

export default function AdminPanel() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingItems, setPendingItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // itemId for which action is loading
  const [rejectReason, setRejectReason] = useState<{ [id: string]: string }>(
    {}
  );

  // Fetch pending items (force on mount for debugging)
  useEffect(() => {
    console.log("Fetching pending items (debug)");
    fetchPendingItems();
    // eslint-disable-next-line
  }, []);

  const fetchPendingItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.getPendingItems();
      if (res.success && res.data) {
        setPendingItems(res.data.items);
      } else {
        setError(res.message || "Failed to fetch pending items");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch pending items");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId: string) => {
    setActionLoading(itemId);
    try {
      await apiClient.approveItem(itemId);
      setPendingItems((items) => items.filter((item) => item._id !== itemId));
    } catch (err: any) {
      alert(err.message || "Failed to approve item");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (itemId: string) => {
    setActionLoading(itemId);
    try {
      await apiClient.rejectItem(itemId, rejectReason[itemId] || "");
      setPendingItems((items) => items.filter((item) => item._id !== itemId));
      setRejectReason((r) => ({ ...r, [itemId]: "" }));
    } catch (err: any) {
      alert(err.message || "Failed to reject item");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = (itemId: number) => {
    console.log(`Removed item ${itemId}`);
  };

  // Restrict access to logged-in users only (temporarily allow all users)
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 font-bold">
        Please log in to access the admin dashboard.
      </div>
    );
  }

  const adminStats = {
    totalUsers: 1247,
    activeListings: 342,
    pendingReviews: 23,
    completedSwaps: 1856,
    flaggedItems: 5,
  };

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
              {loading ? (
                <p>Loading pending items...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : pendingItems.length === 0 ? (
                <p>No pending items found.</p>
              ) : (
                pendingItems.map((item) => (
                  <Card
                    key={item._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Image
                          src={
                            item.images && item.images.length > 0
                              ? item.images[0].url
                              : "/placeholder.svg"
                          }
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
                                by {item.owner?.username || "Unknown User"}
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
                              Submitted{" "}
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleApprove(item._id)}
                                disabled={actionLoading === item._id}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                {actionLoading === item._id
                                  ? "Approving..."
                                  : "Approve"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Approve Item
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to approve "{item.title}
                                  "? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleApprove(item._id)}
                                >
                                  Approve
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  setRejectReason({
                                    ...rejectReason,
                                    [item._id]: "",
                                  })
                                }
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reject Item</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to reject "{item.title}
                                  "? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleReject(item._id)}
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
                ))
              )}
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
