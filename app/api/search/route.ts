import { NextResponse } from "next/server";
import { HowLongToBeatService } from "howlongtobeat";

export async function GET(request: Request) {
  const hltb = new HowLongToBeatService();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  if (query) {
    const response = await hltb.search(query);

    return NextResponse.json({ response });
  }
}
