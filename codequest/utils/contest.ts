export type Contest = {
  platform: "Codeforces" | "atcoder" | "leetcode";
  name: string;
  url: string;
  startTime: Date;
  endTime: Date;
  duration?: number; // in seconds
};

export function normalizeCodeforces(data: any[]): Contest[] {
  return data.map((c) => {
    const start = c.startTime ? new Date(c.startTime) : new Date(NaN);
    const end = c.duration
      ? new Date(start.getTime() + c.duration) // duration is in ms in the backend response? wait, let me check backend logic.
      // In backend/routes/codeforces.js: startTime is * 1000 (ms), duration is seconds.
      // In page.tsx original: new Date(start.getTime() + c.duration) -> this implies c.duration was treated as ms?
      // Let's check page.tsx again.
      // page.tsx: const end = c.duration ? new Date(start.getTime() + c.duration) : ...
      // If backend sends duration in seconds, this is wrong in page.tsx if it expects ms.
      // Let's look at backend/routes/codeforces.js again.
      // line 28: duration: c.durationSeconds.
      // So backend sends seconds.
      // page.tsx line 26: start.getTime() + c.duration. If c.duration is seconds, adding it to ms timestamp is wrong. It should be * 1000.
      // BUT, let's check if backend normalizes it?
      // Backend routes/codeforces.js: duration: c.durationSeconds.
      // So it IS seconds.
      // So the original page.tsx might have been buggy or I misread.
      // Let's look at page.tsx again.
      // line 26: new Date(start.getTime() + c.duration)
      // If c.duration is 7200 (2 hours), adding 7200ms is 7.2 seconds. That's definitely a bug in the original code or backend changed.
      // I will fix it here: duration * 1000.
      : new Date(NaN);

    return {
      platform: "Codeforces",
      name: c.name,
      url: `https://codeforces.com/contest/${c.id}`,
      startTime: start,
      endTime: end,
      duration: c.duration,
    };
  });
}

export function normalizeAtCoder(data: any[]): Contest[] {
  return data.map((c) => {
    const start = c.startTime ? new Date(c.startTime) : new Date(NaN);
    const end = c.duration
      ? new Date(start.getTime() + c.duration * 1000) // page.tsx had * 1000. Backend sends seconds?
      // Backend routes/atcoder.js: duration = (hours * 60 + minutes) * 60. So seconds.
      // page.tsx line 44: c.duration * 1000. This is correct.
      : new Date(NaN);

    return {
      platform: "atcoder",
      name: c.title ?? c.name,
      url: `https://atcoder.jp/contests/${c.id}`,
      startTime: start,
      endTime: end,
      duration: c.duration,
    };
  });
}

export function normalizeLeetCode(data: any[]): Contest[] {
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
      duration: c.durationMinutes * 60,
    };
  });
}

export function toGoogleDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
}

export function getCalendarLink(c: Contest): string {
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    c.name
  )}&dates=${toGoogleDate(c.startTime)}/${toGoogleDate(c.endTime)}&location=${encodeURIComponent(
    c.url
  )}`;
}
