export function NormalizeData(platform: string, data: any) {
  const d = [];
  if (platform == "leetcode") {
    const leetcode = data.map((c: any) => {
      const start = c.startTime
          ? new Date(c.startTime).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date(NaN);
        const end = c.duration
          ? new Date(new Date(start).getTime() + c.duration * 1000)
          : new Date(NaN);

      console.log("------------------------------------------");
      console.log("LEETCODE" + start);

      return {
        platform: "leetcode",
        name: c.name,
        url: c.url,
        startTime: start,
        endTime: end,
      };
    });

    d.push(leetcode);
    console.log(d);
  }

  if (platform == "atcoder") {
    d.push(
      data.map((c: any) => {
        const start = c.startTime
          ? new Date(c.startTime).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date(NaN);
        const end = c.duration
          ? new Date(new Date(start).getTime() + c.duration * 1000)
          : new Date(NaN);

        console.log("------------------------------------------");
        console.log("ATCODER" + start);

        return {
          platform: "atcoder",
          name: c.title ?? c.name,
          url: `https://atcoder.jp/contests/${c.id}`,
          startTime: start,
          endTime: end,
        };
      })
    );
  }
  if (platform == "codeforces") {
    d.push(
      data.map((c: any) => {
        const start = c.startTime
          ? new Date(c.startTime).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date(NaN);
        const end = c.duration
          ? new Date(new Date(start).getTime() + c.duration * 1000)
          : new Date(NaN);

        console.log("------------------------------------------");
        console.log("Codeforces" + start);

        return {
          platform: "Codeforces",
          name: c.name,
          url: `https://codeforces.com/contest/${c.id}`,
          startTime: start,
          endTime: end,
        };
      })
    );
  }
  return d[0];
}
