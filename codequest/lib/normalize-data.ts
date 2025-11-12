export function NormalizeData(platform, data) {
    const d = []
  if (platform == "leetcode") {
    const leetcode = data.map((c) => {
      const start = c.startTime ? new Date(c.startTime) : new Date(NaN);
      const end = c.durationMinutes
        ? new Date(start.getTime() + c.durationMinutes * 60 * 1000)
        : new Date(NaN);

      console.log("------------------------------------------");
      console.log("LEETCODE" + end);

      return {
        platform: "leetcode",
        name: c.name,
        url: c.url,
        startTime: start,
        endTime: end,
      };
    });

    d.push(leetcode)
    console.log(d);
    
  }

  if (platform == "atcoder") {
     d.push(data.map((c) => {
      const start = c.startTime ? new Date(c.startTime) : new Date(NaN);
      const end = c.duration
        ? new Date(start.getTime() + c.duration * 1000)
        : new Date(NaN);

      console.log("------------------------------------------");
      console.log("ATCODER" + end);

      return {
        platform: "atcoder",
        name: c.title ?? c.name,
        url: `https://atcoder.jp/contests/${c.id}`,
        startTime: start,
        endTime: end,
      };
    }))
  }
  if (platform == "codeforces") {
    d.push(data.map((c) => {
      const start = c.startTime ? new Date(c.startTime) : new Date(NaN);
      const end = c.duration
        ? new Date(start.getTime() + c.duration)
        : new Date(NaN);

      return {
        platform: "Codeforces",
        name: c.name,
        url: `https://codeforces.com/contest/${c.id}`,
        startTime: start,
        endTime: end,
      };
    }))
  }
  return d[0]
}
