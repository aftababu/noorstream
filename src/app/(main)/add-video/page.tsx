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
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AddVideoPage() {
  const {  session, status } = useAuth();
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceType, setSourceType] = useState("YOUTUBE");
  const [collection, setCollection] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
    return null;
  }
  
  // Still loading auth state
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoUrl) {
      setError("Video URL is required");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // This would be an actual API call in a real implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      router.push("/");
      // Would show a success toast in a real app
    } catch {
      setError("Failed to add video. Please check the URL and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add New Video</CardTitle>
          <CardDescription>
            Add videos from YouTube, Vimeo, and other supported platforms
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Video URL</Label>
              <Input
                id="url"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                placeholder="Custom title (leave blank to use original)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Custom description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="collection">Add to Collection</Label>
                <Select 
                  value={collection} 
                  onValueChange={setCollection}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Collection</SelectItem>
                    <SelectItem value="favorites">Favorites</SelectItem>
                    <SelectItem value="new">
                      <div className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Collection
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Video...
                </>
              ) : (
                "Add Video"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}