// hooks/useAuth.ts
"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useCallback } from "react";
import type { Session } from "next-auth"; // Import Session type from next-auth
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQuery and useQueryClient

export function useAuth({ required = false, redirectTo = "/login" } = {}) {
  // Use next-auth's useSession primarily for its status and its update function.
  // We'll let TanStack Query manage the actual session data.
  const { status: nextAuthStatus, update: nextAuthUpdateSession } = useSession();

  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // *** This is the "normal" React Query for fetching the session data ***
  const {
    data: session, // This will hold the session data fetched by React Query
    isLoading: isQueryLoading,
    isError: isQueryError,
    error: queryError,
    refetch: refetchSessionQuery, // Function to manually refetch this query
  } = useQuery<Session | null>({
    queryKey: ["session"],
    // The queryFn now explicitly fetches the session from the NextAuth API endpoint.
    // This ensures TanStack Query is the one hitting the network for session data.
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/session'); // Your NextAuth session API route
        if (!response.ok) {
          // If the server responds with an error, assume no valid session
          // You might throw an error or return null/undefined depending on error handling strategy
          return null;
        }
        const data: Session | {} = await response.json();
        // next-auth's /api/auth/session returns an empty object {} if unauthenticated.
        // Convert that to null for consistent session state.
        return (data as Session).user ? (data as Session) : null;
      } catch (networkError) {
        // Handle network errors (e.g., server down, no internet)
        console.error("Network error fetching session:", networkError);
        return null; // Return null if network error occurs
      }
    },
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes, after which it's stale
    refetchOnWindowFocus: true, 

    refetchOnMount: "always", 

    enabled: nextAuthStatus !== "loading",
  });


  useEffect(() => {
    if (required && nextAuthStatus === "unauthenticated") {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [required, nextAuthStatus, router, pathname, redirectTo]);


  const updateSession = useCallback(async (data?: any) => {
    try {

      await nextAuthUpdateSession(data);

      await queryClient.invalidateQueries({
        queryKey: ["session"],
        refetchType: "active",
      });
      
      await refetchSessionQuery();

    } catch (error) {
      console.error("Failed to update session:", error);
      throw error;
    }
  }, [nextAuthUpdateSession, refetchSessionQuery, queryClient]);


  const clearSessionCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: ['session'] });
  }, [queryClient]);

  const authState = useMemo(() => {
    return {
      session: session, 
      status: nextAuthStatus, 
      isLoading: nextAuthStatus === "loading" || isQueryLoading, 
      isAuthenticated: nextAuthStatus === "authenticated" && !!session?.user, 
      updateSession,     
      refetchSession: refetchSessionQuery, 
      clearSessionCache,
    };
  }, [session, nextAuthStatus, isQueryLoading, updateSession, refetchSessionQuery, clearSessionCache]);

  return authState;
}