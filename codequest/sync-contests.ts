import { getAtCoderContests } from "./lib/atcoder";
import { getCodeforcesContests } from "./lib/codeforces";
import { getLeetCodeContests } from "./lib/leetcode";
import { NormalizeData, Contest } from "./lib/normalize-data";

import { db } from "./db/db";
import { contests } from "./db/schema";

async function SyncContestsToDB() {
  const leetcodeContests = await getLeetCodeContests();
  const atCoderContests = await getAtCoderContests();
  const codeforcesContests = await getCodeforcesContests();

  const normalizedContests: Contest[] = [
    ...NormalizeData("leetcode", leetcodeContests),
    ...NormalizeData("atcoder", atCoderContests),
    ...NormalizeData("codeforces", codeforcesContests),
  ];

  await Promise.all(
    normalizedContests.map((contest) =>
      db
        .insert(contests)
        .values({
          name: contest.name,
          platform: contest.platform,
          url: contest.url,
          startTime: contest.startTime,
          endTime: contest.endTime,

          // faithfully reproducing your logic
          duration: new Date(
            contest.endTime.getTime() - contest.startTime.getTime()
          ),
        })
        .onConflictDoUpdate({
          target: contests.name,
          set: {
            platform: contest.platform,
            url: contest.url,
            startTime: contest.startTime,
            endTime: contest.endTime,
            duration: new Date(
              contest.endTime.getTime() - contest.startTime.getTime()
            ),
          },
        })
    )
  );
}

SyncContestsToDB()
  .then(() => {
    console.log("Contests synced successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Contest sync failed:", err);
    process.exit(1);
  });
