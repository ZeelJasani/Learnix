"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, BookOpen, AlertCircle, ChevronRight, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@clerk/nextjs";

interface LessonAnalytics {
  lessonId: string;
  lessonTitle: string;
  completions: number;
  completionRate: number;
  dropOffRate: number;
}

interface CourseAnalytics {
  courseTitle: string;
  totalEnrolled: number;
  lessons: LessonAnalytics[];
}

export function DropOffAnalytics({ courseId }: { courseId: string }) {
  const [data, setData] = useState<CourseAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const token = await getToken();
        if (!token) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mentor/courses/${courseId}/analytics/drop-off`, {
           headers: {
             Authorization: `Bearer ${token}`,
           }
        });
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [courseId]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-card rounded-xl border" />
        <div className="h-96 bg-card rounded-xl border" />
      </div>
    );
  }

  if (!data) return (
     <div className="flex flex-col items-center justify-center p-12 bg-card rounded-xl border border-dashed text-muted-foreground">
        <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
        <p>No analytics data available for this course yet.</p>
     </div>
  );

  const totalLessons = data.lessons.length;
  const avgCompletion = totalLessons > 0 
    ? Math.round(data.lessons.reduce((acc, l) => acc + l.completionRate, 0) / totalLessons) 
    : 0;

  return (
    <div className="space-y-8 pb-10">
      {/* Overview Stats / Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider">Total Enrolled</CardDescription>
            <CardTitle className="text-3xl font-serif flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                {data.totalEnrolled}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider">Avg. Completion</CardDescription>
            <CardTitle className="text-3xl font-serif flex items-center gap-2 text-primary">
                <BookOpen className="w-6 h-6" />
                {avgCompletion}%
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider">Critical Lessons</CardDescription>
            <CardTitle className="text-3xl font-serif flex items-center gap-2 text-destructive">
                <TrendingDown className="w-6 h-6" />
                {data.lessons.filter(l => l.dropOffRate > 15).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Chart / Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Drop-off Funnel</CardTitle>
              <CardDescription>Visualizing student progress throughout the curriculum</CardDescription>
            </div>
            <BarChart3 className="w-8 h-8 text-primary/40" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.lessons.map((lesson, index) => (
              <div key={lesson.lessonId} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-6">
                        {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <h5 className="text-sm font-medium group-hover:text-primary transition-colors">
                        {lesson.lessonTitle}
                    </h5>
                    {lesson.dropOffRate > 15 && (
                        <Badge variant="destructive" className="text-[10px] py-0 h-4">High Drop-off</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-xs text-muted-foreground">
                        {lesson.completions} students
                     </span>
                     <span className="text-sm font-bold w-10 text-right">
                        {lesson.completionRate}%
                     </span>
                  </div>
                </div>

                <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${lesson.completionRate}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        className={cn(
                            "h-full rounded-full transition-all",
                            lesson.dropOffRate > 15 ? "bg-destructive/80" : "bg-primary"
                        )}
                    />
                </div>
                
                {lesson.dropOffRate > 5 && index > 0 && (
                   <div className="flex items-center gap-1 mt-1 text-[10px] text-destructive/70 font-medium ml-9">
                      <TrendingDown className="w-3 h-3" />
                      {lesson.dropOffRate}% drop-off from previous lesson
                   </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Improvement Suggestions / Improvement Suggestions */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Insights & Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
           <p>
              Based on the data, the lesson <strong>"{data.lessons.find(l => l.dropOffRate === Math.max(...data.lessons.map(d => d.dropOffRate)))?.lessonTitle}"</strong> has the highest attrition rate.
           </p>
           <ul className="list-disc pl-5 space-y-2">
              <li>Consider breaking down long lessons into smaller, digestible parts.</li>
              <li>Add a quick quiz to check understanding and keep students engaged.</li>
              <li>Check if there are any broken external links or difficult concepts without enough explanation.</li>
           </ul>
        </CardContent>
      </Card>
    </div>
  );
}
