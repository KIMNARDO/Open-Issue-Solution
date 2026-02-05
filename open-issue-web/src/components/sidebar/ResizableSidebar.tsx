import { Typography, Tooltip, IconButton, Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Resizable } from 're-resizable';
import React, { ReactNode, useState } from 'react';

interface ResizableSidebarProps {
  menuItems: ResizableSidebarItem[];
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
  sidebarWidth?: number;
  HeaderContent?: ReactNode;
}

interface ResizableSidebarItem {
  label: string;
  icon: React.ReactNode;
  value: string;
}

const ResizableSidebar = ({ sidebarWidth = 180, menuItems = [], selectedMenu, setSelectedMenu, HeaderContent }: ResizableSidebarProps) => {
  const [innerSidebarWidth, setInnerSidebarWidth] = useState(sidebarWidth);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  return (
    <Resizable
      size={{ width: sidebarExpanded ? innerSidebarWidth : 70, height: '100%' }}
      onResizeStop={(_e, _direction, _ref, d) => {
        if (sidebarExpanded) {
          const newWidth = innerSidebarWidth + d.width;
          if (newWidth >= 100) {
            setInnerSidebarWidth((prev) => prev + d.width);
          }
        }
      }}
      enable={{
        right: sidebarExpanded
      }}
      minWidth={sidebarExpanded ? 80 : 70}
      maxWidth={sidebarExpanded ? 500 : 70}
    >
      <Box
        sx={{
          height: '100%',
          background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)',
          borderRight: '1px solid #e0e0e0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 12px rgba(0,0,0,0.08)'
        }}
      >
        {/* Sidebar Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarExpanded ? 'space-between' : 'center',
            p: 1.8,
            borderBottom: '2px solid #e0e0e0',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
          }}
        >
          {sidebarExpanded && sidebarWidth > 120 && (
            <>
              {HeaderContent ? (
                HeaderContent
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #121770 0%, #d32f2f 100%)',
                      boxShadow: '0 0 6px rgba(18, 23, 112, 0.4)'
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#121770'
                    }}
                  >
                    메뉴
                  </Typography>
                </Box>
              )}
            </>
          )}
          <Tooltip title={sidebarExpanded ? '메뉴 접기' : '메뉴 펼치기'} placement="right" arrow>
            <IconButton
              size="small"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              sx={{
                background: 'linear-gradient(135deg, #121770 0%, #1a2480 100%)',
                color: 'white',
                width: 30,
                height: 30,
                '&:hover': {
                  background: 'linear-gradient(135deg, #0d1050 0%, #121770 100%)'
                }
              }}
            >
              {sidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Menu Items */}
        <Box sx={{ flex: 1, overflowY: 'auto', py: 1.5, px: 1 }}>
          {menuItems.map((item) => {
            const isSelected = selectedMenu === item.value;
            const showText = sidebarWidth > 120;

            const menuButton = (
              <Box
                key={item.label}
                onClick={() => setSelectedMenu(item.value)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                  px: sidebarExpanded ? 1.5 : 0,
                  py: 1.3,
                  mb: 0.6,
                  cursor: 'pointer',
                  borderRadius: 1.5,
                  justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                  bgcolor: isSelected ? '#121770' : 'transparent',
                  color: isSelected ? '#ffffff' : '#666',
                  '&:hover': {
                    bgcolor: isSelected ? '#0d1050' : 'rgba(18, 23, 112, 0.08)',
                    color: isSelected ? '#ffffff' : '#121770'
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {React.cloneElement(item.icon as React.ReactElement<{ size: number }>, {
                    size: 18
                  })}
                </Box>
                {sidebarExpanded && showText && (
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: isSelected ? 700 : 600
                    }}
                    color={isSelected ? 'HighlightText' : undefined}
                  >
                    {item.label}
                  </Typography>
                )}
              </Box>
            );

            return !sidebarExpanded ? (
              <Tooltip key={item.label} title={item.label} placement="right" arrow>
                {menuButton}
              </Tooltip>
            ) : (
              menuButton
            );
          })}
        </Box>
      </Box>
    </Resizable>
  );
};

export default ResizableSidebar;
