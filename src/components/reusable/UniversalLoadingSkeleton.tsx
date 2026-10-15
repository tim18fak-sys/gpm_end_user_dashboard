export type UniversalLoadingSkeletonVariant =
  | "table"
  | "list"
  | "card"
  | "detail";

export interface UniversalLoadingSkeletonProps {
  variant?: UniversalLoadingSkeletonVariant;
  rows?: number;
  columns?: number;
  showAvatar?: boolean;
  className?: string;
  label?: string;
}

/*
 * Usage:
 *
 * <UniversalLoadingSkeleton variant="table" rows={5} columns={4} />
 * <UniversalLoadingSkeleton variant="list" rows={4} showAvatar />
 * <UniversalLoadingSkeleton variant="card" />
 * <UniversalLoadingSkeleton variant="detail" />
 *
 * Portability:
 * This component uses Tailwind tokens from tailwind.config.js:
 * secondary, rounded sizes, and animate-pulse/animate-pulse-slow.
 * Copy those theme tokens when moving the component to another project.
 */

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-secondary-200 dark:bg-secondary-700 ${className}`}
    />
  );
}

function TableSkeleton({ rows, columns }: { rows: number; columns: number }) {
  return (
    <div className="divide-y divide-secondary-200 overflow-hidden rounded-2xl border border-secondary-200 bg-white dark:divide-secondary-700 dark:border-secondary-700 dark:bg-secondary-800">
      <div className="flex gap-6 bg-secondary-50 px-6 py-4 dark:bg-secondary-900">
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonBlock
            key={`header-${index}`}
            className={`h-3 ${index === 0 ? "w-32" : "w-24"}`}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex items-center gap-6 px-6 py-5"
        >
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <SkeletonBlock
              key={`cell-${rowIndex}-${columnIndex}`}
              className={`h-4 ${
                columnIndex === 0
                  ? "w-40"
                  : columnIndex % 2 === 0
                    ? "w-24"
                    : "w-32"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ListSkeleton({
  rows,
  showAvatar,
}: {
  rows: number;
  showAvatar: boolean;
}) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={`list-${index}`}
          className="flex items-center gap-4 rounded-xl border border-secondary-200 bg-white p-4 dark:border-secondary-700 dark:bg-secondary-800"
        >
          {showAvatar && (
            <SkeletonBlock className="h-10 w-10 flex-shrink-0 rounded-full" />
          )}
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="h-3 w-1/3" />
          </div>
          <SkeletonBlock className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-700 dark:bg-secondary-800">
      <SkeletonBlock className="h-5 w-1/3" />
      <SkeletonBlock className="mt-4 h-4 w-full" />
      <SkeletonBlock className="mt-2 h-4 w-4/5" />
      <div className="mt-6 flex gap-3">
        <SkeletonBlock className="h-10 w-24" />
        <SkeletonBlock className="h-10 w-20" />
      </div>
    </div>
  );
}

function DetailSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-5 rounded-2xl border border-secondary-200 bg-white p-6 dark:border-secondary-700 dark:bg-secondary-800">
      <div className="flex items-center gap-4">
        <SkeletonBlock className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-5 w-1/3" />
          <SkeletonBlock className="h-3 w-1/4" />
        </div>
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={`detail-${index}`}
          className="rounded-xl border border-secondary-200 p-4 dark:border-secondary-700"
        >
          <SkeletonBlock className="h-4 w-1/4" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <SkeletonBlock className="h-3 w-16" />
              <SkeletonBlock className="h-4 w-28" />
            </div>
            <div className="space-y-2">
              <SkeletonBlock className="h-3 w-16" />
              <SkeletonBlock className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function UniversalLoadingSkeleton({
  variant = "table",
  rows = 5,
  columns = 4,
  showAvatar = true,
  className = "",
  label = "Loading",
}: UniversalLoadingSkeletonProps) {
  return (
    <div
      role="status"
      aria-label={label}
      aria-busy="true"
      className={`animate-fade-in ${className}`}
    >
      {variant === "table" && (
        <TableSkeleton rows={rows} columns={columns} />
      )}
      {variant === "list" && (
        <ListSkeleton rows={rows} showAvatar={showAvatar} />
      )}
      {variant === "card" && <CardSkeleton />}
      {variant === "detail" && <DetailSkeleton rows={rows} />}
      <span className="sr-only">{label}</span>
    </div>
  );
}