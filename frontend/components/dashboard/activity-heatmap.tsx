"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, CalendarDays, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  heatmap: string[];
}

export function ActivityHeatmap() {
  const [data, setData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const fetchedRef = React.useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;

    async function fetchStreak() {
      try {
        const token = await getToken();
        if (!token) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/activity-streak`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          fetchedRef.current = true;
        }
      } catch (error) {
        console.error("Error fetching streak data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStreak();
  }, [getToken]);

  if (loading) {
    return (
      <div className="w-full h-48 bg-card animate-pulse rounded-xl border flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
           <CalendarDays className="w-8 h-8 text-muted-foreground/30" />
           <span className="text-xs text-muted-foreground">Loading your activity...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Generate days for the last 6 months (typical dashboard view)
  const today = new Date();
  const daysToShow = 24 * 7; // 24 weeks
  const startDate = new Date();
  startDate.setDate(today.getDate() - daysToShow);

  const days = [];
  for (let i = 0; i <= daysToShow; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const hasActivity = data.heatmap.includes(dateStr);
    days.push({ date: d, dateStr, hasActivity });
  }

  // Group by weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="space-y-6">
      {/* Streak Stats / Streak Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-4 rounded-xl border border-border/50 flex items-center gap-4 relative overflow-hidden group"
        >
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
            <Flame className={cn("w-6 h-6", data.currentStreak > 0 ? "text-orange-500 animate-pulse" : "text-muted-foreground")} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Streak</p>
            <h3 className="text-2xl font-bold font-serif">{data.currentStreak} Days</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Flame className="w-24 h-24 text-orange-500" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card p-4 rounded-xl border border-border/50 flex items-center gap-4 relative overflow-hidden group"
        >
          <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Longest Streak</p>
            <h3 className="text-2xl font-bold font-serif">{data.longestStreak} Days</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Trophy className="w-24 h-24 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card p-4 rounded-xl border border-border/50 flex items-center gap-4 relative overflow-hidden group"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Active Days</p>
            <h3 className="text-2xl font-bold font-serif">{data.totalActiveDays}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <CalendarDays className="w-24 h-24 text-primary" />
          </div>
        </motion.div>
      </div>

      {/* Heatmap Grid / Heatmap Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-card p-6 rounded-xl border border-border/50"
      >
        <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-medium flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                Learning Activity
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-[2px] bg-muted/30" />
                    <div className="w-3 h-3 rounded-[2px] bg-primary/30" />
                    <div className="w-3 h-3 rounded-[2px] bg-primary/60" />
                    <div className="w-3 h-3 rounded-[2px] bg-primary" />
                </div>
                <span>More</span>
            </div>
        </div>

        <div className="relative overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-[4px] min-w-max">
                <TooltipProvider delayDuration={100}>
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-[4px]">
                            {week.map((day, dayIndex) => (
                                <Tooltip key={day.dateStr}>
                                    <TooltipTrigger asChild>
                                        <div 
                                            className={cn(
                                                "w-3 h-3 sm:w-4 sm:h-4 rounded-[2px] transition-all duration-300 hover:ring-2 hover:ring-primary/50 cursor-pointer",
                                                day.hasActivity ? "bg-primary" : "bg-muted/30"
                                            )}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="text-[10px] py-1 px-2">
                                        <p className="font-medium">{day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        <p className={cn(day.hasActivity ? "text-primary font-bold" : "text-muted-foreground")}>
                                            {day.hasActivity ? "Activity Completed" : "No active participation"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    ))}
                </TooltipProvider>
            </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="w-3.5 h-3.5" />
            <p>Activity includes lesson completion, quiz attempts, and project submissions.</p>
        </div>
      </motion.div>
    </div>
  );
}
