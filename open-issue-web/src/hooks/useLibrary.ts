import { DLibrary } from 'api/system/library/library.types';
import { SelectboxType } from 'components/select/selectbox.types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type LibraryKeys =
  | 'issueState'
  | 'issueType'
  | 'item'
  | 'oem'
  | 'openIssueType'
  | 'placeOfIssue'
  | 'productionSite'
  | 'nation'
  | 'jobGroupOID'
  | 'jobTitle'
  | 'jobPositionOID'
  | 'customer'
  | 'URGENCY'
  | 'IMPORTANCE'
  | 'PRODUCT_TYPE'
  | 'DOC_STATUS'
  | 'RANK'
  | 'DEPARTMENT'
  | 'APPROVAL_ROLE'
  | 'APPROVAL_ORD'
  | 'DEPLOYMENT_TYPE'
  | 'CAUSE_OF_FAULT'
  | 'PJT_APPROVAL_TYPE'
  | 'PJT_DOC_ST'
  | 'PJT_DOC_TYPE'
  | 'QMS_TYPE'
  | 'QMS_TYPE_REV'
  | 'QMS_NAME'
  | 'PARTDRW_TYPE'
  | 'PRESSURE_LEVEL'
  | 'DRWCHANGE_DRWTYPE'
  | 'DRWCHANGE_CHANGETYPE'
  | 'USE_YN';

const initMap: Record<LibraryKeys, []> = {
  issueState: [],
  issueType: [],
  item: [],
  oem: [],
  openIssueType: [],
  placeOfIssue: [],
  productionSite: [],
  customer: [],
  nation: [],
  jobGroupOID: [],
  jobTitle: [],
  jobPositionOID: [],
  URGENCY: [],
  IMPORTANCE: [],
  PRODUCT_TYPE: [],
  DOC_STATUS: [],
  RANK: [],
  DEPARTMENT: [],
  APPROVAL_ROLE: [],
  APPROVAL_ORD: [],
  DEPLOYMENT_TYPE: [],
  CAUSE_OF_FAULT: [],
  PJT_APPROVAL_TYPE: [],
  PJT_DOC_ST: [],
  PJT_DOC_TYPE: [],
  QMS_TYPE: [],
  QMS_TYPE_REV: [],
  QMS_NAME: [],
  PARTDRW_TYPE: [],
  PRESSURE_LEVEL: [],
  DRWCHANGE_DRWTYPE: [],
  DRWCHANGE_CHANGETYPE: [],
  USE_YN: []
};

interface LibraryStore {
  library: Record<LibraryKeys, DLibrary[]>;

  /**@description Selectbox용 라이브러리 데이터*/
  librarySelect: Record<LibraryKeys, SelectboxType[]>;

  setLibrary: (library: Record<LibraryKeys, DLibrary[]>) => void;
  setSingleLibrary: (key: LibraryKeys, library: DLibrary[]) => void;
}

// type ParseLibarayType = 'default' | 'select';

// const parseLibary = (library: Library[], type: ParseLibarayType = 'default') => {
//   try {
//     if (library.length === 0) {
//       throw new Error('useLibrary: Library is empty');
//     }

//     const resultMap: Record<string, (Library | SelectboxType)[]> = {};
//     const groupMap = library.filter((el) => !el.parentCode).map(({ oid, code }) => ({ oid, code }));

//     if (type === 'select') {
//       for (const lib of library.filter((el) => el.parentCode)) {
//         const key = groupMap.find((el) => el.oid.toString() === lib.parentCode?.toString())?.code;
//         if (key) {
//           !resultMap[key] && (resultMap[key] = []);
//           resultMap[key].push({ value: lib.code, label: lib.codeNm });
//         }
//       }
//     } else {
//       for (const lib of library.filter((el) => el.parentCode)) {
//         const key = groupMap.find((el) => el.oid.toString() === lib.parentCode?.toString())?.code;
//         if (key) {
//           !resultMap[key] && (resultMap[key] = []);
//           resultMap[key].push(lib);
//         }
//       }
//     }

//     return resultMap;
//   } catch (error) {
//     if (error instanceof Error) {
//       // console.error(error.message);
//       return {};
//     }
//   }
// };

/**
 * 라이브러리(공통 코드) 전역 상태 관리 훅
 * @description 사용할 라이브러리 코드를 {@link LibraryKey}, {@link initLibrary} 에 추가해서 사용
 * @field {@link LibraryStore.library} 라이브러리 데이터
 * @field {@link LibraryStore.librarySelect} Selectbox 라이브러리 데이터
 * @example 
 * const { library, librarySelect } = useLibrary();
 * 
 * useEffect(() => {
     console.log(library);
     console.log(librarySelect['DEPARTMENT']);
   }, [library, librarySelect]);
 */
const useLibrary = create<LibraryStore, [['zustand/persist', unknown]]>(
  persist(
    (set) => ({
      library: initMap,
      librarySelect: initMap,
      setLibrary: (library) =>
        set({
          library: library,
          librarySelect: Object.entries(library).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: value.map((el) => ({ value: el.oid, label: el.korNm! }))
            }),
            {} as Record<LibraryKeys, SelectboxType[]>
          )
        }),
      setSingleLibrary: (key, newLibrary) =>
        set(({ library, librarySelect }) => ({
          library: {
            ...library,
            [key]: newLibrary
          },
          librarySelect: {
            ...librarySelect,
            [key]: newLibrary.map((el) => ({ value: el.oid, label: el.korNm! }))
          }
        }))
    }),
    {
      name: 'library-store',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

export default useLibrary;
