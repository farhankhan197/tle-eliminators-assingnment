import { getCodeforcesContests } from "@/lib/codeforces";
import { NormalizeData } from "@/lib/normalize-data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const data = await getCodeforcesContests();
    const contests = NormalizeData("codeforces", data);
    return NextResponse.json(contests);
  } catch (error) {
    return NextResponse.error();
  }
}
