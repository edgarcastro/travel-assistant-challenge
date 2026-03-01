import { Skeleton } from "@heroui/react";

export default function TravelItemSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-default-200 p-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Title + flag + chip */}
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="rounded-md">
            <div className="h-5 w-28 bg-default-200" />
          </Skeleton>
          <Skeleton className="rounded-md">
            <div className="h-4 w-16 bg-default-200" />
          </Skeleton>
          <Skeleton className="rounded-full">
            <div className="h-5 w-12 bg-default-200" />
          </Skeleton>
        </div>

        {/* Weather badge */}
        <Skeleton className="rounded-md">
          <div className="h-4 w-24 bg-default-200" />
        </Skeleton>

        {/* Description */}
        <div className="space-y-1">
          <Skeleton className="rounded-md">
            <div className="h-3.5 w-full bg-default-200" />
          </Skeleton>
          <Skeleton className="rounded-md">
            <div className="h-3.5 w-3/4 bg-default-200" />
          </Skeleton>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-1 self-start shrink-0">
        <Skeleton className="rounded-lg">
          <div className="h-8 w-8 bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-lg">
          <div className="h-8 w-8 bg-default-200" />
        </Skeleton>
      </div>
    </div>
  );
}
