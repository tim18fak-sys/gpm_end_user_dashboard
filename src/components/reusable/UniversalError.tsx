import { ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export type UniversalErrorVariant = "danger" | "warning" | "neutral";

export interface UniversalErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  variant?: UniversalErrorVariant;
  compact?: boolean;
  className?: string;
}

/*
 * Usage:
 *
 * <UniversalError
 *   title="Unable to load staff"
 *   message="Something went wrong while fetching the staff list."
 *   onRetry={refetch}
 * />
 *
 * Compact inline usage:
 *
 * <UniversalError
 *   compact
 *   title="Could not load receipt"
 *   onRetry={refetch}
 * />
 *
 * Portability:
 * This component uses Tailwind tokens from tailwind.config.js:
 * primary, secondary, danger, warning, animate-fade-in, and animate-slide-in.
 * Copy those theme tokens when moving the component to another project.
 */

const variantClasses: Record<
  UniversalErrorVariant,
  {
    iconContainer: string;
    icon: string;
    button: string;
  }
> = {
  danger: {
    iconContainer: "bg-danger-100 dark:bg-danger-900/20",
    icon: "text-danger-600 dark:text-danger-400",
    button:
      "bg-danger-600 hover:bg-danger-700 focus:ring-danger-500 dark:focus:ring-offset-secondary-800",
  },
  warning: {
    iconContainer: "bg-warning-100 dark:bg-warning-900/20",
    icon: "text-warning-700 dark:text-warning-400",
    button:
      "bg-warning-600 hover:bg-warning-700 focus:ring-warning-500 dark:focus:ring-offset-secondary-800",
  },
  neutral: {
    iconContainer: "bg-secondary-100 dark:bg-secondary-700",
    icon: "text-secondary-600 dark:text-secondary-300",
    button:
      "bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 dark:focus:ring-offset-secondary-800",
  },
};

export default function UniversalError({
  title = "Something went wrong",
  message = "We couldn't complete your request. Please try again.",
  onRetry,
  retryLabel = "Try again",
  variant = "danger",
  compact = false,
  className = "",
}: UniversalErrorProps) {
  const styles = variantClasses[variant];

  return (
    <section
      role="alert"
      className={`animate-fade-in rounded-2xl border border-secondary-200 bg-white text-center shadow-sm dark:border-secondary-700 dark:bg-secondary-800 ${
        compact ? "p-6" : "p-8 sm:p-12"
      } ${className}`}
    >
      <div
        className={`animate-slide-in mx-auto flex items-center justify-center rounded-full ${styles.iconContainer} ${
          compact ? "h-12 w-12" : "h-16 w-16"
        }`}
      >
        <ExclamationTriangleIcon
          aria-hidden="true"
          className={`${styles.icon} ${compact ? "h-6 w-6" : "h-8 w-8"}`}
        />
      </div>

      <h2
        className={`font-semibold text-secondary-900 dark:text-white ${
          compact ? "mt-4 text-base" : "mt-6 text-xl"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mx-auto max-w-lg text-secondary-600 dark:text-secondary-400 ${
          compact ? "mt-2 text-sm" : "mt-3 text-sm sm:text-base"
        }`}
      >
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={`mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.button}`}
        >
          <ArrowPathIcon className="h-4 w-4" />
          {retryLabel}
        </button>
      )}
    </section>
  );
}