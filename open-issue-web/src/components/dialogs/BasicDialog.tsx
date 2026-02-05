import { forwardRef, Ref } from 'react';

import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Paper,
  PaperProps,
  useMediaQuery,
  useTheme
} from '@mui/material';

import Draggable from 'react-draggable';
import { BasicDialogHookOptions } from './useBasicDialog';
import { CloseOutlined } from '@ant-design/icons';

const PaperComponent = forwardRef((props: PaperProps, ref: Ref<HTMLDivElement>) => (
  <Draggable handle="#draggable-dialog" cancel={'[class*="MuiDialogContent-root"]'}>
    <Paper ref={ref} {...props} />
  </Draggable>
));

export interface BasicDialogRef {
  open: () => void;
  close: () => void;
}

export interface ButtonOverrideProps {
  btnLabel: string;
  btnOptions?: ButtonProps;
  btnAction: () => void;
}

interface BasicDialogProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  children?: React.ReactNode;
  options: BasicDialogHookOptions;
  dialogProps: Omit<DialogProps, 'fullScreen' | 'open' | 'onClose' | 'PaperComponent' | 'aria-labelledby'>;
  overrideButtons?: ButtonOverrideProps[];
  actionButtons: boolean;
  closeCallback?: () => void;
}

export default function BasicDialog({
  open,
  handleClose,
  handleConfirm,
  options,
  children,
  overrideButtons,
  dialogProps,
  actionButtons,
  closeCallback
}: BasicDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('xl'));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => {
          if (closeCallback) {
            closeCallback();
          }
          handleClose();
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog"
        sx={{ WebkitTransform: 'none !important' }}
        {...dialogProps}
      >
        <Box sx={{ p: 1 /*, py: 1.5*/ }}>
          <DialogTitle
            style={{
              cursor: 'move',
              padding: '12px 0',
              margin: '0 8px',
              borderBottom: '1px solid #ddd',
              textIndent: '8px',
              position: 'relative'
            }}
            id="draggable-dialog"
          >
            {options.title && options.title}
            <span style={{ fontSize: '0.8rem', fontWeight: 300, marginLeft: '12px' }}>{options.description && options.description}</span>
            <IconButton
              sx={{ position: 'absolute', top: 4, right: 0, touchAction: 'manipulation', cursor: 'pointer' }}
              onClick={() => {
                if (closeCallback) {
                  closeCallback();
                }
                handleClose();
              }}
              {...(isMobile && {
                onPointerUp: () => {
                  if (closeCallback) {
                    closeCallback();
                  }
                  handleClose();
                }
              })}
            >
              <CloseOutlined />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 1, maxHeight: options.contentMaxHeight }}>{children}</DialogContent>
          <DialogActions sx={{ justifyContent: 'center', p: actionButtons || overrideButtons ? 1 : 0 }}>
            {overrideButtons && overrideButtons.length
              ? overrideButtons.map((btn, index) => (
                  <Button key={index} {...btn.btnOptions} onClick={btn.btnAction}>
                    {btn.btnLabel}
                  </Button>
                ))
              : actionButtons && (
                  <>
                    <Button
                      onClick={() => {
                        handleClose();
                        if (closeCallback) {
                          closeCallback();
                        }
                      }}
                      variant="outlined"
                    >
                      {options.cancelText ? options.cancelText : '취소'}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleConfirm();
                        if (closeCallback) {
                          closeCallback();
                        }
                      }}
                    >
                      {options.confirmText ? options.confirmText : '확인'}
                    </Button>
                  </>
                )}
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
