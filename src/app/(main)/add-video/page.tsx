"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, HelpCircle, ListVideo, Video as VideoIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllCollections } from "@/actions/collections/collectionsActions";
import { addVideo } from "@/actions/videos/videosAction";

// Define the import type (video or playlist)
type ImportType = "video" | "playlist";

interface Collection {
  id: string;
  name: string;
}

export default function AddVideoPage() {
  const { session, status } = useAuth({ required: true, redirectTo: "/login" });
  const router = useRouter();
  const [importType, setImportType] = useState<ImportType>("video");
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceType, setSourceType] = useState("YOUTUBE");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [error, setError] = useState("");
  
  // For playlists
  const [limitCount, setLimitCount] = useState(50);
  const [skipExisting, setSkipExisting] = useState(true);
  const [isAnalyzingPlaylist, setIsAnalyzingPlaylist] = useState(false);
  const [playlistInfo, setPlaylistInfo] = useState<{
    title: string;
    description: string;
    videoCount: number;
    thumbnailUrl?: string;
  } | null>(null);

  // Fetch collections
  const { data: collections, isLoading: isLoadingCollections } = useQuery<Collection[]>({
    queryKey: ["collections"],
    queryFn: async () => await getAllCollections()
  });

  // Add video mutation
  const addVideoMutation = useMutation({
    mutationFn: async (data: any) => addVideo(data),
    onSuccess: () => {
      toast.success(
        importType === "video" ? "Video added successfully!" : "Playlist import started",
        { 
          description: importType === "video" 
            ? "Your video has been added to your library." 
            : "You will be notified when the import is complete."
        }
      );
      router.push("/videos");
    },
    onError: (error) => {
      setError(error.message || "Failed to add video. Please check the URL and try again.");
      toast.error(
        importType === "video" ? "Failed to add video" : "Failed to import playlist", 
        { description: error.message }
      );
    },
  });

  // Analyze playlist mutation
  const analyzePlaylistMutation = useMutation({
    mutationFn: async (url: string) => {
      setPlaylistInfo(null);
      setIsAnalyzingPlaylist(true);
      
      const response = await fetch(`/api/videos/analyze-playlist?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to analyze playlist");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setPlaylistInfo(data);
      setTitle(data.title || "");
      setDescription(data.description || "");
    },
    onError: (error) => {
      toast.error("Failed to analyze playlist", { description: error.message });
    },
    onSettled: () => {
      setIsAnalyzingPlaylist(false);
    }
  });

  // Handle URL change and analyze playlist if needed
  const handleUrlChange = (url: string) => {
    setVideoUrl(url);
    setError("");
    
    // Clear playlist info when URL changes
    if (importType === "playlist" && playlistInfo) {
      setPlaylistInfo(null);
    }
  };

  // Handle analyze playlist
  const handleAnalyzePlaylist = () => {
    if (!videoUrl) {
      setError("Please enter a playlist URL");
      return;
    }
    
    analyzePlaylistMutation.mutate(videoUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoUrl) {
      setError("URL is required");
      return;
    }
    
    if (selectedCollections.length === 0) {
      setError("Please select at least one collection");
      return;
    }
    
    const payload = {
      url: videoUrl,
      title: title || undefined, // Only send if not empty
      description: description || undefined, // Only send if not empty
      sourceType,
      collections: selectedCollections,
      ...(importType === "playlist" && {
        isPlaylist: true,
        limitCount: limitCount > 0 ? limitCount : undefined,
        skipExisting,
      }),
    };
    
    addVideoMutation.mutate(payload);
  };

  // Handle collection selection
  const toggleCollection = (collectionId: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };
  
  // Still loading auth state
  if (status === "loading" || isLoadingCollections) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container max-w-2xl py-10 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add Media</CardTitle>
          <CardDescription>
            Add videos or playlists from YouTube, Vimeo, and other supported platforms
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <Tabs
              defaultValue="video"
              value={importType}
              onValueChange={(value) => setImportType(value as ImportType)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <VideoIcon className="h-4 w-4" />
                  <span>Single Video</span>
                </TabsTrigger>
                <TabsTrigger value="playlist" className="flex items-center gap-2">
                  <ListVideo className="h-4 w-4" />
                  <span>Playlist</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="video" className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video-url">Video URL</Label>
                  <Input
                    id="video-url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="playlist" className="pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="playlist-url">Playlist URL</Label>
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAnalyzePlaylist}
                      disabled={isAnalyzingPlaylist || !videoUrl}
                    >
                      {isAnalyzingPlaylist ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze"
                      )}
                    </Button>
                  </div>
                  <Input
                    id="playlist-url"
                    placeholder="https://youtube.com/playlist?list=..."
                    value={videoUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                  />
                </div>

                {playlistInfo && (
                  <div className="border rounded-md p-4 space-y-3">
                    <div className="text-sm font-medium">Playlist Information</div>
                    <div className="text-sm">
                      <span className="font-medium">Title:</span> {playlistInfo.title}
                    </div>
                    {playlistInfo.description && (
                      <div className="text-sm">
                        <span className="font-medium">Description:</span>{" "}
                        <span className="text-muted-foreground">{playlistInfo.description.substring(0, 100)}
                          {playlistInfo.description.length > 100 ? "..." : ""}
                        </span>
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="font-medium">Videos:</span> {playlistInfo.videoCount}
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="limit-count">Limit number of videos</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Limit the number of videos to import from the playlist. 
                              Set to 0 to import all videos.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="limit-count"
                      type="number"
                      className="w-24"
                      min={0}
                      max={1000}
                      value={limitCount}
                      onChange={(e) => setLimitCount(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="skip-existing"
                    checked={skipExisting}
                    onCheckedChange={() => setSkipExisting(!skipExisting)}
                  />
                  <Label htmlFor="skip-existing">Skip videos that already exist in your library</Label>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-2">
              <Label htmlFor="title">{importType === "video" ? "Title" : "Custom Playlist Title"} (Optional)</Label>
              <Input
                id="title"
                placeholder={importType === "video" ? "Custom title (leave blank to use original)" : "Custom playlist title"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">{importType === "video" ? "Description" : "Custom Playlist Description"} (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Custom description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source Type</Label>
                <Select 
                  value={sourceType} 
                  onValueChange={setSourceType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YOUTUBE">YouTube</SelectItem>
                    <SelectItem value="VIMEO">Vimeo</SelectItem>
                    <SelectItem value="DAILYMOTION">Dailymotion</SelectItem>
                    <SelectItem value="CUSTOM">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Add to Collections</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                {collections && collections.length > 0 ? (
                  collections.map((collection) => (
                    <div key={collection.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`collection-${collection.id}`}
                        checked={selectedCollections.includes(collection.id)}
                        onCheckedChange={() => toggleCollection(collection.id)}
                      />
                      <Label 
                        htmlFor={`collection-${collection.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {collection.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-4 text-muted-foreground">
                    No collections found
                  </div>
                )}
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => router.push("/collections/create")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Collection
              </Button>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={addVideoMutation.isPending}
            >
              {addVideoMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {importType === "video" ? "Adding Video..." : "Importing Playlist..."}
                </>
              ) : (
                importType === "video" ? "Add Video" : "Import Playlist"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}