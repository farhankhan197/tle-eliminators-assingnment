import { getAtCoderContests } from "@/lib/atcoder";
import { NormalizeData } from "@/lib/normalize-data";
// import { get } from "http";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const data = await getAtCoderContests();
    const contests = NormalizeData("atcoder", data);

    return NextResponse.json(contests);
  } catch (error) {
    return NextResponse.json(error);
  }
}
