"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  // Normalize Codeforces (CF uses unix seconds)
function normalizeCodeforces(data: any[]) {
  return data.map(contest => ({
    platform: "Codeforces",
    name: contest.name,
    url: `https://codeforces.com/contest/${contest.id}`,
    startTime: contest.startTime ? new Date(contest.startTime) : null,
    endTime: contest.startTime && contest.duration
      ? new Date((contest.startTime/1000 + contest.duration))
      : null,
    duration: contest.durationSeconds ?? null,
  }));
}

// Normalize AtCoder (many APIs return unix seconds)
function normalizeAtCoder(data: any[]) {
  return data.map(contest => ({
    platform: "AtCoder",
    name: contest.title || contest.name,
    url: `https://atcoder.jp/contests/${contest.id}`,
    startTime: contest.startTime ? new Date(contest.startTime) : null,
    endTime: contest.endTime ? new Date((contest.startTime +contest.duration)*1000) : null,
    duration: contest.duration ?? null,
  }));
}


  // Normalize LeetCode (it uses snake_case keys)
  function normalizeLeetCode(data: any[]) {
    return data.map((contest) => ({
      platform: contest.platform || "LeetCode",
      name: contest.name,
      url: contest.url,
      startTime: contest.startTime ? new Date(contest.startTime) : null,
      endTime: contest.end_time ? new Date(contest.StartTime) : null,
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

        console.log("Raw contest data fetched:", {  
          codeforces: codeforcesRaw,    
          leetcode: leetcodeRaw,
          atcoder: atcoderRaw,
        });

       
        const codeforcesData = normalizeCodeforces(ensureArray(codeforcesRaw));
        const leetcodeData = normalizeLeetCode(ensureArray(leetcodeRaw));
        const atcoderData = normalizeAtCoder(ensureArray(atcoderRaw));

        console.log("Fetched contest data:", {
          codeforces: codeforcesData,
          leetcode: leetcodeData,
          atcoder: atcoderData,
        });

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
