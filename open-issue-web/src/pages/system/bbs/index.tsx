import { Divider, Grid } from '@mui/material';
import SimpleGrid from 'components/grid/SimpleGrid';
import BasicLayout from 'layout/Basic';
import Toolbar from './section/Toolbar';
import { useRef } from 'react';
import { FormikProps } from 'formik';
import { AgGridReact } from 'ag-grid-react';
import BbsDetailToolbar from './section/DetailToolbar';
import DetailForm from './section/DetailForm';
import { Box } from '@mui/material';

const BbsManage = () => {
  const toolbarRef = useRef<FormikProps<any>>(null);
  const gridRef = useRef<AgGridReact<any>>(null);

  return (
    <BasicLayout>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={12} sm={12} md={8} lg={8} display="flex" flexDirection="column">
          <Toolbar ref={toolbarRef} btnActions={{}} onSubmit={(_values) => {}} initialValues={{}} direction="end" />
          <Box sx={{ flex: 1 }}>
            <SimpleGrid
              ref={gridRef}
              gridProps={{
                columnDefs: [],
                rowData: []
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ height: '100%' }}>
          <BbsDetailToolbar btnActions={{}} onSubmit={(_values) => {}} initialValues={{}} direction="end" title="공지사항 상세" />
          <Divider sx={{ marginBottom: 1 }} />
          <DetailForm onSubmit={(_values) => {}} initialValues={{}} />
        </Grid>
      </Grid>
    </BasicLayout>
  );
};

export default BbsManage;
