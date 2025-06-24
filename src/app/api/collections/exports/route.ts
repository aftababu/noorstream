import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { array, z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateTokenWithNumber } from "@/lib/utils";

const validateBody =z.object({
    collections:array(z.string()).min(1,"Please Select At Least One Collection"),
    password:z.string().min(4,"At Least 4 Character Required").optional()
})

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body=await req.json();

    const validatedData= validateBody.parse(body);
    const password=validatedData.password||null;
    const token= generateTokenWithNumber(32);
    const collectionsIds= validatedData.collections;


    const collectionsValidations= await prisma.collection.findMany({
        where:{
            id:{in: collectionsIds},
            userId:session.user.id
        },
        select:{id:true,isPublic:true}
    })
    if(collectionsIds.length!= collectionsValidations.length){
        const missingIds=collectionsIds.filter((id)=>!collectionsValidations.some((oid)=>oid.id===id));
        return NextResponse.json({
            error:"Some Collection Donot belong to user"+missingIds.join(" ,")
        },{status:403})
    }

    if(!collectionsValidations.every((collec)=>collec.isPublic)){
        return NextResponse.json({
            error:"User can only Export Public Collections"
        },{
            status:403
        })
    }
    const exportsLinks= await prisma.exportLink.create({
        data:{
            userId:session.user.id,
            token,
            password,         
        }
    })

      const connectOperations = collectionsIds.map((collId) => ({
      collectionId: collId,
      exportLinksId: exportsLinks.id,
    }));

    await prisma.exportLinkToCollections.createMany({
      data: connectOperations,
    });
    return NextResponse.json({
        data:exportsLinks
    },{
        status:201
    })

  } catch (error) {
    console.error("Error in GET /api/collection/exports:", error);
    return NextResponse.json(
      { error: "Failed to Export Link" },
      { status: 500 }
    );
  }
};
