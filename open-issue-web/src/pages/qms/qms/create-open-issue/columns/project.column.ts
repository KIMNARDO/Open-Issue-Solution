import { ExColDef, ExColGroupDef } from 'components/grid/grid.types';
import { useIntl } from 'react-intl';

const useColumns = () => {
  const { formatMessage } = useIntl();

  const pjtColumns: (ExColDef | ExColGroupDef)[] = [
    { field: 'name', headerName: formatMessage({ id: 'col-project-name' }) },
    { field: 'productNm', headerName: formatMessage({ id: 'col-product-name' }) },
    { field: 'projectType', headerName: formatMessage({ id: 'col-project-type' }) }
  ];

  const salesOrderColumns: (ExColDef | ExColGroupDef)[] = [
    { field: 'name', headerName: formatMessage({ id: 'col-erp-no' }) },
    { field: 'pgmNm', headerName: formatMessage({ id: 'col-program' }) },
    { field: 'itemTypeNm', headerName: formatMessage({ id: 'col-itemGroup' }) },
    { field: 'customerNm', headerName: formatMessage({ id: 'col-customer' }) },
    { field: 'statusNm', headerName: formatMessage({ id: 'col-status' }) }
  ];

  return {
    pjtColumns,
    salesOrderColumns
  };
};

export default useColumns;
