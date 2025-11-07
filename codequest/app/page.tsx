"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ContestCard from "@/components/contestCard";

export default function HomePage() {
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function convertAtCoderDuration(duration: string) {
    if (!duration) return 0;
    const [h, m] = duration.split(":").map(Number);
    return h * 60 + m;
  }

  useEffect(() => {
    async function fetchContests() {
      try {
        const lc = await axios.get("/api/leetcode");
        const cf = await axios.get("/api/codeforces");
        const ac = await axios.get("/api/atcoder");
        console.log("✅ Fetched contest data from all platforms.", lc, cf, ac);

        const leetcode = lc.data.contests?.map((c: any) => ({
          platform: "LeetCode",
          name: c.name,
          url: c.url,
          startTime: c.start_time || c.startTime,
          durationMinutes: Math.round((c.duration || 0) / 60),
        })) || [];
       
        const codeforces = cf.data.contests?.map((c: any) => ({
          platform: "Codeforces",
          name: c.name,
          url: `https://codeforces.com/contest/${c.id}`,
          startTime: c.startTime,
          durationMinutes: c.durationMinutes,
        })) || [];
       

        const atcoder = ac.data.contests?.map((c: any) => ({
          platform: "AtCoder",
          name: c.title,
          url: c.link,
          startTime: c.startTime.replace("+0900", ""), // clean for Date()
          durationMinutes: convertAtCoderDuration(c.duration),
        })) || [];
      

        const merged = [...leetcode, ...codeforces, ...atcoder]
          .filter(c => c.startTime)
          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

        setContests(merged);
      } catch (error) {
        console.error("❌ Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchContests();
  }, []);

  return (
    <main className="min-h-screen bg-bg text-white px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-accent text-center">
        Competitive Programming Contest Tracker ⚡
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading contests...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contests.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No upcoming contests found.</p>
          ) : (
            contests.map((contest, i) => <ContestCard key={i} {...contest} />)
          )}
        </div>
      )}
    </main>
  );
}
