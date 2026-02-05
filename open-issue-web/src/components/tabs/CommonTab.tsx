import { Box, SxProps, Tab, TabProps, Tabs, Theme } from '@mui/material';
import { ReactNode, SyntheticEvent, useEffect } from 'react';
import useCommonTabStore from './useCommonTabStore';

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
      style={{ height: 'calc(100% - 36px)' }}
    >
      {value === index && (
        <Box
          sx={{
            height: '100%',
            //borderRadius: 1,
            //boxShadow: '0 1px 4px rgba(0, 0, 0, .1)',
            borderTop: '1px solid rgba(0,0,0,0.1)',
            '&>div': { height: '100%' },
            '& .MuiCardContent-root': { height: '100%', overflow: 'hidden' } /* p: 3 */
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
};

export interface CommonTabProps {
  children: ReactNode[];
  tabs: TabProps[];
  key: string;
  sx?: SxProps<Theme>;
}

/**
 *
 * @param children 탭 내부에 들어갈 요소
 * @param tabs 탭 정의
 * @description 공통 탭
 */
export const CommonTab = ({ children, tabs, sx, key }: CommonTabProps) => {
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
    <>
      <Tabs
        key={`custom-tab-${key}`}
        value={tabStatus.activeTab}
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
      </Tabs>
      {children.map((child, index) => (
        <CustomTabPanel key={`${Math.random()}-cust-tabPanel-${index}`} index={tabStatus.activeTab} value={index}>
          {child}
        </CustomTabPanel>
      ))}
    </>
  );
};

export default CommonTab;
