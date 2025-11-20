import axios from "axios";
import { LeetcodeContest } from "./types";

type LeetcodeContestResponce = {
  title: string;
  titleSlug: string;
  startTime: number;
  duration: number;
};

export async function getLeetCodeContests(): Promise<LeetcodeContest[]> {
  const query = `
    query {
      upcomingContests {
        title
        titleSlug
        startTime
        duration
      }
    }
  `;

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql/",
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://leetcode.com",
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    const contests: LeetcodeContestResponce[] =
      response.data?.data?.upcomingContests || [];

    const returnValue = contests.map((c) => ({
      platform: "leetcode",
      name: c.title,
      url: `https://leetcode.com/contest/${c.titleSlug}`,
      startTime: new Date(c.startTime * 1000).toISOString(),
      durationMinutes: Math.floor(c.duration / 60),
    }));

    return returnValue;
  } catch (err) {
    console.error("❌ LeetCode API Error:", err);
    return [];
  }
}
