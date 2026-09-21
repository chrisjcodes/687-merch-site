import { useEffect, useRef } from 'react';
import { track } from '@vercel/analytics/react';

export function useTrackSection(name: string, threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          track('section_viewed', { section: name });
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [name, threshold]);

  return ref;
}
