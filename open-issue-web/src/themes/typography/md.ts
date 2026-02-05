import { TypographyVariantsOptions } from '@mui/material';

const getMediumTypo = (typoColor: string): TypographyVariantsOptions => ({
  // Headings (헤딩 - 큰 텍스트)
  h1: {
    fontSize: '1.5rem', // 24px - 대형 통계, 강조 헤딩
    fontWeight: 700,
    lineHeight: 1.3,
    color: typoColor
  },
  h2: {
    fontSize: '1.125rem', // 18px - 다이얼로그 제목, 주요 섹션
    fontWeight: 700,
    lineHeight: 1.4,
    color: typoColor
  },
  h3: {
    fontSize: '1rem', // 16px - 메인 타이틀, 카드 헤더
    fontWeight: 700,
    lineHeight: 1.5,
    color: typoColor
  },
  h4: {
    fontSize: '0.875rem', // 14px - 섹션 부제목, 폼 레이블
    fontWeight: 700,
    lineHeight: 1.5,
    color: typoColor
  },
  h5: {
    fontSize: '0.8125rem', // 13px - 서브 헤더
    fontWeight: 600,
    lineHeight: 1.5,
    color: typoColor
  },
  h6: {
    fontSize: '0.6875rem', // 11px - 테이블 헤더, 작은 타이틀
    fontWeight: 700,
    lineHeight: 1.5,
    color: typoColor
  },

  // Subtitles (부제목/본문 강조)
  subtitle1: {
    fontSize: '0.75rem', // 12px - 일반 본문, 폼 필드
    fontWeight: 600,
    lineHeight: 1.5,
    color: typoColor
  },
  subtitle2: {
    fontSize: '0.6875rem', // 11px - 보조 본문, 테이블 셀
    fontWeight: 500,
    lineHeight: 1.5,
    color: typoColor
  },

  // Body (작은 텍스트)
  body1: {
    fontSize: '0.8125rem',
    fontWeight: 500,
    lineHeight: 1.6,
    color: typoColor
  },
  body2: {
    fontSize: '0.625rem',
    fontWeight: 500,
    lineHeight: 1.6,
    color: typoColor
  },

  // Special (특수 용도)
  caption: {
    fontSize: '0.5rem', // 8px - 마이크로 배지
    fontWeight: 600,
    lineHeight: 1.6,
    color: typoColor
  },
  overline: {
    fontSize: '0.625rem', // 10px - 오버라인
    fontWeight: 600,
    textTransform: 'uppercase',
    lineHeight: 1.6,
    color: typoColor
  },
  button: {
    fontSize: '0.875rem', // 14px - 버튼 텍스트
    fontWeight: 600,
    textTransform: 'none',
    color: typoColor
  }
});

export default getMediumTypo;
