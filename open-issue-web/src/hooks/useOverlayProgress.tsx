// useOverlayProgress.tsx
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { Backdrop } from '@mui/material';

export const useOverlayProgress = (isLoading: boolean) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // SSR guard
    if (typeof document === 'undefined') return;

    const el = document.createElement('div');
    el.id = 'overlay-progress-root';
    el.style.position = 'relative';
    document.body.appendChild(el);
    containerRef.current = el;
    // 트리거해서 두 번째 렌더에서 createPortal을 리턴하게 함
    setMounted(true);

    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
      containerRef.current = null;
    };
  }, []);

  // 아직 mount되지 않았거나 container가 없으면 렌더 X
  if (!mounted || !containerRef.current) return null;

  // createPortal은 render 시에 호출되어야 함 (effect 안 X)
  return createPortal(
    <Backdrop
      open={isLoading}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: (theme) => theme.zIndex.modal + 2000, // 필요시 조정
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CircularWithPath />
    </Backdrop>,
    containerRef.current
  );
};
