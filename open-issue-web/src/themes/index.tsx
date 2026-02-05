// fonts
import PretendardRegular from '../assets/fonts/Pretendard-Regular.woff2';
import PretendardBold from '../assets/fonts/Pretendard-SemiBold.woff2';
import { ReactNode, useMemo } from 'react';

// material-ui
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { createTheme, ThemeOptions, ThemeProvider, Theme, TypographyVariantsOptions } from '@mui/material/styles';

// project import
import useConfig from 'hooks/useConfig';
import Palette from './palette';
import Typography from './typography';
import CustomShadows from './shadows';
import componentsOverride from './overrides';

// types
import { CustomShadowProps } from 'types/theme';

// types
type ThemeCustomizationProps = {
  children: ReactNode;
};

// ==============================|| DEFAULT THEME - MAIN ||============================== //

export default function ThemeCustomization({ children }: ThemeCustomizationProps) {
  const { mode, presetColor, fontFamily, fontSize } = useConfig();

  const theme: Theme = useMemo<Theme>(() => Palette(mode, presetColor), [mode, presetColor]);

  const themeTypography: TypographyVariantsOptions = useMemo<TypographyVariantsOptions>(
    () => Typography(fontSize, fontFamily, theme),
    [mode, fontFamily, fontSize]
  );
  const themeCustomShadows: CustomShadowProps = useMemo<CustomShadowProps>(() => CustomShadows(theme), [theme]);

  // const typoColor = theme.palette.info.darker;

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1440
        }
      },
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8
        }
      },
      palette: theme.palette,
      customShadows: themeCustomShadows,
      // typography: {
      //   fontFamily: 'Pretendard, Arial',
      //   // Headings (헤딩 - 큰 텍스트)
      //   h1: {
      //     fontSize: '1.5rem', // 24px - 대형 통계, 강조 헤딩
      //     fontWeight: 700,
      //     lineHeight: 1.3,
      //     color: typoColor
      //   },
      //   h2: {
      //     fontSize: '1.125rem', // 18px - 다이얼로그 제목, 주요 섹션
      //     fontWeight: 700,
      //     lineHeight: 1.4,
      //     color: typoColor
      //   },
      //   h3: {
      //     fontSize: '1rem', // 16px - 메인 타이틀, 카드 헤더
      //     fontWeight: 700,
      //     lineHeight: 1.5,
      //     color: typoColor
      //   },
      //   h4: {
      //     fontSize: '0.875rem', // 14px - 섹션 부제목, 폼 레이블
      //     fontWeight: 700,
      //     lineHeight: 1.5,
      //     color: typoColor
      //   },
      //   h5: {
      //     fontSize: '0.8125rem', // 13px - 서브 헤더
      //     fontWeight: 600,
      //     lineHeight: 1.5,
      //     color: typoColor
      //   },
      //   h6: {
      //     fontSize: '0.6875rem', // 11px - 테이블 헤더, 작은 타이틀
      //     fontWeight: 700,
      //     lineHeight: 1.5,
      //     color: typoColor
      //   },

      //   // Subtitles (부제목/본문 강조)
      //   subtitle1: {
      //     fontSize: '0.75rem', // 12px - 일반 본문, 폼 필드
      //     fontWeight: 600,
      //     lineHeight: 1.5,
      //     color: typoColor
      //   },
      //   subtitle2: {
      //     fontSize: '0.6875rem', // 11px - 보조 본문, 테이블 셀
      //     fontWeight: 500,
      //     lineHeight: 1.5,
      //     color: typoColor
      //   },

      //   // Body (작은 텍스트)
      //   body1: {
      //     fontSize: '0.8125rem',
      //     fontWeight: 500,
      //     lineHeight: 1.6,
      //     color: typoColor
      //   },
      //   body2: {
      //     fontSize: '0.625rem',
      //     fontWeight: 500,
      //     lineHeight: 1.6,
      //     color: typoColor
      //   },

      //   // Special (특수 용도)
      //   caption: {
      //     fontSize: '0.5rem', // 8px - 마이크로 배지
      //     fontWeight: 600,
      //     lineHeight: 1.6,
      //     color: typoColor
      //   },
      //   overline: {
      //     fontSize: '0.625rem', // 10px - 오버라인
      //     fontWeight: 600,
      //     textTransform: 'uppercase',
      //     lineHeight: 1.6,
      //     color: typoColor
      //   },
      //   button: {
      //     fontSize: '0.875rem', // 14px - 버튼 텍스트
      //     fontWeight: 600,
      //     textTransform: 'none',
      //     color: typoColor
      //   }
      // },
      typography: themeTypography,
      components: {
        MuiCssBaseline: {
          styleOverrides: `@font-face {
              font-family: 'Pretendard';
              font-style: regular;
              font-weight: 400;
              src: local('Pretendard'), url(${PretendardRegular}) format('woff2');
            }
            @font-face {
              font-family: 'Pretendard';
              font-style: Bold;
              font-weight: 600;
              src: local('Pretendard'), url(${PretendardBold}) format('woff2');
          }`
        }
      }
    }),
    [theme, themeTypography, themeCustomShadows]
  );

  const themes: Theme = createTheme(themeOptions);
  themes.components = componentsOverride(themes);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
