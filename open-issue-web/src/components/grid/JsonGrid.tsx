import SimpleGrid from './SimpleGrid';
import { ColDef } from 'ag-grid-community';

const getColDefFromJsonData = (data: string) => {
  const result: ColDef[] = [];

  Object.entries(data[0]).forEach(([key, value], index) => {
    result.push({ field: key, headerName: `테스트날짜${index}` });
  });
  return result;
};

interface JsonGridProps {
  jsonData: string;
}

const JsonGrid = ({ jsonData }: JsonGridProps) => {
  const data = JSON.parse(jsonData);
  return <SimpleGrid gridProps={{ rowData: data, columnDefs: getColDefFromJsonData(data), containerStyle: { margin: '10px 0' } }} />;
};

export default JsonGrid;
