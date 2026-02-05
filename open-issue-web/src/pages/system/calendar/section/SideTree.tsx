import SlideableTree, { SlideableIndependentProps } from 'components/treeView/Slideable';
import { Box, TextField } from '@mui/material';
import { withSimpleSearchForm } from 'components/form/SimpleForm';
import { MenuOutlined, SearchOutlined } from '@ant-design/icons';
import CommonButton from 'components/buttons/CommonButton';
import { useTheme } from '@mui/material';
import useDefaultDate from 'hooks/useDefaultDate';
import SimpleTree, { SimpleTreeViewProps, SimpleTreeViewRef } from 'components/treeView/SimpleTree';
import { forwardRef } from 'react';

const SlideTreeSearchBar = withSimpleSearchForm<any>(({ btnActions, formikProps }) => (
  <>
    <CommonButton title="닫기" variant="contained" onClick={() => btnActions.slideClose()} icononly="true" icon={<MenuOutlined />} />
    <TextField
      name="asdocTitle"
      placeholder="search"
      value={formikProps.values.asdocTitle}
      onChange={formikProps.handleChange}
      sx={{ flex: 1 }}
    />
    <CommonButton title="검색" variant="standard" onClick={() => formikProps.submitForm()} icononly="true" icon={<SearchOutlined />} />
  </>
));

const SideTree = SlideableTree(
  forwardRef<SimpleTreeViewRef, SimpleTreeViewProps & SlideableIndependentProps>(({ setChecked, ...props }, ref) => {
    const { palette } = useTheme();

    const { start, end } = useDefaultDate();

    const btnActions = {
      slideClose: () => setChecked(false)
    };

    return (
      <Box
        sx={{
          borderRight: `1px solid ${palette.divider}`,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          p: 1
        }}
      >
        <SlideTreeSearchBar
          btnActions={btnActions}
          initialValues={{ startDate: start, endDate: end }}
          direction="start"
          useTitle={false}
          onSubmit={() => {}}
        />
        <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <SimpleTree {...props} ref={ref} />
        </Box>
      </Box>
    );
  })
);

export default SideTree;
