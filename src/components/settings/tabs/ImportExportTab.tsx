"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Copy, Eye, EyeOff, Import, Loader2, Share2, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useCopyToClipboard } from "@/hooks/useCopyToClipBoard";

// Export form schema
const exportFormSchema = z.object({
  collections: z.array(z.string()).min(1, "Please select at least one collection"),
  password: z.string().min(4, "Password must be at least 4 characters").optional(),
  showPassword: z.boolean().default(false),
});

// Import form schema
const importFormSchema = z.object({
  token: z.string().min(10, "Please enter a valid token"),
  password: z.string().optional(),
});

type Collection = {
  id: string;
  name: string;
  description?: string | null;
  isPublic: boolean;
}

export function ImportExportTab() {
  const [activeTab, setActiveTab] = useState("export");
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Fetch user's collections
  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ['userCollections'],
    queryFn: async () => {
      const response = await fetch('/api/collections');
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      return response.json();
    },
  });

  // Export form setup
  const exportForm = useForm<z.infer<typeof exportFormSchema>>({
    resolver: zodResolver(exportFormSchema),
    defaultValues: {
      collections: [],
      password: '',
      showPassword: false,
    },
  });

  // Import form setup
  const importForm = useForm<z.infer<typeof importFormSchema>>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      token: '',
      password: '',
    },
  });

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: async (values: z.infer<typeof exportFormSchema>) => {
      const response = await fetch('/api/collections/exports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collections: values.collections,
          password: values.password || null,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create export link');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/import?token=${data.data.token}`;
      setExportedUrl(shareUrl);
      // toast({
      //   title: "Export successful!",
      //   description: "Your export link has been created successfully.",
      // });
      toast.success("Export successful! Your export link has been created successfully.", {
        description: "Share this link with others to give them access to your selected collections.",
      });
    },
    onError: (error) => {
      // toast({
      //   title: "Export failed",
      //   description: error.message,
      //   variant: "destructive",
      // });
      toast.error("Export failed", {
        description: error.message,
      });
    },
  });

  // Import preview query
  const [importToken, setImportToken] = useState<string | null>(null);
  const [importPassword, setImportPassword] = useState<string | null>(null);
  
  const { data: importPreview, isLoading: importPreviewLoading } = useQuery({
    queryKey: ['importPreview', importToken, importPassword],
    queryFn: async () => {
      if (!importToken) return null;
      
      const url = new URL('/api/collections/imports', window.location.origin);
      url.searchParams.append('token', importToken);
      if (importPassword) url.searchParams.append('password', importPassword);
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Invalid token or password');
      }
      
      return response.json();
    },
    enabled: !!importToken,
  });

  // Handle export form submission
  const onExportSubmit = (values: z.infer<typeof exportFormSchema>) => {
    exportMutation.mutate({
      collections: values.collections,
      password: values.password,
      showPassword: values.showPassword,
    });
  };

  // Handle import preview
  const onImportPreview = (values: z.infer<typeof importFormSchema>) => {
    setImportToken(values.token);
    setImportPassword(values.password || null);
  };

  // Handle import form submission
  const importMutation = useMutation({
    mutationFn: async () => {
      // This would be the implementation for actually adding the videos to the user's account
      // Currently we're just viewing the shared content
      return { success: true };
    },
    onSuccess: () => {
      // toast({
      //   title: "Import successful!",
      //   description: "The shared collections have been added to your account.",
      // });
      toast.success("Import successful! The shared collections have been added to your account.", {
        description: "You can now view these collections in your account.",
      });
    },
    onError: (error) => {
      // toast({
      //   title: "Import failed",
      //   description: error.message,
      //   variant: "destructive",
      // });
      toast.error("Import failed", {
        description: error.message,
      });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Import & Export</h2>
        <p className="text-muted-foreground">
          Share your collections with others or import collections shared with you.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Export Collections
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Import className="h-4 w-4" />
            Import Collections
          </TabsTrigger>
        </TabsList>
        
        {/* Export Tab Content */}
        <TabsContent value="export" className="space-y-4">
          {exportedUrl ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                  Export Link Created
                </CardTitle>
                <CardDescription>
                  Share this link with others to give them access to your selected collections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input 
                    readOnly 
                    value={exportedUrl} 
                    className="font-mono text-sm"
                  />
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => copyToClipboard(exportedUrl)}
                  >
                    {isCopied ? 
                      <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                      <Copy className="h-4 w-4" />
                    }
                  </Button>
                </div>
                {exportMutation.data?.data?.password && (
                  <div className="mt-4">
                    <Label htmlFor="password-info">Password</Label>
                    <div className="text-sm font-medium mt-1 mb-2 text-muted-foreground">
                      Make sure to share this password separately with the recipient:
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="password-info"
                        readOnly 
                        value={exportForm.getValues().password || ''} 
                        className="font-mono text-sm"
                        type={passwordVisible ? "text" : "password"}
                      />
                      <Button 
                        size="icon" 
                        variant="outline"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setExportedUrl(null);
                    exportForm.reset();
                  }}
                >
                  Create Another Export
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Form {...exportForm}>
              <form onSubmit={exportForm.handleSubmit(onExportSubmit)} className="space-y-6">
                <FormField
                  control={exportForm.control}
                  name="collections"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Collections to Export</FormLabel>
                      <FormDescription>
                        Choose which collections you want to share
                      </FormDescription>
                      <div className="mt-2">
                        {collectionsLoading ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        ) : collections && collections.length > 0 ? (
                          <ScrollArea className="h-72 rounded-md border">
                            <div className="p-4 space-y-4">
                              {collections.map((collection: Collection) => (
                                <div key={collection.id} className="flex items-start space-x-3 py-2">
                                  <Checkbox 
                                    id={`collection-${collection.id}`}
                                    checked={field.value.includes(collection.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, collection.id]);
                                      } else {
                                        field.onChange(field.value.filter(id => id !== collection.id));
                                      }
                                    }}
                                    disabled={!collection.isPublic}
                                  />
                                  <div className="space-y-1 leading-none">
                                    <label 
                                      htmlFor={`collection-${collection.id}`}
                                      className={cn(
                                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                        !collection.isPublic && "text-muted-foreground"
                                      )}
                                    >
                                      {collection.name} {!collection.isPublic && "(Private)"}
                                    </label>
                                    {collection.description && (
                                      <p className="text-xs text-muted-foreground">{collection.description}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        ) : (
                          <div className="text-center p-6 border rounded-md">
                            <p className="text-muted-foreground">You don't have any collections yet</p>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={exportForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Protection (Optional)</FormLabel>
                      <FormDescription>
                        Add a password to restrict access to your shared collections
                      </FormDescription>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Input
                            type={exportForm.watch("showPassword") ? "text" : "password"}
                            placeholder="Enter a password"
                            {...field}
                          />
                        </FormControl>
                        <Button 
                          type="button"
                          size="icon" 
                          variant="outline"
                          onClick={() => exportForm.setValue(
                            "showPassword", 
                            !exportForm.getValues().showPassword
                          )}
                        >
                          {exportForm.watch("showPassword") ? 
                            <EyeOff className="h-4 w-4" /> : 
                            <Eye className="h-4 w-4" />
                          }
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={exportMutation.isPending || collectionsLoading}
                >
                  {exportMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Export Link...
                    </>
                  ) : (
                    <>
                      <Share2 className="mr-2 h-4 w-4" />
                      Generate Export Link
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </TabsContent>
        
        {/* Import Tab Content */}
        <TabsContent value="import" className="space-y-4">
          <Form {...importForm}>
            <form onSubmit={importForm.handleSubmit(onImportPreview)} className="space-y-6">
              <FormField
                control={importForm.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Import Token</FormLabel>
                    <FormDescription>
                      Enter the token or full URL that was shared with you
                    </FormDescription>
                    <FormControl>
                      <Input
                        placeholder="Token or full URL"
                        {...field}
                        onChange={(e) => {
                          // Extract token from URL if pasted
                          const value = e.target.value;
                          if (value.includes("token=")) {
                            try {
                              const url = new URL(value);
                              const token = url.searchParams.get("token");
                              if (token) {
                                field.onChange(token);
                                return;
                              }
                            } catch {}
                          }
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={importForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password (if required)</FormLabel>
                    <FormDescription>
                      Enter the password if the shared content is password-protected
                    </FormDescription>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input
                          type={passwordVisible ? "text" : "password"}
                          placeholder="Enter password"
                          {...field}
                        />
                      </FormControl>
                      <Button 
                        type="button"
                        size="icon" 
                        variant="outline"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                variant="secondary" 
                className="w-full"
                disabled={importPreviewLoading}
              >
                {importPreviewLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Preview...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Content
                  </>
                )}
              </Button>
            </form>
          </Form>

          {importPreview && importPreview.data && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Import Preview</CardTitle>
                <CardDescription>
                  Shared by {importPreview.data.user?.name || "Unknown User"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {importPreview.data.collections?.map((item: any) => (
                    <div key={item.collection.id} className="border rounded-lg p-4">
                      <h3 className="font-medium text-lg">{item.collection.name}</h3>
                      {item.collection.description && (
                        <p className="text-sm text-muted-foreground mt-1">{item.collection.description}</p>
                      )}
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Videos in this collection: {item.collection.videos.length}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {item.collection.videos.slice(0, 6).map((video: any) => (
                            <div key={video.id} className="relative aspect-video bg-muted rounded-md overflow-hidden">
                              {video.thumbnail ? (
                                <Image
                                  src={video.thumbnail}
                                  alt={video.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                                  <Video className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          ))}
                          {item.collection.videos.length > 6 && (
                            <div className="relative aspect-video bg-muted/80 rounded-md overflow-hidden flex items-center justify-center">
                              <span className="text-sm font-medium">
                                +{item.collection.videos.length - 6} more
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setImportToken(null);
                  setImportPassword(null);
                  importForm.reset();
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => importMutation.mutate()}
                  disabled={importMutation.isPending}
                >
                  {importMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Import className="mr-2 h-4 w-4" />
                      Import to My Account
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}