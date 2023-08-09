import { NextResponse } from "next/server";

import { SynthesizeSpeech } from "@utils/ttsServices";

export async function POST(req) {
  try {
    const { language, voice, text } = await req.json();

    const audio_url = await SynthesizeSpeech({
      data: { language, voice, text },
    });

    return NextResponse.json({ audio_url: audio_url });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
