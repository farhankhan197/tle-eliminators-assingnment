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
      endTime: new Date(contest.startTime + contest.duration * 1000),
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
      endTime: new Date((new Date(contest.startTime)).getTime() + contest.duration * 1000),
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
      endTime: new Date(new Date(contest.startTime).getTime() + contest.durationMinutes * 60 * 1000),
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

        const codeforcesData = normalizeCodeforces(ensureArray(codeforcesRaw));
        const leetcodeData = normalizeLeetCode(ensureArray(leetcodeRaw));
        const atcoderData = normalizeAtCoder(ensureArray(atcoderRaw));

        const all = [...codeforcesData, ...leetcodeData, ...atcoderData];
        all.sort((a, b) => {
          const timeA = a.startTime ? a.startTime.getTime() : Infinity;
          const timeB = b.startTime ? b.startTime.getTime() : Infinity;
          return timeA - timeB;
        });

        setContests(all);
      } catch (error) {
        console.error("Error fetching contest data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    
  }, []);
  
  function toGoogleDate(date: Date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  }

  function getCalendarLink(contest:any) {
    const start = toGoogleDate(new Date(contest.startTime));
    const end = toGoogleDate(new Date(contest.endTime));

    return `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(contest.name)}` +
      `&dates=${start}/${end}` +
      `&location=${encodeURIComponent(contest.url)}`;
  }
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
            <a className="text-green-500 underline" href={getCalendarLink(contest)} target="_blank">
              Add to Google Calendar
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
