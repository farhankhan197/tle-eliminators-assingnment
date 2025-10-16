import axios from "axios";

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

  const queryPastContest =`
 query pastContests($pageNo:Int,$numPerPage:Int) {
pastContests(pageNo: $pageNo, numPerPage:$numPerPage){
pageNum
currentPage
totalNum
numPerPage
data { 
  title 
  titleSlug
  startTime 
  originStartTime 
  cardImg
  sponsors{
    name 
    lightLogo
    darkLogo
    }
  } 
}
}`;
console.log("Query Start")
  const responsePast = await axios.post(
    "https://leetcode.com/graphql/",
    {query: queryPastContest,
      variables: {pageNo:1, numPerPage: 10}
    },
    {
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent": "Mozilla/5.0",
      },
    }
  );
  console.log("Query Ends")
  console.log(responsePast.data);
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
    // console.log(response.data);

    const contests = response.data.data.upcomingContests || [];
    console.log("✅ Fetched LeetCode contests:", contests);
    return contests.map((c) => ({
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
  }}
