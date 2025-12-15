import { AtCoderContest } from "./atcoder";
import { CodeforcesContest, LeetcodeContest, Platform } from "./types";

export type Contest = {
  platform: "codeforces" | "atcoder" | "leetcode";
  name: string;
  url: string;
  startTime: Date;
  endTime: Date;
};

export function NormalizeData(platform: Platform, data: any): Contest[] {
  const d: Contest[][] = [];
  if (platform == "leetcode") {
    const leetcode = data.map((c: LeetcodeContest) => {
      const start = c.startTime ? new Date(c.startTime) : new Date(NaN);
      const end = c.durationMinutes
        ? new Date(new Date(start).getTime() + Number(c.durationMinutes) * 1000)
        : new Date(NaN);
      return {
        platform: "leetcode",
        name: c.name,
        url: c.url,
        startTime: start,
        endTime: end,
      };
    });
    d.push(leetcode);
  }

  if (platform == "atcoder") {
    d.push(
      data.map((c: AtCoderContest) => {
        const start = c.startTime ? new Date(c.startTime) : new Date(NaN);
        const end = c.duration
          ? new Date(new Date(start).getTime() + Number(c.duration) * 1000)
          : new Date(NaN);

        return {
          platform: "atcoder",
          name: c.title,
          url: c.url,
          startTime: start,
          endTime: end,
        };
      })
    );
  }
  if (platform == "codeforces") {
    d.push(
      data.map((c: CodeforcesContest) => {
        const start = c.startTime ? new Date(c.startTime) : new Date(NaN);
        const end = c.duration
          ? new Date(new Date(start).getTime() + Number(c.duration) * 1000)
          : new Date(NaN);

        return {
          platform: "Codeforces",
          name: c.name,
          url: c.url,
          startTime: start,
          endTime: end,
        };
      })
    );
  }
  return d[0] || [];
}

// toLocaleDateString("en-US", {
//               day: "2-digit",
//               month: "2-digit",
//               year: "numeric",
//               hour: "2-digit",
//               minute: "2-digit",
//             })
