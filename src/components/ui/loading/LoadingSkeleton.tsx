import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'form' | 'list';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ variant = 'card', count = 1, className = '' }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        );

      case 'form':
        return (
          <div className="space-y-4">
            <Skeleton className="h-4 w-[30%]" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
            <Skeleton className="h-4 w-[30%]" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-[120px]" /> {/* Button */}
          </div>
        );

      case 'list':
        return (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="mb-4">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}
