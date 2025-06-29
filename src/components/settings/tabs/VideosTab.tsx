"use client";

<<<<<<< HEAD
import { useState, useMemo } from "react";
=======
import { useState } from "react";
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def
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
<<<<<<< HEAD
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
=======
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Edit, 
  Eye, 
  Loader2, 
  MoreVertical, 
  Plus, 
  Search, 
  Trash2, 
  VideoIcon 
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
<<<<<<< HEAD
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
=======
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface Video {
  id: string;
  title: string;
  thumbnail: string | null;
  sourceType: string;
  viewCount: number;
  createdAt: string;
  url: string;
}
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def

export function VideosTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
<<<<<<< HEAD
  const [totalPages, setTotalPages] = useState(1); // We'll calculate this based on total videos
  const limit = 10;

  // Fetch videos
  const { data, isLoading, error } = useGetAllVideos(page, limit, searchQuery);

  // Memoize videos for performance and fallback
  const videos = useMemo(() => data?.data ?? [], [data]);
  // const totalVideos = useMemo(() => data?.total ?? 0, [data]);
=======

  // Fetch videos
  const { data, isLoading } = useQuery({
    queryKey: ["videos", page, searchQuery],
    queryFn: async () => {
      // This would normally be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Generate mock data
      const mockVideos: Video[] = Array.from({ length: 10 }).map((_, i) => ({
        id: `vid_${i + (page-1) * 10}`,
        title: `Video ${i + (page-1) * 10 + 1}`,
        thumbnail: i % 3 === 0 ? null : `https://picsum.photos/seed/${i + (page-1) * 10}/300/200`,
        sourceType: i % 4 === 0 ? "YOUTUBE" : i % 4 === 1 ? "VIMEO" : i % 4 === 2 ? "DAILYMOTION" : "CUSTOM",
        viewCount: Math.floor(Math.random() * 1000),
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        url: "https://example.com/video",
      }));
      
      return {
        videos: mockVideos,
        pagination: {
          total: 104,
          pages: 11,
          page,
          limit: 10
        }
      };
    },
  });
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
<<<<<<< HEAD
  };

  const toggleVideoSelection = (videoId: string) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
=======
    // Query will be updated via dependency in useQuery
  };

  const toggleVideoSelection = (videoId: string) => {
    setSelectedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId) 
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def
        : [...prev, videoId]
    );
  };

  const toggleAllVideos = () => {
<<<<<<< HEAD
    if (selectedVideos.length === videos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(videos.map((video) => video.id));
=======
    if (selectedVideos.length === data?.videos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(data?.videos.map(video => video.id) || []);
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def
    }
  };

  const handleDeleteSelected = () => {
<<<<<<< HEAD
=======
    // toast({
    //   title: `${selectedVideos.length} videos deleted`,
    //   description: "Selected videos have been removed.",
    // });
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def
    toast.success(`${selectedVideos.length} videos deleted`, {
      description: "Selected videos have been removed.",
    });
    setSelectedVideos([]);
  };

  const formatDate = (dateString: string) => {
<<<<<<< HEAD
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
=======
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def
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
<<<<<<< HEAD
            <Button
              variant="destructive"
=======
            <Button 
              variant="destructive" 
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def
              size="sm"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {selectedVideos.length}
            </Button>
          )}
<<<<<<< HEAD
          <Link href="/add-video" className="flex items-center cursor-pointer">
            <Button className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </Link>
=======
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Video
          </Button>
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def
        </div>
      </div>

      <div className="border rounded-lg">
        <ScrollArea className="h-[450px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
<<<<<<< HEAD
                  <Checkbox
                    checked={
                      videos.length > 0 &&
                      selectedVideos.length === videos.length
=======
                  <Checkbox 
                    checked={
                      data?.videos.length 
                        ? selectedVideos.length === data.videos.length 
                        : false
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def
                    }
                    onCheckedChange={toggleAllVideos}
                  />
                </TableHead>
                <TableHead>Video</TableHead>
                <TableHead className="hidden md:table-cell">Source</TableHead>
                <TableHead className="hidden md:table-cell">Views</TableHead>
<<<<<<< HEAD
                <TableHead className="hidden md:table-cell">
                  Date Added
                </TableHead>
=======
                <TableHead className="hidden md:table-cell">Date Added</TableHead>
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def
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
<<<<<<< HEAD
              ) : videos.length === 0 ? (
=======
              ) : data?.videos.length === 0 ? (
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def
                <TableRow>
                  <TableCell colSpan={6} className="h-96 text-center">
                    <div className="flex flex-col items-center justify-center h-full">
                      <VideoIcon className="h-12 w-12 text-muted-foreground/30 mb-3" />
<<<<<<< HEAD
                      <p className="text-muted-foreground font-medium">
                        No videos found
                      </p>
=======
                      <p className="text-muted-foreground font-medium">No videos found</p>
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def
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
<<<<<<< HEAD
                videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <Checkbox
=======
                data?.videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <Checkbox 
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def
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
<<<<<<< HEAD
                          <DropdownMenuItem
                            onClick={() => window.open(video.url, "_blank")}
                          >
=======
                          <DropdownMenuItem onClick={() => window.open(video.url, '_blank')}>
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def
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

<<<<<<< HEAD
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
=======
      {data && data.pagination.pages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              />
            </PaginationItem>
            
            {page > 2 && (
              <PaginationItem>
                <PaginationLink onClick={() => setPage(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            
            {page > 3 && (
              <PaginationItem>
                <PaginationLink className="cursor-default">
                  ...
                </PaginationLink>
              </PaginationItem>
            )}
            
            {page > 1 && (
              <PaginationItem>
                <PaginationLink onClick={() => setPage(page - 1)}>
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationLink isActive>
                {page}
              </PaginationLink>
            </PaginationItem>
            
            {page < data.pagination.pages && (
              <PaginationItem>
                <PaginationLink onClick={() => setPage(page + 1)}>
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            
            {page < data.pagination.pages - 2 && (
              <PaginationItem>
                <PaginationLink className="cursor-default">
                  ...
                </PaginationLink>
              </PaginationItem>
            )}
            
            {page < data.pagination.pages - 1 && (
              <PaginationItem>
                <PaginationLink onClick={() => setPage(data.pagination.pages)}>
                  {data.pagination.pages}
                </PaginationLink>
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))} 
                disabled={page === data.pagination.pages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
>>>>>>> b634cc6af16c7ddc797b8d85097486e314383def
