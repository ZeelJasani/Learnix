"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle } from "lucide-react";

interface QuizTimerProps {
    timeLimit: number; // in minutes
    onTimeUp: () => void;
    isPaused?: boolean;
}

export function QuizTimer({ timeLimit, onTimeUp, isPaused = false }: QuizTimerProps) {
    const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // Convert to seconds
    const [isWarning, setIsWarning] = useState(false);

    useEffect(() => {
        if (isPaused || timeRemaining <= 0) return;

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                const newTime = prev - 1;

                // Warning at 5 minutes (300 seconds)
                if (newTime === 300) {
                    setIsWarning(true);
                }

                // Time's up
                if (newTime <= 0) {
                    clearInterval(interval);
                    onTimeUp();
                    return 0;
                }

                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isPaused, timeRemaining, onTimeUp]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const progressPercentage = (timeRemaining / (timeLimit * 60)) * 100;

    return (
        <Card className={isWarning ? "border-destructive" : ""}>
            <CardContent className="pt-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {isWarning ? (
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                            ) : (
                                <Clock className="h-5 w-5 text-muted-foreground" />
                            )}
                            <span className="text-sm font-medium">Time Remaining</span>
                        </div>
                        <span
                            className={`text-2xl font-bold tabular-nums ${isWarning ? "text-destructive" : ""
                                }`}
                        >
                            {formatTime(timeRemaining)}
                        </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    {isWarning && (
                        <p className="text-sm text-destructive">
                            ⚠️ Less than 5 minutes remaining!
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
