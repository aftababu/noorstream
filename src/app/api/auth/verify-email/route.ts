import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=Invalid%20verification%20link", req.url));
    }

    // Find and validate token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      return NextResponse.redirect(new URL("/login?error=Invalid%20or%20expired%20verification%20link", req.url));
    }

    if (new Date() > verificationToken.expires) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      });
      return NextResponse.redirect(new URL("/login?error=Verification%20link%20expired", req.url));
    }

    // Update user and delete token
    await prisma.user.update({
      where: { id: verificationToken.user.id },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return NextResponse.redirect(new URL("/login?success=Email%20verified%20successfully", req.url));
  } catch (error) {
    console.error("[VERIFY-EMAIL]", error);
    return NextResponse.redirect(new URL("/login?error=Something%20went%20wrong", req.url));
  }
}