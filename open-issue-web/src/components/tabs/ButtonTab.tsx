import { Box, Stack, SxProps, Tab, TabProps, Theme } from '@mui/material';
import { ReactNode, SyntheticEvent, useEffect } from 'react';
import useCommonTabStore from './useCommonTabStore';
import { TabContext, TabList } from '@mui/lab';

interface CustomTabPanelProps {
  children: ReactNode;
  value: number;
  index: number;
}

const CustomTabPanel = ({ children, value, index, ...props }: CustomTabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`custom-tabpanel-${index}`}
      aria-labelledby={`custom-tabpanel-${index}`}
      {...props}
      style={{ flex: '0 0 calc(100% - 40px)', maxHeight: 'calc(100% - 40px)', overflow: 'hidden' }}
    >
      {value === index && (
        <Box
          sx={{
            height: '100%',
            borderRadius: 1,
            boxShadow: '0 1px 4px rgba(0, 0, 0, .1)'
            //'&>div': { height: '100%', overflow: 'hidden' },
            //'& .MuiCardContent-root': { height: '100%', overflow: 'hidden' } /* p: 3 */
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
};

export interface ButtonTabProps {
  children: ReactNode[];
  tabs: TabProps[];
  key: string;
  sx?: SxProps<Theme>;
  buttons?: Record<number, ReactNode>;
}

/**
 *
 * @param children 탭 내부에 들어갈 요소
 * @param tabs 탭 정의
 * @description 공통 탭
 */
export const ButtonTab = ({ children, tabs, sx, key, buttons }: ButtonTabProps) => {
  const { tabStatus, setTabStatus } = useCommonTabStore();

  useEffect(() => {
    setTabStatus({ tabName: key, activeTab: 0 });
  }, [key]);

  const handleChange = (_: SyntheticEvent, value: any) => {
    if (tabStatus.tabName === key) {
      setTabStatus({ tabName: key, activeTab: value });
    }
  };

  return (
    <TabContext value={tabStatus.activeTab}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: '0 0 40px'
        }}
      >
        <TabList
          key={`custom-tab-${key}`}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="basic tabs example"
          sx={sx}
        >
          {tabs.map((tab, index) => (
            <Tab
              {...tab}
              key={`custom-tabpanel-${index}`}
              id={`custom-tabpanel-${index}`}
              label={tab.label}
              icon={tab.icon}
              iconPosition={tab.iconPosition}
            />
          ))}
        </TabList>
        {buttons && (
          <Stack display="flex" alignSelf="center">
            {buttons[tabStatus.activeTab]}
          </Stack>
        )}
      </Box>
      {children.map((child, index) => (
        <CustomTabPanel key={`${Math.random()}-cust-tabPanel-${index}`} index={tabStatus.activeTab} value={index}>
          {child}
        </CustomTabPanel>
      ))}
    </TabContext>
  );
};

export default ButtonTab;
