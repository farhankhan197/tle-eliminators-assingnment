"use client";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

type CardProps = {
  name: string;
  platform: string;
  startTime: string;
  duration: string;
  link: string;
};

export default function ContestCard({
  name,
  platform,
  startTime,
  duration,
  link,
}: CardProps) {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="block bg-card rounded-2xl p-4 shadow-md transition-all border border-neutral-800 hover:border-accent"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">{name}</h2>
        <span className="text-sm text-accent">{platform}</span>
      </div>
      <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
        <Calendar size={16} />
        <span>{new Date(startTime).toLocaleString()}</span>
      </div>
      {duration && (
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
          <Clock size={16} />
          <span>{duration} min</span>
        </div>
      )}
    </motion.a>
  );
}
