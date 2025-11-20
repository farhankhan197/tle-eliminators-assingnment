import { CodeforcesContest } from "./types";

type CodeforcesContestResponce = {
  id: number;
  name: string;
  type: string;
  phase: string;
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds: number;
  relativeTimeSeconds: number;
};

export async function getCodeforcesContests(): Promise<CodeforcesContest[]> {
  const res = await fetch("https://codeforces.com/api/contest.list", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      Accept: "application/json",
    },
  });

  const { result }: { result: CodeforcesContestResponce[] } = await res.json();

  const contests = result
    .filter((c) => c.phase === "BEFORE")
    .map((c) => ({
      name: c.name,
      url: `https://codeforces.com/contest/${c.id}`,
      platform: "codeforces",
      startTime: c.startTimeSeconds * 1000,
      duration: c.durationSeconds,
    }));

  console.log(contests);

  return contests;
}

getCodeforcesContests();
