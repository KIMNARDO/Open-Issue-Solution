import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, IconButton, Paper, Tabs, Tab, Button } from '@mui/material';
import { X, Type, Check } from 'lucide-react';
import useConfig from 'hooks/useConfig';
import { useTheme } from '@mui/material';
import { FontSizeMode, ThemeMode } from 'types/config';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  // const { fontSize, setFontSize, fontSizeConfig } = useFontSize();
  const { mode, fontSize, onChangeFontSize } = useConfig();
  const { palette, typography } = useTheme();
  const isDarkMode = mode === ThemeMode.DARK;
  const [activeTab, setActiveTab] = useState(0);
  const [tempFontSize, setTempFontSize] = useState(fontSize);
  const [initialFontSize, setInitialFontSize] = useState(fontSize);

  // 모달이 열릴 때만 초기값 설정
  useEffect(() => {
    if (open) {
      setInitialFontSize(fontSize);
      setTempFontSize(fontSize);
    }
  }, [open]); // fontSize를 의존성에서 제거

  const handleFontSizeChange = (event: React.MouseEvent<HTMLElement>, newSize: FontSizeMode | null) => {
    if (newSize !== null) {
      alert(`버튼 클릭됨! ${tempFontSize} → ${newSize}`);
      setTempFontSize(newSize);
      onChangeFontSize(newSize); // 즉시 적용하여 미리보기
      console.log('🔵 After setFontSize called');
    } else {
      alert('newSize가 null입니다!');
    }
  };

  const handleApply = () => {
    // 이미 즉시 적용되었으므로 그냥 닫기
    onClose();
  };

  const handleClose = () => {
    // 모달 열 때 저장한 초기값으로 복원
    // setFontSize(initialFontSize);
    setTempFontSize(initialFontSize);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: palette.background.primary,
          borderRadius: 2,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `2px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
          background: isDarkMode
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          py: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #121770 0%, #d32f2f 100%)',
              boxShadow: '0 0 8px rgba(18, 23, 112, 0.5)'
            }}
          />
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 700,
              color: palette.text.primary
            }}
          >
            설정
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: palette.text.secondary,
            '&:hover': {
              bgcolor: isDarkMode ? '#334155' : '#e2e8f0',
              color: palette.text.primary
            }
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            mb: 3,
            borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
            '& .MuiTab-root': {
              color: palette.text.secondary,
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'none',
              minHeight: '40px'
            },
            '& .Mui-selected': {
              color: '#121770 !important'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#121770',
              height: '3px',
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          <Tab label="표시" />
          {/* <Tab label="테마" /> */}
        </Tabs>

        {/* Tab 0: Display Settings */}
        {activeTab === 0 && (
          <Box>
            {/* Font Size Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Type size={18} color={palette.text.primary} />
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: palette.text.primary
                  }}
                >
                  글씨 크기
                </Typography>
              </Box>

              {/* 간단한 버튼으로 변경 */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  fullWidth
                  variant={tempFontSize === 'sm' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setTempFontSize('sm');
                    onChangeFontSize('sm');
                  }}
                  sx={{
                    py: 1.5,
                    bgcolor: tempFontSize === 'sm' ? '#121770' : 'transparent',
                    color: tempFontSize === 'sm' ? '#ffffff' : palette.text.primary,
                    border: `2px solid ${tempFontSize === 'sm' ? '#121770' : isDarkMode ? '#334155' : '#e2e8f0'}`,
                    '&:hover': {
                      bgcolor: tempFontSize === 'sm' ? '#0d1050' : isDarkMode ? '#1e293b' : '#f8fafc'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Type size={16} />
                    <span>작게</span>
                  </Box>
                </Button>
                <Button
                  fullWidth
                  variant={tempFontSize === 'md' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setTempFontSize('md');
                    onChangeFontSize('md');
                  }}
                  sx={{
                    py: 1.5,
                    bgcolor: tempFontSize === 'md' ? '#121770' : 'transparent',
                    color: tempFontSize === 'md' ? '#ffffff' : palette.text.primary,
                    border: `2px solid ${tempFontSize === 'md' ? '#121770' : isDarkMode ? '#334155' : '#e2e8f0'}`,
                    '&:hover': {
                      bgcolor: tempFontSize === 'md' ? '#0d1050' : isDarkMode ? '#1e293b' : '#f8fafc'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Type size={20} />
                    <span>중간</span>
                  </Box>
                </Button>
                <Button
                  fullWidth
                  variant={tempFontSize === 'lg' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setTempFontSize('lg');
                    onChangeFontSize('lg');
                  }}
                  sx={{
                    py: 1.5,
                    bgcolor: tempFontSize === 'lg' ? '#121770' : 'transparent',
                    color: tempFontSize === 'lg' ? '#ffffff' : palette.text.primary,
                    border: `2px solid ${tempFontSize === 'lg' ? '#121770' : isDarkMode ? '#334155' : '#e2e8f0'}`,
                    '&:hover': {
                      bgcolor: tempFontSize === 'lg' ? '#0d1050' : isDarkMode ? '#1e293b' : '#f8fafc'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Type size={24} />
                    <span>크게</span>
                  </Box>
                </Button>
              </Box>

              {/* 디버깅 정보 표시 */}
              <Box
                sx={{
                  mb: 2,
                  p: 1.5,
                  bgcolor: '#fff3cd',
                  border: '2px solid #ffc107',
                  borderRadius: 1
                }}
              >
                <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#856404', mb: 0.5 }}>🔍 디버깅 정보</Typography>
                <Typography sx={{ fontSize: '10px', color: '#856404' }}>• Context fontSize: {fontSize}</Typography>
                <Typography sx={{ fontSize: '10px', color: '#856404' }}>• Temp fontSize: {tempFontSize}</Typography>
                <Typography sx={{ fontSize: '10px', color: '#856404' }}>• Initial fontSize: {initialFontSize}</Typography>
                <Typography sx={{ fontSize: '10px', color: '#856404' }}>• Body 크기: {typography.body1.fontSize}</Typography>
                <Typography sx={{ fontSize: '10px', color: '#856404' }}>• H3 크기: {typography.h3.fontSize}</Typography>
              </Box>

              {/* Font Size Preview */}
              <Paper
                key={`preview-${fontSize}`}
                sx={{
                  p: 2,
                  bgcolor: isDarkMode ? '#0f172a' : '#f8fafc',
                  border: `2px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                  borderRadius: 2
                }}
              >
                <Typography
                  sx={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: palette.text.secondary,
                    mb: 1.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  미리보기 (현재: {fontSize})
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h3">제목 (Heading) - {typography.h3.fontSize}</Typography>
                  <Typography variant="body1">본문 텍스트 - {typography.body1.fontSize}</Typography>
                  <Typography variant="caption">설명 텍스트 - {typography.caption.fontSize}</Typography>
                </Box>
              </Paper>

              {/* Font Size Details */}
              <Box
                key={`details-${fontSize}`}
                sx={{
                  mt: 1.5,
                  p: 1.5,
                  bgcolor: isDarkMode ? '#1e293b' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                  borderRadius: 1
                }}
              >
                <Typography
                  sx={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: palette.text.secondary,
                    mb: 0.5,
                    textTransform: 'uppercase'
                  }}
                >
                  세부정보
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.5 }}>
                  {Object.entries(typography).map(([key, value]) => (
                    <Box
                      key={key}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        px: 1,
                        py: 0.5,
                        bgcolor: isDarkMode ? '#0f172a' : '#f8fafc',
                        borderRadius: 0.5
                      }}
                    >
                      <Typography sx={{ fontSize: '9px', fontWeight: 600, color: palette.text.secondary }}>{key.toUpperCase()}</Typography>
                      <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#121770' }}>{value.fontSize}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* Tab 1: Theme Settings */}
        {/* dark mode 완벽 지원이 안되어 주석처리함 */}
        {/* {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Monitor size={18} color={palette.text.primary} />
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: palette.text.primary
                }}
              >
                테마 설정
              </Typography>
            </Box>

            <Paper
              sx={{
                p: 3,
                bgcolor: isDarkMode ? '#0f172a' : '#f8fafc',
                border: `2px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isDarkMode ? <Moon size={24} color={palette.text.primary} /> : <Sun size={24} color={palette.text.primary} />}
                <Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 700, color: palette.text.primary }}>
                    {isDarkMode ? '다크 모드' : '라이트 모드'}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: palette.text.secondary }}>
                    {isDarkMode ? '어두운 배경으로 눈의 피로를 줄입니다' : '밝은 배경으로 명확하게 표시합니다'}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={() => onChangeMode(isDarkMode ? ThemeMode.LIGHT : ThemeMode.DARK)}
                sx={{
                  bgcolor: isDarkMode ? '#334155' : '#e2e8f0',
                  color: palette.text.primary,
                  '&:hover': {
                    bgcolor: isDarkMode ? '#475569' : '#cbd5e1',
                    transform: 'rotate(180deg)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>
            </Paper>
          </Box>
        )} */}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            color: palette.text.primary,
            '&:hover': {
              bgcolor: isDarkMode ? '#334155' : '#e2e8f0'
            }
          }}
        >
          취소
        </Button>
        <Button
          onClick={handleApply}
          sx={{
            color: '#121770',
            '&:hover': {
              bgcolor: '#0d1050'
            }
          }}
        >
          <Check size={16} />
          적용
        </Button>
      </DialogActions>
    </Dialog>
  );
}
