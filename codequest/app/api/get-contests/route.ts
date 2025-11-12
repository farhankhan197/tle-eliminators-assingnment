import { getAtCoderContests } from "@/lib/atcoder";
import { getCodeforcesContests } from "@/lib/codeforces";
import { getLeetCodeContests } from "@/lib/leetcode";
import { NormalizeData } from "@/lib/normalize-data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    console.log(params);
    const constests = [];
    const platform = params.get("platform");

    if (platform == "leetcode") {
      const data = await getLeetCodeContests();
      const normalizedContests = NormalizeData("leetcode", data);
      constests.push(normalizedContests);
    }
    if (platform == "atcoder") {
      const data = await getAtCoderContests();
      const normalizedContests = NormalizeData("atcoder", data);
      constests.push(normalizedContests);
    }
    if (platform == "codeforces") {
      const data = await getAtCoderContests();
      const normalizedContests = NormalizeData("codeforces", data);
      constests.push(normalizedContests);
    }
    if (platform == "all") {
      const leetcodeContests = await getLeetCodeContests();
      const atCoderContests = await getAtCoderContests();
      const codeforcesContests = await getCodeforcesContests();
      const normalizedContests = [
        ...NormalizeData("leetcode", leetcodeContests),
        ...NormalizeData("atcoder", atCoderContests),
        ...NormalizeData("codeforces", codeforcesContests),
      ];
      constests.push(...normalizedContests);
    }

    return NextResponse.json(constests);
  } catch (error) {
    return NextResponse.json(error);
  }
}
