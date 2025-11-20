import { getAtCoderContests } from "./lib/atcoder";
import { getCodeforcesContests } from "./lib/codeforces";
import { getLeetCodeContests } from "./lib/leetcode";
import { NormalizeData } from "./lib/normalize-data";
import prisma from "./lib/prisma";

async function SyncContestsToDB() {
  const leetcodeContests = await getLeetCodeContests();
  const atCoderContests = await getAtCoderContests();
  const codeforcesContests = await getCodeforcesContests();
  const normalizedContests = [
    ...NormalizeData("leetcode", leetcodeContests),
    ...NormalizeData("atcoder", atCoderContests),
    ...NormalizeData("codeforces", codeforcesContests),
  ];

  const res = await Promise.all(
    normalizedContests.map((contest) =>
      prisma.contest.upsert({
        where: {
          name: contest.name,
        },
        create: {
          name: contest.name,
          platform: contest.platform,
          url: contest.url,
          startTime: contest.startTime,
          endTime: contest.endTime,
        },
        update: {},
      })
    )
  );
}

SyncContestsToDB();
