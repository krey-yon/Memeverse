import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { uploadMeme } from "@/actions/meme";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export async function POST(request: NextRequest) {

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const caption = formData.get("caption") as string | null;

    if (!file) {
      return NextResponse.json("No file found");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "memeverse" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result as CloudinaryUploadResult);
            }
          }
        );
        uploadStream.end(buffer);
      }
    );
    //todo: save to db for sahil
    // const post = await prisma.post.create({
    //   data: {
    //     caption: caption,
    //     imageUrl: result.secure_url,
    //     authorId: 1,
    //   },
    // })

    // console.log(result);
    const newMeme =  await uploadMeme(result.secure_url, caption!);
    return NextResponse.json({ publicId: result.secure_url, newMeme }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return NextResponse.json(error.message, { status: 500 });
    }
    return NextResponse.json("error uploading image", { status: 500 });
  }
}