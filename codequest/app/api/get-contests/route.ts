import { getAtCoderContests } from "@/lib/atcoder";
import { getCodeforcesContests } from "@/lib/codeforces";
import { getLeetCodeContests } from "@/lib/leetcode";
import { NormalizeData } from "@/lib/normalize-data";
import { db } from "@/db/db";
// import { contests } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    console.log(params);
    const constests = [];
    const platform = params.get("platform");

    if (platform == "leetcode") {
      const data = await db.query.contests.findMany(
        {
          with: {
            platform: "leetcode"
          }
        }
      )
      console.log(data);
      constests.push(...data);
    }
    if (platform == "atcoder") {
      const data = await db.query.contests.findMany(
        {
          with: {
            platform: "atcoder"
          }
        }
      )
      constests.push(...data);
    }
    if (platform == "codeforces") {
      const data = await db.query.contests.findMany(
        {
          with: {
            platform: "codeforces"
          }
        }
      )
      constests.push(...data);
    }
    if (platform == "all") {
      const leetcodeContests = await db.query.contests.findMany({
        with: {
          platform: "leetcode",
        },
      });
      const atCoderContests = await db.query.contests.findMany({
        with: {
          platform: "atcoder",
        },
      });
      const codeforcesContests = await db.query.contests.findMany({
        with: {
          platform: "codeforces",
        },
      });
      const normalizedContests = [
        ...leetcodeContests,
        ...atCoderContests,
        ...codeforcesContests,
      ];
      normalizedContests.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      constests.push(...normalizedContests);
    }

    return NextResponse.json(constests);
  } catch (error) {
    return NextResponse.json(error);
  }
}
