import { db } from "@/db/db";
import { contests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db
    .select()
    .from(contests)
    .where(eq(contests.platform, "leetcode"));

  return NextResponse.json(data);
}
