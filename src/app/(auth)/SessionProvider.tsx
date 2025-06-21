
import { SessionProvider } from "next-auth/react";
import React from "react";
import { auth } from "../api/auth/[...nextauth]/route";

const SessionToken = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session= await auth();
  console.log("Session Token:", session);
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessionToken;