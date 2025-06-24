"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

import { 
  User, 
  Video, 
   
  ArrowLeftRight, 
  CreditCard,
  CheckCheck,
} from "lucide-react";
import { ProfileTab } from "./tabs/ProfileTab";
import { VideosTab } from "./tabs/VideosTab";
import { CollectionsTab } from "./tabs/CollectionsTab";
import { ImportExportTab } from "./tabs/ImportExportTab";
import { SubscriptionTab } from "./tabs/SubscriptionTab";

export function SettingsPageContent({ initialTab }: { initialTab: string }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`${pathname}?tab=${value}`, { scroll: false });
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Videos</span>
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex items-center gap-2">
            <CheckCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Collections</span>
          </TabsTrigger>
          <TabsTrigger value="import-export" className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            <span className="hidden sm:inline">Import/Export</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Subscription</span>
          </TabsTrigger>
        </TabsList>

        <Card className="p-6">
          <TabsContent value="account" className="space-y-4">
            <ProfileTab />
          </TabsContent>
          
          <TabsContent value="videos" className="space-y-4">
            <VideosTab />
          </TabsContent>
          
          <TabsContent value="collections" className="space-y-4">
            <CollectionsTab />
          </TabsContent>
          
          <TabsContent value="import-export" className="space-y-4">
            <ImportExportTab />
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4">
            <SubscriptionTab />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}