"use client";

import { formatDate } from "@/lib/utils";
import { cn } from "@/utils/cn";
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
  const [contests, setContests] = useState<Contest[]>();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<string>("all");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/get-contests?platform=${[platform]}`);
        const data = await res.json();
        console.log("all contests combined : ", data);
        setContests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function formatCountdown(date: Date): string {
    console.log("Date : " + date);

    const diff = new Date(date).getTime() - Date.now();
    if (diff <= 0) return "Live / Started";

    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);

    if (day >= 1) return `${day}d ${hr % 24}h ${min % 60}m ${sec % 60}s`;
    if (hr >= 1) return `${hr}h ${min % 60}m ${sec % 60}s`;
    if (min >= 1) return `${min}m ${sec % 60}s`;
    return `${sec}s`;
  }

  function countdownColor(date: Date): string {
    const diff = new Date(date).getTime() - Date.now();
    if (diff <= 0) return "text-red-400 font-semibold";
    if (diff < 6 * 60 * 60 * 1000) return "text-red-400 font-semibold"; // < 1 day
    if (diff < 24 * 60 * 60 * 1000) return "text-orange-400 font-medium"; // < 1 day
    if (diff < 3 * 24 * 60 * 60 * 1000) return "text-yellow-400 font-medium"; // < 3 days
    return "text-white font-medium"; // > 3 days
  }

  // Live timer rerender
  const [, rerender] = useState(0);
  useEffect(() => {
    const id = setInterval(() => rerender((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  function toGoogleDate(date: Date): string {
    return new Date(date)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d+Z$/, "Z");
  }

  function getCalendarLink(c: Contest): string {
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      c.name
    )}&dates=${c.startTime}/${toGoogleDate(
      c.endTime
    )}&location=${encodeURIComponent(c.url)}`;
  }

  if (loading)
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
        <div className="flex gap-3 flex-col">

        <div className="bg-zinc-600 animate-pulse h-50 rounded-lg w-full"></div>
        <div className="bg-zinc-600 animate-pulse h-50 rounded-lg w-full"></div>
        <div className="bg-zinc-600 animate-pulse h-50 rounded-lg w-full"></div>
        <div className="bg-zinc-600 animate-pulse h-50 rounded-lg w-full"></div>
        <div className="bg-zinc-600 animate-pulse h-50 rounded-lg w-full"></div>
        <div className="bg-zinc-600 animate-pulse h-50 rounded-lg w-full"></div>
        </div>
      </div>
    );

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
        {contests &&
          contests
            .filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()))
            ?.filter((c) => platform === "all" || c.platform === platform)
            .map((c, i) => (
              <div
                key={i}
                className="p-5 rounded-lg bg-zinc-800 border border-zinc-700 shadow"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{c.name}</h2>
                  <span className="text-xs px-2 py-1 rounded bg-zinc-700 text-zinc-300 capitalize">
                    {c.platform}
                  </span>
                </div>

                <p className="text-sm text-zinc-300 mt-2">
                  Starts: {formatDate(c.startTime).toLocaleUpperCase()}
                </p>

                <p className={`mt-1 text-sm text-zinc-500`}>
                  Time Remaining :
                  <span className={cn("ml-1 ", countdownColor(c.startTime))}>
                    {formatCountdown(c.startTime)}
                  </span>
                </p>

                <div className="flex justify-end gap-4 mt-4 text-sm">
                  <Link
                    href={c.url}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    Open
                  </Link>
                  <Link
                    href={getCalendarLink(c)}
                    target="_blank"
                    className="text-green-400 hover:underline"
                  >
                    Add to Calendar
                  </Link>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
