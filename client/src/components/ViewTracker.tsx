import React, { useEffect, useRef, useState } from "react";

interface ViewTrackerProps {
  onView: () => void;
  children: React.ReactNode;
  threshold?: number;
  delay?: number;
}

export const ViewTracker: React.FC<ViewTrackerProps> = ({
  onView,
  children,
  threshold = 0.5,
  delay = 5000,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasViewed, setHasViewed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasViewed) {
          timerRef.current = setTimeout(() => {
            onView();
            setHasViewed(true);
          }, delay);
        } else {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [onView, threshold, delay, hasViewed]);

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            ref,
          });
        }
        return child;
      })}
    </>
  );
};
