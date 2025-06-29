import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";

const videoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  url: z.string().url("Invalid URL format"),
  thumbnail: z.string().optional(),
  sourceType: z.enum(["YOUTUBE", "VIMEO", "OTHERS", "DAILYMOTION", "CUSTOM"]),
  sourceId: z.string().optional(),
  viewCount: z.number().int().nonnegative().default(0),
  duration: z.number().int().min(0).optional(),
  collections: z.array(z.string()).optional(),
});

// In your API route
export const GET = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    console.log("Search parameters:", searchParams.toString());
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const totalVideos = await prisma.video.count({
      where: {
        addedById: session.user.id,
      }
    });

    const videos = await prisma.video.findMany({
      skip,
      where: {
        addedById: session.user.id,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        collections: true,
        addedBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalVideos / limit);
    
    return NextResponse.json({ 
      data: videos,
      pagination: {
        total: totalVideos,
        page,
        pages: totalPages,
        limit
      } 
    }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch video details" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();

    const validateData = videoSchema.parse(body);

    let slug = slugify(validateData.title, {
      lower: true,
      strict: true,
      trim: true,
    });
    console.log("Generated slug:", slug);

    const existingVideo = await prisma.video.findUnique({
      where: { slug },
    });
    if (existingVideo) {
      slug = `${slug}${new Date().getTime()}${Math.random()
        .toString(36)
        .substring(2, 10)}`;
      console.log("Slug already exists, new slug:", slug);
    }
    const collections = validateData.collections || [];
    delete validateData.collections;
    const video = await prisma.video.create({
      data: {
        ...validateData,
        slug,
        addedById: session.user.id,
        collections: {
          connect: collections.map((collectionId) => ({ id: collectionId })),
        },
      },
      include: {
        collections: true,
      },
    });

    return NextResponse.json({ data: video }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch video details" },
      { status: 500 }
    );
  }
};
