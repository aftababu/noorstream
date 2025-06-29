"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Crown, 
  Infinity, 
  Loader2,
  Video 
} from "lucide-react";

interface SubscriptionData {
  subscription: {
    id: string;
    type: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  } | null;
  videoCount: number;
  isPremium: boolean;
  remainingFreeVideos?: number;
}

export function SubscriptionTab() {
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Fetch subscription data
  const { data, isLoading, refetch } = useQuery<SubscriptionData>({
    queryKey: ["subscription"],
    queryFn: async () => {
      // This would normally be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Mocked subscription data
      return {
        subscription: {
          id: "sub_123456",
          type: "FREE",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          isActive: true,
        },
        videoCount: 742,
        isPremium: false,
        remainingFreeVideos: 1500 - 742,
      };
    },
  });

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // toast({
      //   title: "Upgrade successful!",
      //   description: "You are now a premium member.",
      // });
      toast.success("Upgrade successful! You are now a premium member.");
      
      refetch();
    } catch (error) {
      // toast({
      //   title: "Upgrade failed",
      //   description: "There was an error processing your payment.",
      //   variant: "destructive",
      // });
      toast.error("Upgrade failed. There was an error processing your payment.");
      console.error("Upgrade error:", error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Subscription</h2>
        <p className="text-muted-foreground">
          Manage your subscription and storage limits.
        </p>
      </div>

      {/* Current subscription status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {data?.isPremium ? (
              <>
                <Crown className="h-5 w-5 text-yellow-500" />
                Premium Subscription
              </>
            ) : (
              <>
                <Video className="h-5 w-5" />
                Free Plan
              </>
            )}
          </CardTitle>
          <CardDescription>
            {data?.isPremium 
              ? "Enjoy unlimited videos and premium features"
              : "Limited to 1,500 videos"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Current Plan</span>
            <Badge variant={data?.isPremium ? "default" : "outline"}>
              {data?.subscription?.type || "FREE"}
            </Badge>
          </div>

          {data?.subscription?.endDate && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Valid Until</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {formatDate(data.subscription.endDate)}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Video Storage</span>
              <span className="text-sm font-medium">
                {data?.videoCount || 0} / {data?.isPremium ? "Unlimited" : "1,500"}
              </span>
            </div>
            {!data?.isPremium && (
              <Progress 
                value={(data?.videoCount || 0) / 15} 
                max={100}
                className="h-2"
              />
            )}
          </div>
        </CardContent>
        <CardFooter>
          {!data?.isPremium && (
            <Button 
              className="w-full" 
              onClick={handleUpgrade}
              disabled={isUpgrading}
            >
              {isUpgrading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Upgrade to Premium
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Feature comparison */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Plan Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>Basic video storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Store up to 1,500 videos</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Create and share public collections</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Basic video player features</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-bl-lg">
              RECOMMENDED
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Premium Plan
              </CardTitle>
              <CardDescription>Unlimited access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="flex items-center">
                  <span>Unlimited video storage </span>
                  <Infinity className="h-4 w-4 mx-1" />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Private collections</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Advanced video organization</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Priority support</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleUpgrade} disabled={isUpgrading || data?.isPremium}>
                {data?.isPremium ? "Current Plan" : "Upgrade Now"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}