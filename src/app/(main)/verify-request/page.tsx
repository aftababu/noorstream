import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription className="mt-2">
            We've sent you a verification link to your email address.
            Please check your inbox and click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-muted-foreground text-sm">
            <p>The verification link will expire in 24 hours.</p>
            <p className="mt-2">
              If you don't see the email in your inbox, please check your spam folder.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/login">Return to login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}