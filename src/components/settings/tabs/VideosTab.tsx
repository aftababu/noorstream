"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Edit,
  Eye,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  VideoIcon,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetAllVideos } from "@/hooks/videos/useGetAllVideos";
import Link from "next/link";

export function VideosTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1); // We'll calculate this based on total videos
  const limit = 10;

  // Fetch videos
  const { data, isLoading, error } = useGetAllVideos(page, limit, searchQuery);

  // Memoize videos for performance and fallback
  const videos = useMemo(() => data?.data ?? [], [data]);
  // const totalVideos = useMemo(() => data?.total ?? 0, [data]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  const toggleVideoSelection = (videoId: string) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const toggleAllVideos = () => {
    if (selectedVideos.length === videos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(videos.map((video) => video.id));
    }
  };

  const handleDeleteSelected = () => {
    toast.success(`${selectedVideos.length} videos deleted`, {
      description: "Selected videos have been removed.",
    });
    setSelectedVideos([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSourceTypeBadge = (sourceType: string) => {
    switch (sourceType) {
      case "YOUTUBE":
        return <Badge variant="default">YouTube</Badge>;
      case "VIMEO":
        return <Badge variant="secondary">Vimeo</Badge>;
      case "DAILYMOTION":
        return <Badge variant="outline">Dailymotion</Badge>;
      default:
        return <Badge variant="outline">Custom</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Videos</h2>
        <p className="text-muted-foreground">
          Manage all your videos in one place.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="w-full sm:max-w-xs relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-2 self-end">
          {selectedVideos.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {selectedVideos.length}
            </Button>
          )}
          <Link href="/add-video" className="flex items-center cursor-pointer">
            <Button className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </Link>
        </div>
      </div>

      <div className="border rounded-lg">
        <ScrollArea className="h-[450px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      videos.length > 0 &&
                      selectedVideos.length === videos.length
                    }
                    onCheckedChange={toggleAllVideos}
                  />
                </TableHead>
                <TableHead>Video</TableHead>
                <TableHead className="hidden md:table-cell">Source</TableHead>
                <TableHead className="hidden md:table-cell">Views</TableHead>
                <TableHead className="hidden md:table-cell">
                  Date Added
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-96">
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : videos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-96 text-center">
                    <div className="flex flex-col items-center justify-center h-full">
                      <VideoIcon className="h-12 w-12 text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground font-medium">
                        No videos found
                      </p>
                      {searchQuery && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Try adjusting your search query
                        </p>
                      )}
                      <Button variant="outline" className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Add your first video
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedVideos.includes(video.id)}
                        onCheckedChange={() => toggleVideoSelection(video.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-20 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                          {video.thumbnail ? (
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <VideoIcon className="h-5 w-5 text-muted-foreground/50" />
                          )}
                        </div>
                        <div className="truncate max-w-[180px] sm:max-w-[280px]">
                          <p className="font-medium truncate">{video.title}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getSourceTypeBadge(video.sourceType)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {video.viewCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(video.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => window.open(video.url, "_blank")}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* For now, we'll use a simple pagination since your API doesn't yet return total pages */}
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : 0}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* You can optionally add more page numbers here if desired */}
          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (page < totalPages) setPage((p) => p + 1);
              }}
              isActive={page !== totalPages}
              aria-disabled={page === totalPages}
              tabIndex={page === totalPages ? -1 : 0}
              className={
                page === totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
