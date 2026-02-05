import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

type ExcelRow = {
  [key: string]: string | number | boolean | Date | null;
};

const columnIndexToLetter = (index: number): string => {
  let result = '';
  let n = index;
  while (n >= 0) {
    result = String.fromCharCode((n % 26) + 65) + result;
    n = Math.floor(n / 26) - 1;
  }
  return result;
};

/**
 *
 * @param file excel 파일
 * @param keys 사용할 키
 * @returns A2 ~ ?2 까지의 데이터를 파싱하는 함수 ( javascript 객체 )
 */
export const parseExcelFile = async <T>(file: File, keys: (keyof T)[]): Promise<ExcelRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });

      // 첫 번째 시트만 읽음
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      if (!sheet) {
        reject(new Error('시트를 찾을 수 없습니다.'));
        return;
      }

      // A1:F1 을 헤더로, 그 아래부터 데이터를 추출
      const range = XLSX.utils.decode_range(sheet['!ref']!);
      range.s.r = 1; // 첫 번째 행(A1:F1)은 헤더니까 데이터는 2행부터 시작

      const lastColLetter = columnIndexToLetter(keys.length - 1);
      //   const headerRange = `A1:${lastColLetter}1`;
      const dataRange = `A2:${lastColLetter}${XLSX.utils.decode_range(sheet['!ref']!).e.r + 1}`;

      const dataWithHeader = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        range: dataRange,
        blankrows: false
      });

      // 헤더 추출 (A1 ~ F1)
      //   const headerRow = XLSX.utils.sheet_to_json(sheet, {
      //     header: 1,
      //     range: headerRange,
      //     blankrows: false
      //   })[0] as string[];

      const result = (dataWithHeader as any[][]).map((row) => {
        const obj: { [k: string]: string | number | boolean | null } = {};
        keys.forEach((key, index) => {
          if (typeof row[index] === 'object' && dayjs(row[index]).isValid()) {
            obj[key as string] = dayjs(row[index]).format('YYYY-MM-DD');
          } else if (typeof row[index] === 'boolean') {
            obj[key as string] = String(row[index] ?? '');
          } else {
            obj[key as string] = row[index] ?? null;
          }
        });
        return obj;
      });

      resolve(result);
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
