"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient, Item } from "@/lib/api";
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
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  // Helper to fetch item data
  const fetchItem = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getItem(id as string);
      if (res.success && res.data) {
        setItem(res.data.item);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchItem();
  }, [id]);

  // Fetch user's items for swap
  useEffect(() => {
    if (!user) return;
    const fetchMyItems = async () => {
      const res = await apiClient.getUserItems(user._id);
      if (res.success && res.data) {
        setMyItems(
          res.data.items.filter((i) => i.status === "approved" && i._id !== id)
        );
      }
    };
    fetchMyItems();
  }, [user, id]);

  const handleRedeem = async () => {
    if (!item) return;
    setRedeemLoading(true);
    try {
      const res = await apiClient.redeemItem(item._id);
      if (res.success) {
        toast.success("Item redeemed successfully!");
        await fetchItem(); // Refresh item data after redeem
      } else {
        toast.error(res.message || "Failed to redeem item");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to redeem item");
    } finally {
      setRedeemLoading(false);
    }
  };

  const handleOpenSwapModal = () => {
    setSwapModalOpen(true);
  };

  const handleRequestSwap = async () => {
    if (!item || !selectedOfferId) return;
    setSwapLoading(true);
    try {
      const res = await apiClient.requestSwap(item._id, selectedOfferId);
      if (res.success) {
        toast.success("Swap request sent!");
        setSwapModalOpen(false);
        setSelectedOfferId(null);
        await fetchItem(); // Refresh item data after swap
      } else {
        toast.error(res.message || "Failed to request swap");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to request swap");
    } finally {
      setSwapLoading(false);
    }
  };

  if (loading) return <p>Loading item...</p>;
  if (!item) return <p>Item not found.</p>;

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
      <Navbar isAuthenticated={!!user} userPoints={user?.points || 0} />

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
                src={item.images[currentImageIndex]?.url || "/placeholder.svg"}
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
                {item.images.map((img, index) => (
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
                      src={img?.url || "/placeholder.svg"}
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
                    <span>{item.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">price</p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleOpenSwapModal}
                disabled={
                  !user || myItems.length === 0 || item?.status !== "approved"
                }
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Request Swap
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={handleRedeem}
                disabled={
                  !user ||
                  redeemLoading ||
                  (user && user.points < (item?.price || 0)) ||
                  item?.status !== "approved"
                }
              >
                <Star className="mr-2 h-5 w-5" />
                {redeemLoading ? "Redeeming..." : "Redeem with Points"}
              </Button>
            </div>
            {/* Swap Modal */}
            <Dialog open={swapModalOpen} onOpenChange={setSwapModalOpen}>
              <DialogContent>
                <DialogTitle>Select an item to offer for swap</DialogTitle>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {myItems.length === 0 ? (
                    <p>You have no items available for swap.</p>
                  ) : (
                    myItems.map((myItem) => (
                      <div
                        key={myItem._id}
                        className={`flex items-center p-2 border rounded cursor-pointer ${
                          selectedOfferId === myItem._id
                            ? "border-primary bg-muted"
                            : "border-gray-200"
                        }`}
                        onClick={() => setSelectedOfferId(myItem._id)}
                      >
                        <Image
                          src={myItem.images[0]?.url || "/placeholder.svg"}
                          alt={myItem.title}
                          width={48}
                          height={48}
                          className="rounded mr-2"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">{myItem.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {myItem.category} • {myItem.price} pts
                          </div>
                        </div>
                        {selectedOfferId === myItem._id && (
                          <span className="ml-2 text-primary">Selected</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setSwapModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRequestSwap}
                    disabled={!selectedOfferId || swapLoading}
                  >
                    {swapLoading ? "Requesting..." : "Request Swap"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

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
                  {/* Optionally render availability if present */}
                  {item.status && (
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className="font-medium text-green-600">
                        {item.status}
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                {item.measurements &&
                  typeof item.measurements === "object" &&
                  Object.keys(item.measurements).length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Measurements</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        {Object.entries(item.measurements).map(
                          ([key, value]) => (
                            <div key={key}>
                              <span className="text-muted-foreground">
                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                              </span>
                              <p className="font-medium">{String(value)}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

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
                      src={item.owner?.avatar || "/placeholder.svg"}
                      alt={item.owner?.username || "User"}
                    />
                    <AvatarFallback>
                      {item.owner?.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {item.owner?.username}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">View Profile</Button>
                </div>
              </CardContent>
            </Card>

            {/* Item Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Package className="h-4 w-4" />
                <span>
                  Listed {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{item.likes.length} likes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>ClosetLoop Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Items section removed for now */}
      </div>
    </div>
  );
}
