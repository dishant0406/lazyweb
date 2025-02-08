import * as React from "react";

interface InfiniteScrollProps {
  isLoading: boolean;
  hasMore: boolean;
  next: () => unknown;
  threshold?: number;
  root?: Element | Document | null;
  rootMargin?: string;
  reverse?: boolean;
  children?: React.ReactNode;
}

export default function InfiniteScroll({
  isLoading,
  hasMore,
  next,
  threshold = 1,
  root = null,
  rootMargin = "0px",
  reverse,
  children,
}: InfiniteScrollProps) {
  const observer = React.useRef<IntersectionObserver>();
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const currentSentinel = sentinelRef.current;

    if (isLoading || !currentSentinel) return;

    let safeThreshold = threshold;
    if (threshold < 0 || threshold > 1) {
      console.warn(
        "threshold should be between 0 and 1. You are exceed the range. will use default value: 1"
      );
      safeThreshold = 1;
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          next();
        }
      },
      { threshold: safeThreshold, root, rootMargin }
    );

    observer.current.observe(currentSentinel);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, isLoading, next, threshold, root, rootMargin]);

  const sentinel = (
    <div
      ref={sentinelRef}
      style={{ height: "1px", width: "100%", visibility: "hidden" }}
    />
  );

  return (
    <>
      {reverse && sentinel}
      {children}
      {!reverse && sentinel}
    </>
  );
}
