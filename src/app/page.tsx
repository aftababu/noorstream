import { Suspense } from "react";
import VideoGrid from "@/components/video/VideoGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="container py-6">
      {/* Algorithm recommended videos (max 5) */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Recommended For You</h1>
        <Suspense fallback={<AlgorithmRecommendationsSkeleton />}>
          <AlgorithmRecommendations />
        </Suspense>
      </section>

      {/* Collection videos */}
      <section>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Videos</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
            <TabsTrigger value="popular">Most Watched</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Suspense fallback={<VideoGridSkeleton />}>
              <VideoGrid type="all" />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="recent">
            <Suspense fallback={<VideoGridSkeleton />}>
              <VideoGrid type="recent" />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="popular">
            <Suspense fallback={<VideoGridSkeleton />}>
              <VideoGrid type="popular" />
            </Suspense>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

async function AlgorithmRecommendations() {
  // This would fetch algorithm-based recommendations
  // Limiting to 5 videos as per requirements
  // In a real app, this would call a recommendation API
  
  // For demo, simulating a delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {/* Placeholder recommendation items - max 5 */}
      {[...Array(5)].map((_, i) => (
        <RecommendationCard key={i} index={i} />
      ))}
    </div>
  );
}

function RecommendationCard({ index }: { index: number }) {
  const titles = [
    "Next.js 15 New Features",
    "Advanced Tailwind Techniques",
    "Building Custom UI Components",
    "State Management in React",
    "Responsive Design Patterns"
  ];
  
  return (
    <div className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-video bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          Thumbnail {index + 1}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium line-clamp-2">{titles[index]}</h3>
        <p className="text-sm text-muted-foreground mt-1">Recommended based on your interests</p>
      </div>
    </div>
  );
}

function AlgorithmRecommendationsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-video w-full rounded-md" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

function VideoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array(10).fill(0).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-video w-full rounded-md" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
} 