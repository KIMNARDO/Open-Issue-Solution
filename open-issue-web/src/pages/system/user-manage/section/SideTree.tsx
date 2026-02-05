import SlideableTree, { SlideableIndependentProps } from 'components/treeView/Slideable';
import { Box, CircularProgress, TextField } from '@mui/material';
import { withSimpleSearchForm } from 'components/form/SimpleForm';
import { MenuOutlined, SearchOutlined } from '@ant-design/icons';
import CommonButton from 'components/buttons/CommonButton';
import { useTheme } from '@mui/material';
import { forwardRef, useContext } from 'react';
import { UserManageContext } from '..';
import { UserPartialType } from 'api/system/user/user.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import SimpleTree, { SimpleTreeViewProps, SimpleTreeViewRef } from 'components/treeView/SimpleTree';

const SlideTreeSeachrBar = withSimpleSearchForm<UserPartialType>(({ btnActions, formikProps }) => {
  return (
    <Box
      sx={({ palette }) => ({
        backgroundColor: palette.common.white,
        borderBottom: `1px solid ${palette.divider}`,
        width: '100%',
        height: '100%',
        p: 1,
        display: 'flex',
        gap: 1
      })}
    >
      <CommonButton
        title="닫기"
        variant="contained"
        onClick={() => btnActions.slideClose()}
        icononly="true"
        size="small"
        icon={<MenuOutlined />}
      />
      <TextField
        name="name"
        placeholder="검색어를 입력해주세요."
        value={formikProps.values.name}
        onChange={formikProps.handleChange}
        onBlur={formikProps.handleBlur}
        sx={{ flex: 1 }}
        size="small"
      />
      <CommonButton
        title="검색"
        variant="standard"
        onClick={() => formikProps.submitForm()}
        icononly="true"
        icon={<SearchOutlined />}
        size="small"
      />
      <CommonButton
        title="사용자"
        variant="outlined"
        color="primary"
        onClick={btnActions.addUser}
        icon={<FontAwesomeIcon icon={faUserPlus} />}
        size="small"
      />
    </Box>
  );
});

const SlideTree = SlideableTree(
  forwardRef<SimpleTreeViewRef, SimpleTreeViewProps & SlideableIndependentProps>(({ setChecked, isLoading, ...props }, ref) => {
    const { palette } = useTheme();

    const { addUser, handleSlideTreeSearch } = useContext(UserManageContext);

    const btnActions = {
      slideClose: () => setChecked(false),
      addUser
    };

    return (
      <Box
        sx={{
          borderRight: `1px solid ${palette.divider}`,
          height: '100%',
          overflow: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)',
          boxShadow: '4px 0 12px rgba(0,0,0,0.08)'
        }}
      >
        <SlideTreeSeachrBar
          btnActions={btnActions}
          initialValues={{ name: '' }}
          direction="start"
          useTitle={false}
          onSubmit={(values) => {
            handleSlideTreeSearch(values);
          }}
        />
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <SimpleTree {...props} ref={ref} />
        )}
      </Box>
    );
  })
);

export default SlideTree;
