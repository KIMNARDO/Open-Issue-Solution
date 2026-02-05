import { useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Accordion, AccordionDetails, AccordionSummary, Badge, Box, Drawer, Stack, Typography } from '@mui/material';

// project import
// import ThemeLayout from './ThemeLayout'; // Layout: 레이아웃 너비 커스텀 사용 시 주석 해제
// import ColorScheme from './ColorScheme'; // ColorScheme: 색상 커스텀 사용 시 주석 해제
// import ThemeWidth from './ThemeWidth'; // Layout Width: 레이아웃 너비 커스텀 사용 시 주석 해제
import DefaultThemeMode from './ThemeMode';
import ThemeFont from './ThemeFont';
import ThemeMenuLayout from './ThemeMenuLayout';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import SimpleBar from 'components/third-party/SimpleBar';
import useConfig from 'hooks/useConfig';

// assets
import {
  HighlightOutlined,
  BorderInnerOutlined,
  SettingOutlined,
  CloseCircleOutlined,
  FontColorsOutlined,
  ReloadOutlined
  // BgColorsOutlined, // ColorScheme: 색상 커스텀 사용 시 주석 해제
  // LayoutOutlined, // Layout: 레이아웃 커스텀 사용 시 주석 해제
} from '@ant-design/icons';

// types
import { ThemeMode } from 'types/config';
import { defaultConfig } from 'config';
import _ from 'lodash';

// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

const Customization = () => {
  const theme = useTheme();
  const { container, fontFamily, mode, presetColor, miniDrawer, menuOrientation, resetConfig } = useConfig();

  // Layout: 레이아웃 커스텀 사용 시 주석 해제
  // const themeLayout = useMemo(() => <ThemeLayout _miniDrawer={miniDrawer ? 'mini' : 'default'} />, [miniDrawer]);

  // ColorScheme: 색상 커스텀 사용 시 주석 해제
  // const themeColor = useMemo(() => <ColorScheme />, [presetColor]);

  // Layout Width: 레이아웃 너비 커스텀 사용 시 주석 해제
  // const themeWidth = useMemo(() => <ThemeWidth />, [container]);

  const themeMenuLayout = useMemo(() => <ThemeMenuLayout />, [menuOrientation]);
  const themeMode = useMemo(() => <DefaultThemeMode />, [mode]);

  const themeFont = useMemo(() => <ThemeFont />, [fontFamily]);

  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  const resetCustomization = () => {
    resetConfig();
  };

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.100';

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <IconButton
          color="secondary"
          variant="light"
          sx={{ color: open ? 'text.primary' : 'white', bgcolor: open ? iconBackColorOpen : 'transparent' }}
          onClick={handleToggle}
          aria-label="settings toggler"
        >
          <SettingOutlined />
        </IconButton>
      </Box>
      <Drawer
        sx={{
          zIndex: 2001
        }}
        anchor="right"
        onClose={handleToggle}
        open={open}
        PaperProps={{
          sx: {
            width: 340
          }
        }}
      >
        {open && (
          <MainCard
            title="UI 커스텀"
            sx={{
              border: 'none',
              borderRadius: 0,
              height: '100vh',
              '& .MuiCardHeader-root': { color: 'background.paper', bgcolor: 'primary.main', '& .MuiTypography-root': { fontSize: '1rem' } }
            }}
            content={false}
            secondary={
              <>
                <IconButton shape="rounded" size="small" onClick={resetCustomization} sx={{ color: 'background.paper' }}>
                  <Badge
                    overlap="circular"
                    color="error"
                    variant="dot"
                    invisible={_.isEqual(defaultConfig, { container, fontFamily, mode, presetColor, miniDrawer, menuOrientation })}
                  >
                    <ReloadOutlined style={{ fontSize: '1.15rem', transform: 'scale(-1,1)' }} />
                  </Badge>
                </IconButton>
                <IconButton shape="rounded" size="small" onClick={handleToggle} sx={{ color: 'background.paper' }}>
                  <CloseCircleOutlined style={{ fontSize: '1.15rem' }} />
                </IconButton>
              </>
            }
          >
            <SimpleBar
              sx={{
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }}
            >
              <Box
                sx={{
                  height: 'calc(100vh - 64px)',
                  '& .MuiAccordion-root': {
                    borderColor: theme.palette.divider,
                    '& .MuiAccordionSummary-root': {
                      bgcolor: 'transparent',
                      flexDirection: 'row',
                      pl: 1
                    },
                    '& .MuiAccordionDetails-root': {
                      border: 'none'
                    },
                    '& .Mui-expanded': {
                      color: theme.palette.primary.main
                    }
                  }
                }}
              >
                {/* Layout: 레이아웃 커스텀 사용 시 주석 해제 */}
                {/* <Accordion defaultExpanded sx={{ borderTop: 'none' }}>
                  <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <LayoutOutlined />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          Theme Layout
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Choose your layout
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeLayout}</AccordionDetails>
                </Accordion> */}
                <Accordion defaultExpanded>
                  <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <BorderInnerOutlined />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          메뉴 위치
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          세로(좌측) 또는 가로(상단) 위치 선택
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeMenuLayout}</AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                  <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <HighlightOutlined />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          테마 모드
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          라이트 모드 또는 다크 모드 선택
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeMode}</AccordionDetails>
                </Accordion>
                {/* ColorScheme: 색상 커스텀 사용 시 주석 해제 */}
                {/* <Accordion defaultExpanded>
                  <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <BgColorsOutlined />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          Color Scheme
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Choose your primary theme color
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeColor}</AccordionDetails>
                </Accordion> */}
                {/* Layout Width: 레이아웃 너비 커스텀 사용 시 주석 해제 */}
                {/* <Accordion defaultExpanded>
                  <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <BorderInnerOutlined />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          Layout Width
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Choose fluid or container layout
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeWidth}</AccordionDetails>
                </Accordion> */}
                <Accordion defaultExpanded sx={{ borderBottom: 'none' }}>
                  <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <FontColorsOutlined />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          폰트
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          폰트 선택
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeFont}</AccordionDetails>
                </Accordion>
              </Box>
            </SimpleBar>
          </MainCard>
        )}
      </Drawer>
    </>
  );
};

export default Customization;
