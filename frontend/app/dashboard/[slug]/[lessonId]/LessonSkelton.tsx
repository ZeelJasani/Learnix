/**
 * LessonSkeleton Component — Lesson content load thay tyare skeleton placeholder display kare chhe
 * LessonSkeleton Component — Displays skeleton placeholder while lesson content loads
 *
 * Aa component Suspense fallback tarike use thay chhe lesson page ma
 * This component is used as a Suspense fallback in the lesson page
 *
 * Skeleton sections:
 * - Video area — aspect-video full-width skeleton
 * - Title + subtitle — h-8 (3/4 width) + h-4 (1/2 width) skeletons
 * - Description lines — 3 skeleton lines (full, 5/6, 4/6 width)
 * - Action buttons — 2 button skeletons (h-10)
 */
import { Skeleton } from "@/components/ui/skeleton";

export function LessonSkeleton() {
  return (
    <div className="flex flex-col h-full pl-6">
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-5/24" />
        </div>
      </div>
    </div>
  );
}