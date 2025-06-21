// hooks/useAuth.ts
"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import type { Session } from "next-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";


export function useAuth({ required = false, redirectTo = "/login" } = {}) {
  const { data: nextAuthSession, status: nextAuthStatus, update: updateNextAuthSession } = useSession();

  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const {
    data: cachedSession,
    isLoading: isQueryLoading,
    isError: isQueryError,
    error: queryError,
  } = useQuery<Session | null>({
    queryKey: ["session"],


    queryFn: async () => nextAuthSession,
        staleTime: 1000 * 60 * 5, 
    refetchInterval: 1000 * 60 * 10,
    refetchOnWindowFocus: false, 

    enabled: nextAuthStatus !== "loading",

  });


  useEffect(() => {
    const currentRQCachedSession = queryClient.getQueryData<Session | null>(["session"]);

    if (nextAuthSession !== currentRQCachedSession) {
      queryClient.setQueryData(["session"], nextAuthSession);
    
      if (nextAuthStatus === 'unauthenticated' && currentRQCachedSession) {

        queryClient.invalidateQueries();
      }
    }
  }, [nextAuthSession, nextAuthStatus, queryClient]);

  useEffect(() => {
    if (required && nextAuthStatus === "unauthenticated") {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [required, nextAuthStatus, router, pathname, redirectTo]);


  const authState = useMemo(() => {
    return {
      session: cachedSession, 
      status: nextAuthStatus, 
      isLoading: nextAuthStatus === "loading",
      isAuthenticated: nextAuthStatus === "authenticated",
      updateSession: updateNextAuthSession,
    };
  }, [cachedSession, nextAuthStatus, updateNextAuthSession]);

  return authState;
}