import Prompt from "@models/Prompt";
import { connectToDB } from "@utils/database";

export const GET = async (req) => {
  try {
    await connectToDB();
    const prompts = await Prompt.find({});

    return new Response(JSON.stringify(prompts), { status: 201 });
  } catch (error) {
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
