"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Edit,
  Eye, 
  Folder, 
  FolderOpen, 
  Globe, 
  Loader2, 
  Lock, 
  MoreHorizontal, 
  Plus, 
  Share2, 
  Trash2, 
  VideoIcon 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface Collection {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  videoCount: number;
  createdAt: string;
}

export function CollectionsTab() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    isPublic: true,
  });

  // Fetch collections
  const { data, isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      // This would normally be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Generate mock data
      const mockCollections: Collection[] = Array.from({ length: 8 }).map((_, i) => ({
        id: `col_${i}`,
        name: i === 0 ? "Favorites" : i === 1 ? "Educational" : i === 2 ? "Music" : `Collection ${i}`,
        description: i % 2 === 0 ? `A collection of ${i === 0 ? "favorite" : i === 1 ? "educational" : i === 2 ? "music" : "various"} videos` : null,
        isPublic: i % 3 !== 0,
        videoCount: Math.floor(Math.random() * 50),
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      }));
      
      return mockCollections;
    },
  });

  const handleCreateCollection = () => {
    // toast({
    //   title: "Collection created",
    //   description: `"${newCollection.name}" has been created successfully.`,
    // });
    toast.success(`"${newCollection.name}" has been created successfully.`);
    
    setIsCreateDialogOpen(false);
    setNewCollection({ name: "", description: "", isPublic: true });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Collections</h2>
          <p className="text-muted-foreground">
            Organize your videos into collections for easy access.
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
              <DialogDescription>
                Create a new collection to organize your videos.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({...newCollection, name: e.target.value})}
                  placeholder="Collection name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea 
                  id="description"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({...newCollection, description: e.target.value})}
                  placeholder="Add a description for your collection"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public">Public Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this collection visible to others
                  </p>
                </div>
                <Switch 
                  id="public" 
                  checked={newCollection.isPublic}
                  onCheckedChange={(checked) => setNewCollection({...newCollection, isPublic: checked})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCollection}
                disabled={!newCollection.name.trim()}
              >
                Create Collection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((collection) => (
            <Card key={collection.id} className="group">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 truncate pr-2">
                    {collection.isPublic ? (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="truncate">{collection.name}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 invisible group-hover:visible"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        <span>Share</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardTitle>
                <CardDescription className="truncate">
                  {collection.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <VideoIcon className="h-3.5 w-3.5" />
                    <span>{collection.videoCount} videos</span>
                  </div>
                  <Badge variant={collection.isPublic ? "default" : "outline"}>
                    {collection.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                  <span>Created {formatDate(collection.createdAt)}</span>
                  <Button variant="ghost" size="sm" className="h-7">
                    <FolderOpen className="h-3.5 w-3.5 mr-1" />
                    Open
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg p-6">
          <Folder className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-lg font-medium mb-1">No collections yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first collection to organize your videos
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </div>
      )}
    </div>
  );
}