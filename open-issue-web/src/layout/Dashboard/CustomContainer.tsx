import { Container, useTheme } from '@mui/material';
import useConfig from 'hooks/useConfig';

interface ContainerProps {
  display?: React.CSSProperties['display'];
}

export const CustomContainer = ({ children, display }: React.PropsWithChildren<ContainerProps>) => {
  const theme = useTheme();
  const { container } = useConfig();

  return (
    <Container
      maxWidth={container ? 'xl' : false}
      sx={{
        background: theme.palette.background.paper,
        height: 'calc(100vh)',
        overflowY: 'hidden',
        overflowX: 'auto',
        px: { xs: 0, sm: 0 },
        position: 'relative',
        minHeight: 'calc(100vh - 112px)',
        display: display ?? 'flex',
        flexDirection: 'column',
        '& > div:last-child': {
          flex: '0 1 99%',
          overflow: 'unset',
          maxHeight: 'calc(100vh - 112px)',
          borderRadius: 0,
          border: 'none'
        },
        '& > div:last-child > div': {
          height: '100%',
          boxShadow: '0 1px 4px rgba(0,0,0,.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        },
        '& > div:last-child > .MuiCardContent-root > div:last-child': {
          height: '100%',
          paddingBottom: 1
        }
      }}
    >
      {children}
    </Container>
  );
};
