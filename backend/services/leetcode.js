import axios from "axios";

export async function getLeetCodeContests() {
  const query = `
    query {
      contestUpcomingContests {
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
          "Referer": "https://leetcode.com",
          "User-Agent": "Mozilla/5.0"
        },
      }
    );
    console.log("✅ LeetCode API response received");

    const contests = response.data.data.contestUpcomingContests || [];
    console.log("✅ Fetched LeetCode contests:", contests);
    return contests.map(c => ({
      platform: "LeetCode",
      name: c.title,
      url: `https://leetcode.com/contest/${c.titleSlug}`,
      start_time: new Date(c.startTime * 1000).toISOString(),
      end_time: new Date((c.startTime + c.duration) * 1000).toISOString(),
      duration: c.duration,
    }));
  } catch (err) {
    console.error("❌ LeetCode API Error:", err.message);
    return [];
  }
}
