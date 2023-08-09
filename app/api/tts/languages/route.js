import { NextResponse } from "next/server";
import { listLanguages } from "@utils/ttsServices";

export async function GET() {
  try {
    const { languages } = await listLanguages();
    return NextResponse.json({ languages: languages });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
