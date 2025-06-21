import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import {prisma} from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Validation schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function PATCH(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Parse and validate request body
    const body = await req.json();
    const validationResult = profileSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { name } = validationResult.data;
    
    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[PROFILE_UPDATE]", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}