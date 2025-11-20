import { getAtCoderContests } from "@/lib/atcoder";
import { getCodeforcesContests } from "@/lib/codeforces";
import { getLeetCodeContests } from "@/lib/leetcode";
import { NormalizeData } from "@/lib/normalize-data";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    console.log(params);
    const constests = [];
    const platform = params.get("platform");

    if (platform == "leetcode") {
      const data = await prisma.contest.findMany({
        where: {
          platform: "leetcode",
        },
      });
      constests.push(...data);
    }
    if (platform == "atcoder") {
      const data = await prisma.contest.findMany({
        where: {
          platform: "atcoder",
        },
      });
      constests.push(...data);
    }
    if (platform == "codeforces") {
      const data = await prisma.contest.findMany({
        where: {
          platform: "Codeforces",
        },
      });
      constests.push(...data);
    }
    if (platform == "all") {
      const leetcodeContests = await prisma.contest.findMany({
        where: {
          platform: "leetcode",
        },
      });
      const atCoderContests = await prisma.contest.findMany({
        where: {
          platform: "atcoder",
        },
      });
      const codeforcesContests = await prisma.contest.findMany({
        where: {
          platform: "Codeforces",
        },
      });
      const normalizedContests = [
        ...leetcodeContests,
        ...atCoderContests,
        ...codeforcesContests,
      ];
      constests.push(...normalizedContests);
    }

    return NextResponse.json(constests);
  } catch (error) {
    return NextResponse.json(error);
  }
}
