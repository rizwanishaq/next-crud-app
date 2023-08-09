import { NextResponse } from "next/server";

import { generateAvatar } from "@utils/mimicServices";

export async function POST(req) {
  const { audio_url, avatar, hd } = await req.json();
  try {
    const { video_url } = await generateAvatar(audio_url, avatar, hd);

    return NextResponse.json({ video_url: video_url });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
