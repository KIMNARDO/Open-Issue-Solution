import { useTheme } from '@mui/material/styles';
import { AppBar, Box } from '@mui/material';
import { useGetMenuMaster } from 'api/common/menu';
import { StackBarItem } from './StackBarItem';
import { useStackBar } from './store/useStackBar';
import { useEffect, useRef, useState } from 'react';
import { StackBarContextMenu } from './ContextMenu/StackBarContextMenu';

import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, Mousewheel, FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './page-stackbar.css';
import { CustomSwiperNavButtons } from './Custom/CustomSwiperNavButtons';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { StackBar } from './store/stackbar-store.types';
import SwiperType from 'swiper';

export const STACK_BAR_HEIGHT = 52;

const renderActiveStackBarItem = (activeId: string | null, stackbarMenu: StackBar[]) => {
  if (!activeId) return null;
  const activeItem = stackbarMenu.find((item) => (item.id ?? '') === activeId);
  return activeItem ? <StackBarItem height={STACK_BAR_HEIGHT} id={activeItem.id ?? ''} title={activeItem.title} /> : null;
};

const PageStackBar = () => {
  const theme = useTheme();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  // const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  const swiperRef = useRef<SwiperRef>(null);

  const { stackbarMenu, activeMenuId, getActiveMenuIdx, setStackBarMenu } = useStackBar();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    open: boolean;
  }>({ mouseX: 0, mouseY: 0, open: false });

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
      open: true
    });
  };

  const handleClose = () => {
    setContextMenu({ ...contextMenu, open: false });
  };

  useEffect(() => {
    if (contextMenu.open) {
      const preventDefault = (e: MouseEvent) => e.preventDefault();
      document.addEventListener('contextmenu', preventDefault);

      return () => document.removeEventListener('contextmenu', preventDefault);
    }
  }, [contextMenu.open]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(getActiveMenuIdx());
    }
  }, [activeMenuId]);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );

  // 드래그 중인 아이템 id 상태
  const [activeId, setActiveId] = useState<string | null>(null);

  // 드래그 시작 시 activeId 설정
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // 드래그 종료 시 activeId 해제 및 순서 변경
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (active && over && active.id !== over.id) {
      const oldIndex = stackbarMenu.findIndex((item) => item.id === active.id);
      const newIndex = stackbarMenu.findIndex((item) => item.id === over.id);
      setStackBarMenu(arrayMove(stackbarMenu, oldIndex, newIndex));
    }
  };

  return (
    <AppBar
      sx={{
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: drawerOpen ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen
        }),
        top: 60,
        bgcolor: theme.palette.grey[200], //transparent
        width: {
          // sm: !matchDownMD ? (drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : `calc(100% - ${MINI_DRAWER_WIDTH}px)`) : '100%',
          sm: '100%',
          xs: '100%'
        },
        height: STACK_BAR_HEIGHT,
        justifyContent: 'center',
        borderTop: `1px solid ${theme.palette.divider}`,
        //borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: 1200,
        color: theme.palette.grey[500],
        boxShadow: '0 -1px 5px rgba(0,0,0,.1) inset'
      }}
    >
      <Box>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={stackbarMenu.map((item, idx) => item.id ?? `undefined_${idx}`)} strategy={horizontalListSortingStrategy}>
            <Swiper
              ref={swiperRef}
              initialSlide={0}
              spaceBetween={0}
              slidesPerView={'auto'}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
              }}
              direction={'horizontal'}
              mousewheel={true}
              freeMode={true}
              scrollbar={{ draggable: true }}
              modules={[Navigation, Scrollbar, Mousewheel, FreeMode]}
              className="stack-menu-swiper"
              simulateTouch={false}
              allowTouchMove={false}
              touchStartPreventDefault={false}
              onSwiper={(swiper: SwiperType) => {
                if (swiper && swiper.el) {
                  swiper.el.oncontextmenu = handleContextMenu;
                }
              }}
            >
              {stackbarMenu.map((item, index) => (
                <SwiperSlide key={item.id ?? `undefined_${index}`} style={{ width: 'auto' }}>
                  <StackBarItem height={STACK_BAR_HEIGHT - 4} id={item.id ?? `undefined_${index}`} title={item.title} />
                </SwiperSlide>
              ))}

              <CustomSwiperNavButtons swiperRef={swiperRef} isDragging={activeId !== null} activeId={activeId} />
            </Swiper>
          </SortableContext>
          <DragOverlay zIndex={theme.zIndex.drawer + 10}>{renderActiveStackBarItem(activeId, stackbarMenu)}</DragOverlay>
        </DndContext>
        <StackBarContextMenu contextMenu={contextMenu} handleClose={handleClose} />
      </Box>
    </AppBar>
  );
};

export default PageStackBar;
