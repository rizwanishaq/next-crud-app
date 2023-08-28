import { sendMessage } from "@utils/chatServices";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text } = await req.json();

    const response = await sendMessage({ text });

    return NextResponse.json(response.output_sentence);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
