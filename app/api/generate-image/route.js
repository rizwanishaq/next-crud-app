import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const response = await hf.textToImage({
      inputs: `${prompt}`,
      parameters: {
        negative_prompt: "blurry",
      },
      model: "stabilityai/stable-diffusion-2",
    });

    const arrayBuffer = await response.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json({ imageUrl: base64Data });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
