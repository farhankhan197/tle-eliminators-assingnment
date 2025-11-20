
export type CodeforcesContest = {
  name: string;
  url: string;
  platform: string;
  startTime: number;
  duration: number;
};

 export type LeetcodeContest = {
  platform: string;
  name: string;
  url: string;
  startTime: string;
  durationMinutes: number;
};

export type Platform = "codeforces" | "atcoder" | "leetcode";

// export type NormalizedContest = {
//   platform: "leetcode" | "codeforces" | "atcoder";
//   name: string;
//   url: string;
//   startTime
// };
