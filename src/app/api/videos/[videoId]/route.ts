import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export const GET = async (
  req: NextRequest,
  { params }: { params: { videoId: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }
    const { videoId } = await params;

    if(!videoId){
        return NextResponse.json(
          {
            error: "Video ID is required",
          },
          { status: 400 }
        );
    }
    const video = await prisma.video.findUnique({
      where: { id: videoId },
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
    if(!video) {
      return NextResponse.json(
        {
          error: "Video not found",
        },
        { status: 404 }
      );
    }
    if (video.addedById !== session.user.id) {
      return NextResponse.json(
        {
          error: "You do not have permission to view this video",
        },
        { status: 403 }
      );
    }
    return NextResponse.json({ data: video }, { status: 200 });


  } catch (error) {
    console.error("Error in GET /api/videos/[videoId]:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch video details",
      },
      { status: 500 }
    );
  }
};

export const PUT =async(req:NextRequest,{params}:{params:{videoId:string}})=>{
    try{

        const session= await getServerSession(authOptions);
        if(!session?.user){
            return NextResponse.json({
                error:"Unauthorized"
            },{status:401})
        }   

        const { videoId } = await params;
        if(!videoId){
            return NextResponse.json({
                error: "Video ID is required"
            }, { status: 400 });
        }
        const body = await req.json(); 

        const res= await prisma.video.update({
            where:{
                id: videoId,
                addedById: session.user.id 
            },
            data:{
                ...body,
                updatedAt: new Date()
            }
        });
        if(!res){
            return NextResponse.json({
                error: "Video not found or you do not have permission to update this video"
            }, { status: 404 });
        }
        return NextResponse.json({ data: res }, { status: 200 });

    }catch(error){
        console.log(`Error in PUT /api/videos/[videoId]:`, error);
        return NextResponse.json({
            error: "Failed to update video"
        },{status:500})
    }
}


export const DELETE = async (req:NextRequest,{params}:{params:{videoId:string}}) => {
    try{
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 });
        }
        const { videoId } = await params;
        if(!videoId){
            return NextResponse.json({
                error: "Video ID is required"
            }, { status: 400 });
        }
        const res=await prisma.video.delete({
            where:{
                id:videoId,
                addedById: session.user.id 
            }

        })
        if(!res){
            return NextResponse.json({
                error: "Video not found or you do not have permission to delete this video"
            }, { status: 404 });
        }


        return NextResponse.json({ message: "Video deleted successfully" }, { status: 200 });

    }catch(error){
        console.log(`Error in DELETE /api/videos/[videoId]:`, error);
        return NextResponse.json({
            error: "Failed to delete video"
        },{status:500})
    }
}