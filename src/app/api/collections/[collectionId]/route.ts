import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const GET = async (req:NextRequest,{ params }: { params: { collectionId: string } }) => {
  try {
    const session = await getServerSession(authOptions);
    console.log(params)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { collectionId } =  await params;
    if (!collectionId) {
      return NextResponse.json(
        {
          error: "No Collection Id Found",
        },
        { status: 404 }
      );
    }
    const res = await prisma.collection.findUnique({
      where: {
        userId: session.user.id,
        id: collectionId,
      },
    });
    if (!res) {
      return NextResponse.json(
        {
          error: "No Collection Found With this Id",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: res }, { status: 200 });
  } catch (error) {
    console.log("Collection get error: ",error);

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
export const PUT = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { collectionId } = await params;
    if (!collectionId) {
      return NextResponse.json(
        {
          error: "No Collection Id Found",
        },
        { status: 404 }
      );
    }
    const body= await req.json();
    const res= await prisma.collection.update({
        data:{
            ...body
        },
        where:{
            id:collectionId,
            userId:session.user.id
        }
    })
    if(!res){
        return NextResponse.json({
            error:"No Collection Found With This ID"
        },{
            status:400
        })
    }
    return NextResponse.json({
        data:res
    },{
        status:200
    })
  } catch (error) {
    console.log("Collection Update error: ",error);

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
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { collectionId } = await params;
    if (!collectionId) {
      return NextResponse.json(
        {
          error: "No Collection Id Found",
        },
        { status: 404 }
      );
    }
    const res= await prisma.collection.delete({
        where:{
            id:collectionId,
            userId:session.user.id
        }
    })
    if(!res){
        return NextResponse.json({
            error:"Collection with This id not found or user restriction"
        },{
            status:400
        })
    }
    return NextResponse.json({
       message:"Collection Deleted SuccessFully"
    },{
        status:200
    })
  } catch (error) {
    console.log("Collection Delete error: ",error);
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
