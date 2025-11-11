"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Contest = {
  platform: "Codeforces" | "atcoder" | "leetcode";
  name: string;
  url: string;
  startTime: Date;
  endTime: Date;
};

export default function Page() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<string>("All");

  // Normalize Codeforces
  function normalizeCodeforces(data: any[]): Contest[] {
    return data.map((c) => {
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
    });
  }

  // Normalize AtCoder
  function normalizeAtCoder(data: any[]): Contest[] {
    return data.map((c) => {
      const start = c.startTime ? new Date(c.startTime) : new Date(NaN);
      const end = c.duration
        ? new Date(start.getTime() + c.duration * 1000)
        : new Date(NaN);

      return {
        platform: "atcoder",
        name: c.title ?? c.name,
        url: `https://atcoder.jp/contests/${c.id}`,
        startTime: start,
        endTime: end,
      };
    });
  }

  // Normalize LeetCode
  function normalizeLeetCode(data: any[]): Contest[] {
    return data.map((c) => {
      const start = c.startTime ? new Date(c.startTime) : new Date(NaN);
      const end = c.durationMinutes
        ? new Date(start.getTime() + c.durationMinutes * 60 * 1000)
        : new Date(NaN);

      return {
        platform: "leetcode",
        name: c.name,
        url: c.url,
        startTime: start,
        endTime: end,
      };
    });
  }

  function ensureArray(input: any): any[] {
    return Array.isArray(input) ? input : input?.data ?? [];
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [cfRes, lcRes, acRes] = await Promise.all([
          fetch("/api/codeforces"),
          fetch("/api/leetcode"),
          fetch("/api/atcoder"),
        ]);

        const codeforcesData = normalizeCodeforces(ensureArray(await cfRes.json()));
        const leetcodeData = normalizeLeetCode(ensureArray(await lcRes.json()));
        const atcoderData = normalizeAtCoder(ensureArray(await acRes.json()));

        console.log("codeforces data normalised : ",codeforcesData)

        const all = [...codeforcesData, ...leetcodeData, ...atcoderData]
          .filter((c) => !isNaN(c.startTime.getTime()))
          .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
        console.log("all contests combined : ",all)
        setContests(all);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function formatCountdown(date: Date): string {
    const diff = date.getTime() - Date.now();
    if (diff <= 0) return "Live / Started";

    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);

    if (day >= 1) return `${day}d ${hr % 24}h`;
    if (hr >= 1) return `${hr}h ${min % 60}m`;
    if (min >= 1) return `${min}m`;
    return `${sec}s`;
  }

  function countdownColor(date: Date): string {
    const diff = date.getTime() - Date.now();
    if (diff <= 0) return "text-red-400 font-semibold";
    if (diff < 6 *60 * 60 * 1000) return "text-red-400 font-semibold"; // < 1 day
    if (diff < 24 * 60 * 60 * 1000) return "text-orange-400 font-medium"; // < 1 day
    if (diff < 3* 24 * 60 * 60 * 1000) return "text-yellow-400 font-medium"; // < 3 days
    return "text-green-400 font-medium"; // > 3 days
  }

  // Live timer rerender
  const [, rerender] = useState(0);
  useEffect(() => {
    const id = setInterval(() => rerender((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  function toGoogleDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  }

  function getCalendarLink(c: Contest): string {
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      c.name
    )}&dates=${toGoogleDate(c.startTime)}/${toGoogleDate(c.endTime)}&location=${encodeURIComponent(
      c.url
    )}`;
  }

  if (loading) return <div className="text-center mt-10">Loading contests...</div>;

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upcoming Contests</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          placeholder="Search contests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm w-full"
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm"
        >
          <option value="All">All Platforms</option>
          <option value="Codeforces">Codeforces</option>
          <option value="atcoder">AtCoder</option>
          <option value="leetcode">LeetCode</option>
        </select>
      </div>

      <div className="space-y-4">
        {contests
          .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
          .filter((c) => platform === "All" || c.platform === platform)
          .map((c, i) => (
            <div key={i} className="p-5 rounded-lg bg-zinc-800 border border-zinc-700 shadow">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{c.name}</h2>
                <span className="text-xs px-2 py-1 rounded bg-zinc-700 text-zinc-300 capitalize">
                  {c.platform}
                </span>
              </div>

              <p className="text-sm text-zinc-300 mt-2">
                Starts: {c.startTime.toLocaleString()}
              </p>

              <p className={`mt-1 text-sm ${countdownColor(c.startTime)}`}>
                ⏳ {formatCountdown(c.startTime)}
              </p>

              <div className="flex justify-end gap-4 mt-4 text-sm">
                <Link href={c.url} target="_blank" className="text-blue-400 hover:underline">
                  Open
                </Link>
                <Link href={getCalendarLink(c)} target="_blank" className="text-green-400 hover:underline">
                  Add to Calendar
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
