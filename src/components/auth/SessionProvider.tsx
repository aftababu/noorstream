"use client";

import { ReactNode } from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

interface SessionProviderProps {
  children: ReactNode;
}

// Create a cached version of the session fetcher
export default function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider >
      {children}
    </NextAuthSessionProvider>
  );
}
// Create a hook that uses react-query for additional caching
// export function useSessionQuery() {
//   const query = useQuery({
//     queryKey: ["session"],
//     queryFn: getSession,
//     staleTime: 1000 * 60 * 5, // 5 minutes
//     refetchInterval: 1000 * 60 * 10, // 10 minutes
//     refetchOnWindowFocus: false, // Don't refetch on tab focus to reduce requests
//   });
  
//   return query;
// }