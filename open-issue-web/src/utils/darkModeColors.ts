/**
 * Dark Mode Color Utilities
 * 다크모드를 지원하는 색상 유틸리티 함수들
 */

export const getDarkModeColor = (isDarkMode: boolean) => ({
  // Background Colors
  bgPrimary: isDarkMode ? '#0f172a' : '#ffffff',
  bgSecondary: isDarkMode ? '#1e293b' : '#f8f9fa',
  bgTertiary: isDarkMode ? '#1e293b' : '#fafafa',
  bgHover: isDarkMode ? '#334155' : '#f5f5f5',
  bgSelected: isDarkMode ? '#1e3a8a' : '#e0f2fe',
  bgEditing: isDarkMode ? '#422006' : '#fffbeb',
  bgLight: isDarkMode ? '#1e293b' : '#f9fafb',
  bgToolbar: isDarkMode ? '#0f172a' : '#fafafa',

  // Text Colors
  textPrimary: isDarkMode ? '#f1f5f9' : '#1e293b',
  textSecondary: isDarkMode ? '#cbd5e1' : '#64748b',
  textTertiary: isDarkMode ? '#94a3b8' : '#94a3b8',
  textMuted: isDarkMode ? '#64748b' : '#94a3b8',
  textDark: isDarkMode ? '#e2e8f0' : '#475569',
  textLabel: isDarkMode ? '#cbd5e1' : '#374151',

  // Border Colors
  borderPrimary: isDarkMode ? '#334155' : '#e5e7eb',
  borderSecondary: isDarkMode ? '#475569' : '#d1d5db',
  borderLight: isDarkMode ? '#475569' : '#cbd5e1',
  borderAccent: isDarkMode ? '#60a5fa' : '#121770',
  border: isDarkMode ? '#334155' : '#e0e0e0',

  // Input Colors
  inputBg: isDarkMode ? '#0f172a' : '#ffffff',
  inputBorder: isDarkMode ? '#334155' : '#d1d5db',
  inputFocusBorder: isDarkMode ? '#60a5fa' : '#121770',

  // Chip/Badge Colors
  chipBg: isDarkMode ? '#1e293b' : '#ffffff',
  chipBorder: isDarkMode ? '#334155' : '#e0e0e0',

  // Primary Colors
  primary: isDarkMode ? '#60a5fa' : '#121770',
  primaryHover: isDarkMode ? '#3b82f6' : '#0d1050',

  // Status Colors
  success: isDarkMode ? '#22c55e' : '#16a34a',
  successBg: isDarkMode ? '#166534' : '#dcfce7',
  successLight: isDarkMode ? '#166534' : '#bbf7d0',
  successBorder: isDarkMode ? '#15803d' : '#86efac',

  error: isDarkMode ? '#f87171' : '#dc2626',
  errorBg: isDarkMode ? '#7f1d1d' : '#fee2e2',
  errorLight: isDarkMode ? '#991b1b' : '#fecaca',
  errorBorder: isDarkMode ? '#991b1b' : '#fca5a5',

  warning: isDarkMode ? '#fbbf24' : '#f59e0b',
  warningBg: isDarkMode ? '#713f12' : '#fef3c7',
  warningBorder: isDarkMode ? '#a16207' : '#fde047',

  info: isDarkMode ? '#60a5fa' : '#3b82f6',
  infoBg: isDarkMode ? '#1e3a8a' : '#e0f2fe',
  infoBorder: isDarkMode ? '#1e40af' : '#7dd3fc',

  // Tree line colors
  treeLine: isDarkMode ? '#475569' : '#cbd5e1',

  // Scrollbar
  scrollbarTrack: isDarkMode ? '#1e293b' : '#f1f5f9',
  scrollbarThumb: isDarkMode ? '#475569' : '#cbd5e1',
  scrollbarThumbHover: isDarkMode ? '#64748b' : '#94a3b8',

  // Shadow
  boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.5)' : '0 8px 32px rgba(0, 0, 0, 0.12)',
  boxShadowSm: isDarkMode ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.06)'
});

export const getGradientColor = (isDarkMode: boolean) => {
  return {
    gradientPrimary: isDarkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    gradientSecondary: isDarkMode
      ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
      : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
  };
};

// WBS 타입별 색상 (다크모드 지원)
export const getWBSTypeColor = (type: string, isDarkMode: boolean) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    PROJECT: {
      bg: isDarkMode ? '#1e293b' : '#f8fafc',
      text: isDarkMode ? '#cbd5e1' : '#334155',
      border: isDarkMode ? '#475569' : '#cbd5e1'
    },
    GATE: {
      bg: isDarkMode ? '#1e3a8a' : '#eff6ff',
      text: isDarkMode ? '#93c5fd' : '#2563eb',
      border: isDarkMode ? '#1e40af' : '#3b82f6'
    },
    PHASE: {
      bg: isDarkMode ? '#581c87' : '#faf5ff',
      text: isDarkMode ? '#d8b4fe' : '#9333ea',
      border: isDarkMode ? '#6b21a8' : '#a855f7'
    },
    TASK: {
      bg: isDarkMode ? '#166534' : '#f0fdf4',
      text: isDarkMode ? '#86efac' : '#16a34a',
      border: isDarkMode ? '#15803d' : '#22c55e'
    },
    MILESTONE: {
      bg: isDarkMode ? '#422006' : '#fefce8',
      text: isDarkMode ? '#fde047' : '#ca8a04',
      border: isDarkMode ? '#713f12' : '#eab308'
    }
  };

  return colors[type] || colors.PROJECT;
};

// Progress 색상 (다크모드 지원)
export const getProgressColor = (progress: number, isDarkMode: boolean) => {
  if (progress >= 80) {
    return isDarkMode ? '#22c55e' : '#10b981';
  } else if (progress >= 50) {
    return isDarkMode ? '#60a5fa' : '#3b82f6';
  } else if (progress >= 30) {
    return isDarkMode ? '#fbbf24' : '#f59e0b';
  } else {
    return isDarkMode ? '#f87171' : '#ef4444';
  }
};

// Status 색상 (다크모드 지원)
export const getStatusColor = (status: string, isDarkMode: boolean) => {
  const statusColors: Record<string, { bg: string; text: string }> = {
    'In Progress': {
      bg: isDarkMode ? '#1e3a8a' : '#dbeafe',
      text: isDarkMode ? '#93c5fd' : '#1e40af'
    },
    Completed: {
      bg: isDarkMode ? '#166534' : '#dcfce7',
      text: isDarkMode ? '#86efac' : '#15803d'
    },
    Pending: {
      bg: isDarkMode ? '#713f12' : '#fef3c7',
      text: isDarkMode ? '#fde047' : '#a16207'
    },
    Delayed: {
      bg: isDarkMode ? '#7f1d1d' : '#fee2e2',
      text: isDarkMode ? '#fca5a5' : '#991b1b'
    }
  };

  return statusColors[status] || statusColors['Pending'];
};

// Pace 색상 (다크모드 지원)
export const getPaceColor = (pace: number, isDarkMode: boolean) => {
  if (pace > 15) {
    return isDarkMode ? '#22c55e' : '#10b981';
  } else if (pace > 5) {
    return isDarkMode ? '#60a5fa' : '#3b82f6';
  } else if (pace >= 0) {
    return isDarkMode ? '#fbbf24' : '#f59e0b';
  } else {
    return isDarkMode ? '#f87171' : '#ef4444';
  }
};
