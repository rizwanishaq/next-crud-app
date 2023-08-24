import { NextResponse } from "next/server";

import { getVideoURL } from "@utils/sadTalkerServices";

export async function POST(req) {
  const { audio_url, image } = await req.json();
  try {
    const { video_url } = await getVideoURL({ audio_url, image });

    return NextResponse.json({ video_url: video_url });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
