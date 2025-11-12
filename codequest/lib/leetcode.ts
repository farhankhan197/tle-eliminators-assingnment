import axios from "axios";

type Contest = {
  platform: string;
  name: string;
  url: string;
};

export async function getLeetCodeContests() {
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

    const contests = response.data?.data?.upcomingContests || [];


    const returnValue = contests.map((c: any) => ({
      platform: "LeetCode",
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
