import { Suspense } from "react";
import VideoCard from "./VideoCard";
import { Skeleton } from "@/components/ui/skeleton";

// This would be populated from an API call in a real implementation
const dummyVideos = [
  {
    id: "1",
    title: "Introduction to Next.js 15",
    thumbnail: "/placeholders/thumbnail1.jpg",
    addedBy: {
      name: "Tech Channel",
      image: "/placeholders/user1.jpg"
    },
    createdAt: new Date("2025-03-10"),
    duration: 485, // 8:05
    sourceType: "YOUTUBE",
    viewCount: 1542
  },
  {
    id: "2",
    title: "Building UI Components with Shadcn",
    thumbnail: "/placeholders/thumbnail2.jpg",
    addedBy: {
      name: "Design Tutorials",
      image: "/placeholders/user2.jpg"
    },
    createdAt: new Date("2025-03-08"),
    duration: 843, // 14:03
    sourceType: "VIMEO",
    viewCount: 2103
  },
  // More videos would be here
];

interface VideoGridProps {
  type: "recommended" | "latest" | "channel" | "collection" | "search"|"all"|"recent"|"popular";
  channelId?: string;
  collectionId?: string;
  searchQuery?: string;
}

async function getVideos({ type, channelId, collectionId, searchQuery }: VideoGridProps) {
  // This would be an actual API call in a real implementation
  // For now, let's simulate a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyVideos;
}

export default async function VideoGrid(props: VideoGridProps) {
  const videos = await getVideos(props);
  
  if (videos.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium">No videos found</h3>
        <p className="text-muted-foreground mt-2">
          Try adding some videos to your collection
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} {...video} />
      ))}
    </div>
  );
}

export function VideoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array(8).fill(0).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-video w-full rounded-md" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}