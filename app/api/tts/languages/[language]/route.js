import { NextResponse } from "next/server";
import { listVoices } from "@utils/ttsServices";

export async function GET(request, { params }) {
  const language = params.language;

  try {
    const { voices } = await listVoices(language);

    return NextResponse.json({ voices: voices });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
