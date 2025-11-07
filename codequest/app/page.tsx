"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Normalize LeetCode (it uses snake_case keys)
  function normalizeLeetCode(data: any[]) {
    return data.map((contest) => ({
      platform: contest.platform || "LeetCode",
      name: contest.name,
      url: contest.url,
      startTime: contest.start_time ? new Date(contest.start_time) : null,
      endTime: contest.end_time ? new Date(contest.end_time) : null,
      duration: contest.duration || null,
    }));
  }

  // Helper to ensure everything becomes an array
  function ensureArray(input: any) {
    if (!input) return [];
    return Array.isArray(input) ? input : input.data ?? [];
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [cfRes, lcRes, acRes] = await Promise.all([
          fetch("/api/codeforces"),
          fetch("/api/leetcode"),
          fetch("/api/atcoder"),
        ]);

        const codeforcesRaw = await cfRes.json();
        const leetcodeRaw = await lcRes.json();
        const atcoderRaw = await acRes.json();

        const codeforcesData = ensureArray(codeforcesRaw);
        const leetcodeData = normalizeLeetCode(ensureArray(leetcodeRaw));
        const atcoderData = ensureArray(atcoderRaw);

        console.log("Codeforces:", codeforcesData);
        console.log("LeetCode:", leetcodeData);
        console.log("AtCoder:", atcoderData);

        setContests([...codeforcesData, ...leetcodeData, ...atcoderData]);
      } catch (error) {
        console.error("Error fetching contest data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading contests...</div>;
  if (contests.length === 0) return <div className="text-center mt-10">No upcoming contests found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upcoming Contests</h1>
      <ul className="space-y-4">
        {contests.map((contest, index) => (
          <li key={index} className="border p-4 rounded">
            <h2 className="font-semibold">{contest.name}</h2>
            <p>Platform: {contest.platform}</p>
            <p>Start: {contest.startTime?.toLocaleString()}</p>
            <p>End: {contest.endTime?.toLocaleString()}</p>
            <a className="text-blue-500 underline" href={contest.url} target="_blank">
              View Contest
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
