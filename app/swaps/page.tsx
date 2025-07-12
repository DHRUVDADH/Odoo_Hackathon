"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import {
  ArrowRightLeft,
  Clock,
  CheckCircle,
  XCircle,
  User,
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
} from "lucide-react";

export default function SwapsPage() {
  const { user } = useAuth();
  const [incoming, setIncoming] = useState<any[]>([]);
  const [outgoing, setOutgoing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [tab, setTab] = useState("incoming");

  useEffect(() => {
    if (!user) return;
    const fetchSwaps = async () => {
      setLoading(true);
      try {
        const [inRes, outRes] = await Promise.all([
          apiClient.getMySwapRequests(),
          apiClient.getOutgoingSwapRequests(),
        ]);
        // Support both { data: { swaps } } and { swaps }
        const getSwaps = (res: any) =>
          res.success && ((res.data && res.data.swaps) || res.swaps || []);
        setIncoming(getSwaps(inRes));
        setOutgoing(getSwaps(outRes));
      } finally {
        setLoading(false);
      }
    };
    fetchSwaps();
  }, [user]);

  const handleAction = async (swapId: string, action: "accept" | "reject") => {
    setActionLoading(swapId + action);
    try {
      const res =
        action === "accept"
          ? await apiClient.acceptSwap(swapId)
          : await apiClient.rejectSwap(swapId);
      if (res.success) {
        toast.success(
          action === "accept" ? "Swap accepted!" : "Swap rejected!"
        );
        setIncoming((prev) => prev.filter((s) => s._id !== swapId));
      } else {
        toast.error(res.message || "Action failed");
      }
    } catch (e: any) {
      toast.error(e.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
          icon: Clock,
          label: "Pending",
        };
      case "accepted":
        return {
          color:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
          icon: CheckCircle,
          label: "Accepted",
        };
      case "rejected":
        return {
          color:
            "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
          icon: XCircle,
          label: "Rejected",
        };
      case "completed":
        return {
          color:
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
          icon: CheckCircle,
          label: "Completed",
        };
      default:
        return {
          color:
            "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800",
          icon: Clock,
          label: "Unknown",
        };
    }
  };

  const renderSwapCard = (swap: any, isIncoming: boolean) => {
    const diff = swap.requestedItem.price - swap.offeredItem.price;
    const youGive = isIncoming ? swap.requestedItem : swap.offeredItem;
    const youGet = isIncoming ? swap.offeredItem : swap.requestedItem;
    const otherUser = isIncoming ? swap.requester : swap.recipient;
    const statusConfig = getStatusConfig(swap.status);
    const StatusIcon = statusConfig.icon;

    const getDiffConfig = (diff: number, isIncoming: boolean) => {
      if (diff === 0) {
        return {
          icon: Minus,
          text: "Even swap",
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-100 dark:bg-gray-800",
        };
      }
      const isGain = (diff > 0 && isIncoming) || (diff < 0 && !isIncoming);
      return {
        icon: isGain ? TrendingUp : TrendingDown,
        text: isGain ? `+${Math.abs(diff)} pts` : `-${Math.abs(diff)} pts`,
        color: isGain
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-600 dark:text-red-400",
        bgColor: isGain
          ? "bg-emerald-50 dark:bg-emerald-950"
          : "bg-red-50 dark:bg-red-950",
      };
    };

    const diffConfig = getDiffConfig(diff, isIncoming);
    const DiffIcon = diffConfig.icon;

    return (
      <Card
        key={swap._id}
        className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50"
      >
        <CardContent className="p-6">
          {/* Header with user info and status */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={
                    otherUser.avatar || "/placeholder.svg?height=40&width=40"
                  }
                  alt={otherUser.username}
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-gray-100 dark:ring-gray-800"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {otherUser.username}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {isIncoming ? "Wants to swap with you" : "Swap request sent"}
                </div>
              </div>
            </div>
            <Badge
              className={`${statusConfig.color} border px-3 py-1 font-medium`}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>

          {/* Swap visualization */}
          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              {/* You give */}
              <div className="flex-1">
                <div className="text-center">
                  <div className="relative mb-3">
                    <Image
                      src={
                        youGive.images[0]?.url ||
                        "/placeholder.svg?height=120&width=120"
                      }
                      alt={youGive.title}
                      width={120}
                      height={120}
                      className="rounded-xl mx-auto shadow-md ring-1 ring-gray-200 dark:ring-gray-700"
                    />
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      -{youGive.price}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-red-600 dark:text-red-400">
                      You give
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                      {youGive.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {youGive.price} points
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap arrow */}
              <div className="flex flex-col items-center gap-2 px-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <ArrowRightLeft className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${diffConfig.bgColor} ${diffConfig.color}`}
                >
                  <DiffIcon className="w-3 h-3" />
                  {diffConfig.text}
                </div>
              </div>

              {/* You get */}
              <div className="flex-1">
                <div className="text-center">
                  <div className="relative mb-3">
                    <Image
                      src={
                        youGet.images[0]?.url ||
                        "/placeholder.svg?height=120&width=120"
                      }
                      alt={youGet.title}
                      width={120}
                      height={120}
                      className="rounded-xl mx-auto shadow-md ring-1 ring-gray-200 dark:ring-gray-700"
                    />
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      +{youGet.price}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      You get
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                      {youGet.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {youGet.price} points
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {isIncoming && swap.status === "pending" && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <Button
                onClick={() => handleAction(swap._id, "accept")}
                disabled={actionLoading === swap._id + "accept"}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {actionLoading === swap._id + "accept" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Swap
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAction(swap._id, "reject")}
                disabled={actionLoading === swap._id + "reject"}
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              >
                {actionLoading === swap._id + "reject" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </>
                )}
              </Button>
            </div>
          )}

          {!isIncoming && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                {swap.status === "pending" && (
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    Awaiting response from {otherUser.username}
                  </div>
                )}
                {swap.status === "accepted" && (
                  <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    Swap accepted by {otherUser.username}
                  </div>
                )}
                {swap.status === "rejected" && (
                  <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
                    <XCircle className="w-4 h-4" />
                    Swap rejected by {otherUser.username}
                  </div>
                )}
                {swap.status === "completed" && (
                  <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                    <CheckCircle className="w-4 h-4" />
                    Swap completed successfully
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderEmpty = (msg: string, isIncoming: boolean) => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-6">
        <Package className="w-12 h-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {isIncoming ? "No incoming requests" : "No outgoing requests"}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">{msg}</p>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-500">
            Please log in to view your swap requests.
          </p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading swap requests...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar isAuthenticated={!!user} userPoints={user?.points || 0} />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Swap Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your incoming and outgoing item swap requests
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-gray-100 dark:bg-gray-800 p-1">
            <TabsTrigger
              value="incoming"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 font-medium"
            >
              Incoming ({incoming.length})
            </TabsTrigger>
            <TabsTrigger
              value="outgoing"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 font-medium"
            >
              Outgoing ({outgoing.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incoming" className="space-y-6">
            {incoming.length === 0 ? (
              renderEmpty(
                "When other users want to swap items with you, they'll appear here.",
                true
              )
            ) : (
              <div className="grid gap-6">
                {incoming.map((swap) => renderSwapCard(swap, true))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="outgoing" className="space-y-6">
            {outgoing.length === 0 ? (
              renderEmpty(
                "Your swap requests to other users will appear here.",
                false
              )
            ) : (
              <div className="grid gap-6">
                {outgoing.map((swap) => renderSwapCard(swap, false))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
