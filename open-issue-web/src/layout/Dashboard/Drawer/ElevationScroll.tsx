import { useScrollTrigger, useTheme } from '@mui/material';
import React from 'react';
import { ReactElement } from 'react';

export interface ElevationScrollProps {
  children: ReactElement;
  window?: Window | Node;
}

export function ElevationScroll({ children, window }: ElevationScrollProps) {
  const theme = useTheme();
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window!
  });

  theme.shadows[4] = theme.customShadows.z1;

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0
  });
}
