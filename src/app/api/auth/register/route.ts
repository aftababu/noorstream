import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { z } from "zod";
import slugify from "slugify";

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { name, email, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
      },
    });

    if (existingUser) {
      // Check if user is OAuth user
      const oauthAccount = existingUser.accounts.find(
        account => account.provider !== "credentials"
      );
      
      if (oauthAccount) {
        return NextResponse.json(
          { error: `This email is already registered with ${oauthAccount.provider}. Please sign in with ${oauthAccount.provider}.` },
          { status: 400 }
        );
      }
      
      // Check if user has verified email
      if (!existingUser.emailVerified) {
        // User exists but email not verified
        // We can either resend verification or return error
        return NextResponse.json(
          { error: "This email is already registered but not verified. Please check your inbox for verification email." },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: "This email is already registered. Please sign in instead." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate verification token
    const verificationToken = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: expiresAt,
        userId: user.id,
      },
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationToken);

    console.log("Verification email sent:", emailSent);
    const defaultCollectionName = "No Collection";
    const defaultCollectionSlug = slugify(`${defaultCollectionName}-${user.id}`, { lower: true, strict: true,trim: true });

  const defaultcollection=  await prisma.collection.create({
      data: {
        name: defaultCollectionName,
        slug: defaultCollectionSlug,
        description: 'Default collection for videos not assigned to any specific list.',
        isPublic: true, 
        userId: user.id,
      },
    });
    console.log("Default collection created:", defaultcollection);
    return NextResponse.json(
      { success: "Registration successful. Please check your email to verify your account." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER]", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}