import { ButtonProps, ExtendButtonBase, IconButtonTypeMap, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import LoadingButton from 'components/@extended/LoadingButton';
import { CommonButtonOptions } from './button.types';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import IconButton from 'components/@extended/IconButton';

export type CommonButtonProps = ButtonProps & CommonButtonOptions;

export const ButtonAuthTypes = {
  DOWNLOAD: 'download',
  SAVE: 'save',
  SEARCH: 'search',
  RESET: 'reset',
  ADD: 'add',
  DELETE: 'delete',
  PRINT: 'print'
} as const;

/**
 * @param icon buttonType icon 시 사용하는 prop
 * @param loading loading 상태
 * @param props 기존 mui button의 props
 * @returns
 */
const CommonButton = ({ ...props }: CommonButtonProps) => {
  const { user } = useAuth();
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const [size, setSize] = useState<number>(downMD ? 32 : 36);

  useEffect(() => {
    if (downMD) {
      props.size === 'small' ? setSize(28) : setSize(32);
    } else {
      props.size === 'small' ? setSize(32) : setSize(36);
    }
  }, [downMD]);

  const handleButtonAction = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onClick) {
      props.onClick(e);
    }
  };

  const auth = user?.groupAuthority?.find((f) => f.menuPath === (props.authTargetPath ?? window.location.pathname));

  if (auth && props.authkey) {
    if (auth[props.authkey] === 'N') {
      props.hidden = true;
    }
  }

  if (props.icononly === 'true') {
    if (props.hidden) {
      return <></>;
    }

    return (
      <Tooltip title={props.title} arrow>
        <span>
          <IconButton
            onClick={handleButtonAction}
            {...(props as ExtendButtonBase<IconButtonTypeMap<{}, 'button'>>)}
            title={undefined}
            disabled={props.disabled}
          >
            {props.icon}
          </IconButton>
        </span>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title={props.title} arrow>
        <span>
          <LoadingButton
            loading={props.loading}
            startIcon={props.icon ?? props.icon}
            loadingPosition="center"
            onClick={handleButtonAction}
            sx={{
              opacity: props.disabled ? 0.7 : 1
              // minHeight: size,
              // maxHeight: size,
              // minWidth: 'max-content'
            }}
            {...props}
            title={undefined}
          >
            {props.title || ''}
          </LoadingButton>
        </span>
      </Tooltip>
    );
  }
};

export default CommonButton;
