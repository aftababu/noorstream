"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Download, Upload, Check } from "lucide-react";

export default function ImportExport() {
  const [importKey, setImportKey] = useState("");
  const [exportKey, setExportKey] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleImport = async () => {
    if (!importKey.trim()) {
      setMessage({ type: "error", text: "Please enter an import key." });
      return;
    }

    try {
      // This would be an actual API call in a real implementation
      // For demo, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: "success", text: "Collection imported successfully!" });
      setImportKey("");
    } catch (error) {
      setMessage({ type: "error", text: "Failed to import collection. Please check your key and try again." });
    }
  };

  const handleExport = async () => {
    try {
      // This would be an actual API call in a real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate a response with a key
      setExportKey("coll_export_af12b3c4d5e6f7g8h9i0j");
      setMessage({ type: "success", text: "Collection exported! You can now share this key." });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to export collection. Please try again." });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Tabs defaultValue="import">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import Collection</TabsTrigger>
          <TabsTrigger value="export">Export Collection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import Collection</CardTitle>
              <CardDescription>
                Enter a collection key to import videos shared by another user.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter collection key"
                value={importKey}
                onChange={(e) => setImportKey(e.target.value)}
                className="mb-4"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleImport} className="w-full">
                <Upload className="mr-2 h-4 w-4" /> Import Collection
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export Collection</CardTitle>
              <CardDescription>
                Generate a key to share your collection with others.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {exportKey ? (
                <div className="relative">
                  <Textarea 
                    value={exportKey} 
                    readOnly 
                    className="pr-10 font-mono"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No export key generated yet.
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleExport} className="w-full" variant={exportKey ? "outline" : "default"}>
                {exportKey ? (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Download Export File
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Generate Export Key
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {message && (
        <Alert className={`mt-4 ${message.type === "error" ? "bg-destructive/15" : "bg-primary/15"}`}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}