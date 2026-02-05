import { useState, useRef, useCallback, useEffect } from 'react';

export function useResizeDiv(initialWidth?: number) {
  const [width, setWidth] = useState(initialWidth || 300);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onMouseDown = useCallback(() => {
    setIsResizing(true);
    document.body.style.userSelect = 'none';
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setWidth(e.clientX - rect.left);
    },
    [isResizing]
  );

  const onMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.userSelect = '';
  }, []);

  // 이벤트 등록
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return { containerRef, width, onMouseDown, isResizing };
}
