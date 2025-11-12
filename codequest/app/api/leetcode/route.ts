import { getLeetCodeContests } from "@/lib/leetcode";
import { NormalizeData } from "@/lib/normalize-data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const data = await getLeetCodeContests();
    const contests = NormalizeData("leetcode", data);

    return NextResponse.json(contests);
  } catch (error) {
    return NextResponse.error();
  }
}
