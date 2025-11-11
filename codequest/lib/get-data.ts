import { getAtCoderContests } from "./atcoder";
import { getCodeforcesContests } from "./codeforces";
import { getLeetCodeContests } from "./leetcode";

async function getData() {
  const leetcodeContests = await getLeetCodeContests();
  console.log(leetcodeContests)
  
//   const codeforcesContests = await getCodeforcesContests();
//   const atcoderContests = await getAtCoderContests();
}

getData();
