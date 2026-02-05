import { useRef, useEffect } from 'react';
import { SwiperRef } from 'swiper/react';
import { useStackBar } from '../store/useStackBar';
import { arrayMove } from '@dnd-kit/sortable';

interface CustomSwiperNavButtonsProps {
  swiperRef: React.RefObject<SwiperRef>;
  isDragging?: boolean;
  activeId: string | null;
}

export const CustomSwiperNavButtons: React.FC<CustomSwiperNavButtonsProps> = ({ swiperRef, isDragging = false, activeId }) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const nextButtonRef = useRef<HTMLDivElement>(null);
  const prevButtonRef = useRef<HTMLDivElement>(null);

  const { stackbarMenu, setStackBarMenu, getPrevMenu, getNextMenu, getStackBarMenuIdx } = useStackBar();

  const handleHoldNavigation = (direction: 'next' | 'prev') => {
    if (!swiperRef.current) return;

    // 이미 인터벌이 실행 중이면 중복 실행하지 않음
    if (intervalRef.current) return;

    const currentIndex = stackbarMenu.findIndex((item) => item.id === activeId);

    intervalRef.current = setInterval(() => {
      if (direction === 'next') {
        if (swiperRef.current?.swiper.isEnd) {
          stopNavigation();
          return;
        }

        const newMenu = getNextMenu(activeId);
        const newIndex = getStackBarMenuIdx(newMenu?.id);

        setStackBarMenu(arrayMove(stackbarMenu, currentIndex, newIndex));
        swiperRef.current?.swiper.slideNext();
      } else if (direction === 'prev') {
        if (swiperRef.current?.swiper.isBeginning) {
          stopNavigation();
          return;
        }

        const newMenu = getPrevMenu(activeId);
        const newIndex = getStackBarMenuIdx(newMenu?.id);

        setStackBarMenu(arrayMove(stackbarMenu, currentIndex, newIndex));
        swiperRef.current?.swiper.slidePrev();
      } else {
        stopNavigation();
        return;
      }
    }, 150);
  };

  const stopNavigation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 드래그 중일 때 마우스 위치를 추적하여 버튼 위에 있는지 확인
  useEffect(() => {
    if (!isDragging) {
      stopNavigation();
      return;
    }

    const trackMousePosition = (event: MouseEvent) => {
      if (!isDragging) return;

      const { clientX, clientY } = event;

      if (nextButtonRef.current) {
        const nextRect = nextButtonRef.current.getBoundingClientRect();
        if (clientX >= nextRect.left && clientX <= nextRect.right && clientY >= nextRect.top && clientY <= nextRect.bottom) {
          handleHoldNavigation('next');
          return;
        }
      }

      if (prevButtonRef.current) {
        const prevRect = prevButtonRef.current.getBoundingClientRect();
        if (clientX >= prevRect.left && clientX <= prevRect.right && clientY >= prevRect.top && clientY <= prevRect.bottom) {
          handleHoldNavigation('prev');
          return;
        }
      }

      stopNavigation();
    };

    document.addEventListener('mousemove', trackMousePosition);

    return () => {
      document.removeEventListener('mousemove', trackMousePosition);
      stopNavigation();
    };
  }, [isDragging]);

  return (
    <>
      <div
        ref={prevButtonRef}
        className="swiper-button-prev"
        onMouseDown={() => handleHoldNavigation('prev')}
        onMouseUp={stopNavigation}
        onMouseLeave={stopNavigation}
      />
      <div
        ref={nextButtonRef}
        className="swiper-button-next"
        onMouseDown={() => handleHoldNavigation('next')}
        onMouseUp={stopNavigation}
        onMouseLeave={stopNavigation}
      />
    </>
  );
};
