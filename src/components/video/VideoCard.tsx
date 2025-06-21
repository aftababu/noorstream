"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  addedBy: {
    name: string;
    image?: string;
  };
  createdAt: Date;
  duration?: number;
  sourceType: string;
  viewCount: number;
}

export default function VideoCard({
  id,
  title,
  thumbnail,
  addedBy,
  createdAt,
  duration,
  sourceType,
  viewCount,
}: VideoCardProps) {
  // Format duration from seconds to mm:ss
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "--:--";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Link href={`/watch/${id}`}>
      <Card className="overflow-hidden border-0 bg-transparent transition-colors hover:bg-accent/50">
        <div className="relative aspect-video overflow-hidden rounded-md">
          <Image
            src={thumbnail || "/placeholder-thumbnail.jpg"}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 text-xs text-white rounded">
            {formatDuration(duration)}
          </div>
        </div>
        <CardContent className="p-2">
          <h3 className="line-clamp-2 font-medium">{title}</h3>
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <span>{addedBy.name}</span>
            <span className="mx-1">•</span>
            <span>{viewCount} views</span>
            <span className="mx-1">•</span>
            <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground uppercase">
            {sourceType}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}