import React, { Dispatch, ForwardedRef, SetStateAction, forwardRef } from 'react';
import { Slide, Fab, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import { SimpleTreeViewProps, SimpleTreeViewRef } from 'components/treeView/SimpleTree';
import { useResizeDiv } from 'hooks/useResizeDiv';

interface SlideableProps extends SimpleTreeViewProps, SlideableIndependentProps {
  checked: boolean;
  position?: 'left' | 'right' | 'up' | 'down' | undefined;
  fabPosition?: {
    bottom?: number | string;
    right?: number | string;
    top?: number | string;
    left?: number | string;
  };
  fabSize?: 'small' | 'medium' | 'large';
  slideWidth?: number | string;
  slideHeight?: number | string;
}

export interface SlideableIndependentProps {
  setChecked: Dispatch<SetStateAction<boolean>>;
  isLoading?: boolean;
}

const SlideableTree = (
  WrappedComponent: React.ForwardRefExoticComponent<
    SimpleTreeViewProps & { setChecked: Dispatch<SetStateAction<boolean>>; isLoading?: boolean } & React.RefAttributes<SimpleTreeViewRef>
  >
) => {
  return forwardRef(
    (
      {
        checked,
        setChecked,
        isLoading,
        position = 'left',
        fabPosition = { bottom: 16, left: 16 },
        fabSize = 'medium',
        slideWidth = 'auto',
        slideHeight = 'auto',
        ...props
      }: SlideableProps,
      ref: ForwardedRef<SimpleTreeViewRef>
    ) => {
      const { containerRef, width, onMouseDown, isResizing } = useResizeDiv(typeof slideWidth === 'number' ? slideWidth : undefined);
      return (
        <>
          <Slide
            id="slideable-tree"
            in={checked}
            direction={position}
            appear={false}
            timeout={{ enter: 750, exit: 500 }}
            easing={'ease-in-out'}
            style={{ display: checked ? 'block' : '', minWidth: 200 }}
            onExited={() => {
              document.getElementById('slideable-tree')?.style.setProperty('display', 'none');
            }}
          >
            <Box ref={containerRef} sx={{ width: width, height: slideHeight, position: 'relative' }}>
              <WrappedComponent setChecked={setChecked} isLoading={isLoading} {...props} ref={ref} />
              <Box
                sx={{
                  width: '15px',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  borderRight: isResizing ? `2px solid black` : undefined,
                  cursor: 'col-resize'
                }}
                onMouseDown={onMouseDown}
              />
            </Box>
          </Slide>
          {!checked && (
            <Fab
              color="primary"
              aria-label="toggle slide"
              size={fabSize}
              sx={{
                position: 'fixed',
                ...fabPosition
              }}
              onClick={() => setChecked(true)}
            >
              <FontAwesomeIcon icon={faListUl} />
            </Fab>
          )}
        </>
      );
    }
  );
};

export default SlideableTree;
