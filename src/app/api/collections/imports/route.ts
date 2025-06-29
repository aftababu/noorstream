import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const validateBody= z.object({
    token:z.string().min(10,"enter a valid token").max(33,"enter a valid token"),
    password:z.string().min(4,"At Least 4 Character Required").optional(),
})


export const GET = async(req:NextRequest)=>{
    try{
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const {searchParams}= new URL(req.url)
    const searchQuery= Object.fromEntries(searchParams.entries())
    const validateData= validateBody.parse(searchQuery);
    const password= validateData.password ||null;

    const res= await prisma.exportLink.findUnique({
        where:{
            token:validateData.token,
            password,
        },
        include:{
            collections:{
                include:{
                    collection:{
                        include:{
                            videos:true,
                            
                        }
                    }
                }
            }
        }
    })
    if(!res){
        return NextResponse.json({
            error:"Token or Password Invalid"
        },{
            status:400
        })
    }



    return NextResponse.json({
        data:res
    },{status:200})


    }catch(error){
    console.error("Error in GET /api/collections/imports:", error);
    return NextResponse.json(
      { error: "Failed to fetch import collections data details" },
      { status: 500 }
    );
  }
};
