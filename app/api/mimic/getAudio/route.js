import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function POST(req) {
  const { audio_url } = await req.json();

  try {
    const params = {
      Bucket: "dialoga-machine-learning",
      Key: `mimic/audios/${path.basename(audio_url)}`,
    };

    const downloadStream = s3.getObject(params).createReadStream();

    return new NextResponse(downloadStream, {
      headers: {
        "Content-Type": "audio/wav",
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
