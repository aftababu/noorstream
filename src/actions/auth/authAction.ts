 "use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export const handleUpdate = async ({ name, image }: { name: string; image: string }) => {
  try {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Not authenticated");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, image },
  });
  return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to update profile" };
  }
  
};