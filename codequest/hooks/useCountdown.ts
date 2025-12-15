import { useState, useEffect } from "react";

export function useCountdown(targetDate: Date) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const diff = targetDate.getTime() - Date.now();
        return diff;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    function formatCountdown(): string {
        if (timeLeft <= 0) return "Live / Started";

        const sec = Math.floor(timeLeft / 1000);
        const min = Math.floor(sec / 60);
        const hr = Math.floor(min / 60);
        const day = Math.floor(hr / 24);

        if (day >= 1) return `${day}d ${hr % 24}h ${min % 60}m ${sec % 60}s`;
        if (hr >= 1) return `${hr}h ${min % 60}m ${sec % 60}s`;
        if (min >= 1) return `${min}m ${sec % 60}s`;
        return `${sec}s`;
    }

    function getCountdownColor(): string {
        if (timeLeft <= 0) return "text-red-400 font-semibold";
        if (timeLeft < 6 * 60 * 60 * 1000) return "text-red-400 font-semibold"; // < 6 hours
        if (timeLeft < 24 * 60 * 60 * 1000) return "text-orange-400 font-medium"; // < 1 day
        if (timeLeft < 3 * 24 * 60 * 60 * 1000) return "text-yellow-400 font-medium"; // < 3 days
        return "text-white font-medium"; // > 3 days
    }

    return {
        timeLeft,
        formatted: formatCountdown(),
        color: getCountdownColor(),
    };
}
