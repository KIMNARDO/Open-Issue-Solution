import { GroupAuthKey, User } from 'api/system/user/user.types';
import { BlobPayload, Payload } from '../types/commonUtils.types';
import { SelectboxType } from 'components/select/selectbox.types';

/**
 * 페이로드에서 undefined, null, 'ALL' 값을 제거합니다.
 * @param payload - 처리할 페이로드 객체
 * @returns 정제된 페이로드 객체 또는 null (오류 발생 시)
 */
const convertPayload = (payload: Payload) => {
  try {
    if (typeof payload !== 'object') {
      return payload;
    }

    const keys = Object.keys(payload);
    const values = Object.values(payload);

    const optPayload: Payload = {};

    for (let i = 0; i < keys.length; i++) {
      if (values[i] === undefined || values[i] === null || values[i] === 'ALL') {
        continue;
      }

      optPayload[keys[i]] = values[i];
    }

    return optPayload;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      return null;
    }
  }
};

/**
 * @description 페이로드에서 undefined, null, 'ALL' 값을 제거합니다.
 * @param payload JSON Object
 * @returns 원본 객체에서 [undefined, null] 값이 제외된 객체
 */
export const payloadOptimization = (payload?: Payload | Payload[] | unknown) => {
  if (!payload) {
    return;
  }

  if (Array.isArray(payload)) {
    return payload.map(convertPayload);
  } else {
    return convertPayload(payload);
  }
};

/**
 * @description 전화번호 formatter
 * @param phoneNumber 변환 전 전화번호
 * @returns 변환된 전화번호
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';

  const cleaned = phoneNumber.replace(/\D/g, '').trim();

  if (cleaned.startsWith('02')) {
    if (cleaned.length === 9) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    }
  }

  if (/^(0[3-6]|0[8-9])\d/.test(cleaned)) {
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
  }

  if (/^01[016789]/.test(cleaned) && cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  return phoneNumber;
};

/**
 * 사용자에게 특정 경로에 대한 권한이 있는지 확인합니다.
 * @param user - 사용자 정보
 * @param authkey - 확인할 권한 키
 * @param path - 확인할 경로 (기본값: 현재 경로)
 * @returns 권한 여부 (boolean)
 */
export const getUserAuth = (user: User | null | undefined, authkey: GroupAuthKey, menuCd?: string) => {
  if (!user) {
    return false;
  }

  const auth = user.groupAuthority?.find((f) => f.menuCd === (menuCd ?? window.location.pathname));

  if (auth && authkey) {
    if (auth[authkey] === 'Y') {
      return true;
    }
  }

  return false;
};

/**
 * 데이터를 FormData 형식으로 변환합니다. Blob 데이터 처리에 사용됩니다.
 * @param data - 변환할 데이터
 * @returns FormData 객체 또는 null (유효하지 않은 입력 시)
 */
export const convertToBlobPayload = (data: BlobPayload | unknown) => {
  if (!data) return null;
  if (typeof data !== 'object') return null;
  if (!('data' in data)) {
    return null;
  }

  const formData = new FormData();

  formData.append('data', new Blob([JSON.stringify(data.data)], { type: 'application/json' }));
  // @ts-ignore
  if (data.detail) {
    // @ts-ignore
    formData.append('detail', new Blob([JSON.stringify(data.detail)], { type: 'application/json' }));
  }

  const clone = { ...data };
  delete clone.data;
  //@ts-ignore
  delete clone.detail;

  Object.entries(clone).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof Blob || item instanceof File) {
            formData.append(key, item);
          } else if (typeof item === 'object') {
            formData.append(`${key}[${index}]`, JSON.stringify(item));
          } else {
            formData.append(`${key}[${index}]`, String(item));
          }
        });
      } else if (value instanceof Blob || value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
};

/**
 * Blob 데이터를 파일로 다운로드합니다.
 * @param blob - 다운로드할 Blob 데이터
 * @param fileName - 저장할 파일 이름
 */
export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// convert base64 image to dataurl
export const convertBase64ToDataUrl = (base64: string) => {
  const dataUrl = `data:image/png;base64,${base64}`;
  return dataUrl;
};

// convert base64 image to blob
// export const convertBase64ToBlob = (base64: string) => {
//   const byteString = atob(base64.split(',')[1]);
//   const arrayBuffer = new ArrayBuffer(byteString.length);
//   const uintArray = new Uint8Array(arrayBuffer);
//   for (let i = 0; i < byteString.length; i++) {
//     uintArray[i] = byteString.charCodeAt(i);
//   }
//   return new Blob([uintArray], { type: 'image/png' });
// };
export const printPDFBlob = async (blob: Blob) => {
  const processed = new Blob([await blob.arrayBuffer()], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(processed);

  const printWindow = window.open('', '_blank');

  if (!printWindow) {
    console.error('팝업 차단됨');
    URL.revokeObjectURL(blobUrl);
    return;
  }

  // HTML 문서 작성
  printWindow.document.write(`
    <html>
      <head>
        <title>Print PDF</title>
        <style>
          html, body {
            margin: 0;
            height: 100%;
            overflow: hidden;
          }
          embed {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <embed src="${blobUrl}" type="application/pdf" />
        <script>
          window.addEventListener('afterprint', function () {
            window.close();
          });
          window.onload = function () {
            setTimeout(() => {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();

  // 외부에서도 revoke 처리
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 10000);
};

/**
 * @description 색상이 어두워지는 함수
 * @param colorCode
 * @returns
 */
export const darkenColor = (hexColor: string, percentage?: number) => {
  if (!percentage) {
    percentage = 8;
  }
  // # 제거하고 hex 값만 추출
  const hex = hexColor.replace('#', '');

  // 3자리 hex를 6자리로 확장 (예: #abc -> #aabbcc)
  const fullHex =
    hex.length === 3
      ? hex
          .split('')
          .map((char) => char + char)
          .join('')
      : hex;

  // RGB 값으로 변환
  const r = parseInt(fullHex.substr(0, 2), 16);
  const g = parseInt(fullHex.substr(2, 2), 16);
  const b = parseInt(fullHex.substr(4, 2), 16);

  // 어두워지는 비율 계산 (20%면 0.8을 곱함)
  const darkenFactor = (100 - percentage) / 100;

  // 각 RGB 값에 어두워지는 비율 적용
  const newR = Math.round(r * darkenFactor);
  const newG = Math.round(g * darkenFactor);
  const newB = Math.round(b * darkenFactor);

  // 다시 hex로 변환 (2자리 유지를 위해 padStart 사용)
  const newHex = '#' + newR.toString(16).padStart(2, '0') + newG.toString(16).padStart(2, '0') + newB.toString(16).padStart(2, '0');

  return newHex;
};

export const diffArrays = <T>(previous: T[], current: T[], idKey: keyof T): Record<'add' | 'remove', T[]> => {
  const prevMap = new Map(previous.map((item) => [item[idKey], item]));
  const currMap = new Map(current.map((item) => [item[idKey], item]));

  // 추가된 요소: current에는 있지만 previous에는 없는 것
  const add = current.filter((item) => !prevMap.has(item[idKey]));

  // 삭제된 요소: previous에는 있지만 current에는 없는 것
  const del = previous.filter((item) => !currMap.has(item[idKey]));

  return { add, remove: del };
};

// enum
export const createEnum = (items: Record<string, SelectboxType>) => Object.freeze(items);

export const enumToOptions = (enumObj: object): SelectboxType[] =>
  Object.values(enumObj).map(({ value, label }) => ({
    value,
    label
  }));

export const getLabelByValue = (enumObj: object, value: string) => Object.values(enumObj).find((v) => v.value === value)?.label ?? '';
