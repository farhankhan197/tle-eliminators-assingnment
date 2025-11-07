"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ContestCard from "@/components/contestCard";


export default function HomePage() {
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContests() {
      try {
        const leetcode = await axios.get("/api/leetcode");
        const codeforces = await axios.get("/api/codeforces");
        const atcoder = await axios.get("/api/atcoder");



        const all = [
          ...leetcode.data.contests.map((c: any) => ({ ...c, platform: "LeetCode" })),
          ...codeforces.data.contests.map((c: any) => ({ ...c, platform: "Codeforces" })),
          ...atcoder.data.contests.map((c: any) => ({ ...c, platform: "AtCoder" })),
        ];

        // Sort by start time
        const sorted = all.sort(
          (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );

        setContests(sorted);
      } catch (error) {
        console.error("Error fetching contests:", error);
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
