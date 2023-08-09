import { NextResponse } from "next/server";
import { listUrls } from "@utils/awsUtils";
export async function GET(req) {
  try {
    const urls = await listUrls();
    return NextResponse.json({ urls: urls });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
