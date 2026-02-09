import { Box, Chip, Tooltip } from '@mui/material';
import { useIntl } from 'react-intl';
import { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { RefObject } from 'react';

interface QuickFilterOption {
  id: string;
  labelKey: string;
  filterFn: (data: any) => boolean;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  icon?: React.ReactNode;
}

interface QuickFilterChipsProps {
  gridRef: RefObject<AgGridReact>;
  options?: QuickFilterOption[];
  userId?: number;
}

// 기본 Quick Filter 옵션들
const defaultOptions: QuickFilterOption[] = [
  {
    id: 'all',
    labelKey: 'filter-all',
    filterFn: () => true,
    color: 'default'
  },
  {
    id: 'delayed',
    labelKey: 'filter-delayed',
    filterFn: (data: any) => {
      if (!data.finDt || data.issueState === '78106' || data.issueState === '완료') return false;
      const finDate = new Date(data.finDt);
      const today = new Date();
      return finDate < today;
    },
    color: 'error'
  },
  {
    id: 'urgent',
    labelKey: 'filter-urgent',
    filterFn: (data: any) => data.importance === '5',
    color: 'error'
  },
  {
    id: 'open',
    labelKey: 'filter-open-only',
    filterFn: (data: any) => {
      return data.issueState === '78102' || data.issueState === '진행' || data.issueState === '진행중';
    },
    color: 'info'
  }
];

const QuickFilterChips = ({ gridRef, options, userId }: QuickFilterChipsProps) => {
  const { formatMessage } = useIntl();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // userId가 있으면 "내 이슈" 필터 추가
  const filterOptions = useMemo(() => {
    const baseOptions = options || defaultOptions;
    if (userId) {
      return [
        ...baseOptions.slice(0, 1), // 'all' 옵션
        {
          id: 'my-issues',
          labelKey: 'filter-my-issues',
          filterFn: (data: any) => data.createUs === userId,
          color: 'primary' as const
        },
        ...baseOptions.slice(1)
      ];
    }
    return baseOptions;
  }, [options, userId]);

  const handleFilterClick = (filter: QuickFilterOption) => {
    setActiveFilter(filter.id);

    if (!gridRef.current?.api) return;

    if (filter.id === 'all') {
      // 모든 필터 해제
      gridRef.current.api.setFilterModel(null);
      gridRef.current.api.onFilterChanged();
      return;
    }

    // 외부 필터 적용
    gridRef.current.api.setGridOption('isExternalFilterPresent', () => filter.id !== 'all');
    gridRef.current.api.setGridOption('doesExternalFilterPass', (node: any) => {
      return filter.filterFn(node.data);
    });
    gridRef.current.api.onFilterChanged();
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', py: 0.5 }}>
      {filterOptions.map((filter) => (
        <Tooltip key={filter.id} title={formatMessage({ id: filter.labelKey })} arrow>
          <Chip
            label={formatMessage({ id: filter.labelKey })}
            size="small"
            color={activeFilter === filter.id ? filter.color : 'default'}
            variant={activeFilter === filter.id ? 'filled' : 'outlined'}
            onClick={() => handleFilterClick(filter)}
            sx={{
              cursor: 'pointer',
              fontWeight: activeFilter === filter.id ? 600 : 400,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 1
              }
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
};

export default QuickFilterChips;
