'use client';

import { useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';

export function GlobalLoader() {
  const isGlobalLoading = useAppSelector((state) => state.auth.isGlobalLoading);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isGlobalLoading) {
      setVisible(true);
      setProgress(10);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);
    } else {
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
    }

    return () => clearInterval(interval);
  }, [isGlobalLoading]);

  if (!visible && progress === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'var(--primary)',
          boxShadow: '0 0 10px var(--primary)',
          transition: 'width 0.4s ease, opacity 0.4s ease',
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
