import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";

const validateBody = z.object({
  name: z.string().min(1, "at least one character required"),
  description: z.string().optional(),
});

export const GET = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "UnAuthorised" }, { status: 401 });
    }
    const res = await prisma.collection.findMany({
      where: {
        userId: session.user.id,
      },
    });
    return NextResponse.json(
      {
        data: res,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Something Went Wrong",
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "UnAuthorised" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = validateBody.parse(body);

    const slug = slugify(validatedData.name, {
      trim: true,
      strict: true,
      lower: true,
    });
    const checkSlug = await prisma.collection.findUnique({
      where: {
        userId: session.user.id,
        slug: slug,
      },
    });
    if (checkSlug) {
      return NextResponse.json(
        {
          error: "Collection already exist",
        },
        {
          status: 400,
        }
      );
    }
    const res = await prisma.collection.create({
      data: {
        ...validatedData,
        slug,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        data: res,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Something Went Wrong",
      },
      {
        status: 500,
      }
    );
  }
};
