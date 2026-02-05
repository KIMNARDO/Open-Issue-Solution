import { Box, TextField, useTheme } from '@mui/material';
import CommonButton from 'components/buttons/CommonButton';
import { ButtonOverrideProps } from 'components/dialogs/BasicDialog';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import { withSimpleSearchForm } from 'components/form/SimpleForm';
import { CheckOutlined, ClusterOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import RcTreeView, { RcTreeNode, RcTreeViewRef } from 'components/treeView/RcTreeView';
import { Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useUsers } from 'api/system/user/useUserService';
import { initRcTree, searchTreeNodes } from 'components/treeView/treeUtil';
import { UserPartialType, UserValidationType } from 'api/system/user/user.types';
import CommonGrid from 'components/grid/CommonGrid';
import CommonCheckbox from 'components/checkbox/Checkbox';
import SelectBox from 'components/select/SelectBox';
import { ExColDef, ExColGroupDef, RowDataBase } from 'components/grid/grid.types';
import { useEditGrid } from 'components/grid/useEditGrid';
import { AgGridReact } from 'ag-grid-react';
import GridSelectEditor, { GridSelectFormatter } from 'components/cellEditor/SelectEditor';
import DirectButtonRenderer, { DirectButtonRendererProps } from 'components/cellEditor/DirectAuthButton';
import { getAllRows } from 'components/grid/gridUtils';
import { FormikProps } from 'formik';
import { ApprovalPayload, ApprovalStep } from 'api/user-task/task.types';
import * as y from 'yup';
import { commonNotification } from 'api/common/notification';
import { IRowNode } from 'ag-grid-community';
import { useCreateApprovalLine, useGetApprovalLines } from 'api/user-task/useTaskService';
import { handleServerError } from 'utils/error';
import taskService from 'api/user-task/taskService';

export enum ApprovalStepType {
  AGREE = 'AGREE',
  DIST = 'DIST',
  APPROVE = 'APPROVE'
}

const tempTypeMap = [
  { value: 'AGREE', label: '합의' },
  { value: 'DIST', label: '수신' },
  { value: 'APPROVE', label: '결재' }
];

interface ApprovalUser extends RowDataBase {
  userUid: string | number;
  type: string;
  name: string;
  order: number;
  isGroup?: boolean;
}

interface GridToolbarType {
  parallel: string;
  approvalId: string;
  approvalLineName: string;
}

const contentHeight = '50vh';

const TreeSearchBar = withSimpleSearchForm<UserPartialType>(({ formikProps, btnActions }) => {
  return (
    <>
      <TextField
        name="accountName"
        placeholder="검색어를 입력해주세요"
        value={formikProps.values.name}
        onChange={formikProps.handleChange}
        onBlur={formikProps.handleBlur}
        variant="outlined"
        style={{ flex: 1 }}
      />
      <CommonButton title="검색" variant="outlined" onClick={() => formikProps.submitForm()} icononly="true" icon={<SearchOutlined />} />
      <CommonButton title="선택" variant="outlined" color="primary" onClick={btnActions.select} icon={<CheckOutlined />} />
    </>
  );
});

const GridSearchBar = withSimpleSearchForm<GridToolbarType, { onLineChange: (approvalId: number) => void }>(
  ({ formikProps, onLineChange }) => {
    const { data: approvalLines } = useGetApprovalLines();

    const { BasicDialog: SaveDialog, handleOpen: handleOpenSaveDialog } = useBasicDialog();

    return (
      <>
        <CommonCheckbox
          name="parallel"
          label="병렬"
          value={formikProps.values.parallel}
          valueFormat={{ true: 'Y', false: 'N' }}
          handleChange={(e) => {
            formikProps.setFieldValue('parallel', e.target.checked ? 'Y' : 'N');
          }}
        />
        <SelectBox
          name="approvalId"
          label=""
          value={formikProps.values.approvalId}
          onChange={(e) => {
            formikProps.setFieldValue('approvalId', e.target.value);
            onLineChange(Number(e.target.value));
          }}
          selectProps={{
            items: approvalLines?.map((el) => ({ value: el.uid.toString(), label: el.name })) ?? []
          }}
          style={{ flex: 1, minWidth: 160 }}
        />
        <CommonButton
          title="초기화"
          variant="outlined"
          onClick={() => {
            formikProps.resetForm();
            onLineChange(-1);
          }}
          icononly="true"
          icon={<FontAwesomeIcon icon={faRedo} />}
        />
        <CommonButton
          title="결재선 저장"
          variant="outlined"
          onClick={() => {
            if (formikProps.values.approvalId && formikProps.values.approvalId.length > 0) {
              formikProps.submitForm();
            } else {
              handleOpenSaveDialog();
            }
          }}
          icon={<FontAwesomeIcon icon={faSave} />}
        />
        <SaveDialog
          options={{
            title: '결재선 저장',
            confirmText: '저장',
            cancelText: '취소'
          }}
          actionButtons
          handleConfirm={() => {
            formikProps.submitForm();
          }}
        >
          <Box sx={{ mt: 2 }}>
            <TextField
              name="approvalLineName"
              placeholder="결재선 이름을 입력해주세요"
              variant="outlined"
              onChange={formikProps.handleChange}
              fullWidth
            />
          </Box>
        </SaveDialog>
      </>
    );
  }
);

interface ApprovalDialogProps {
  BasicDialog: ReturnType<typeof useBasicDialog>['BasicDialog'];
  handleClose: ReturnType<typeof useBasicDialog>['handleClose'];
  onConfirm: (payload: Partial<ApprovalPayload>) => void;
}

const rowSchema: y.ObjectSchema<ApprovalUser> = y.object({
  type: y.string().required('역할을 선택해주세요').min(1, '역할을 선택해주세요'),
  name: y.string().required('이름을 입력해주세요'),
  order: y.number().required('순서를 입력해주세요'),
  userUid: y.number().required('사용자Uid를 입력해주세요'),
  isNew: y.boolean(),
  isUpdated: y.boolean(),
  rowIndex: y.number(),
  id: y.string(),
  isError: y.boolean(),
  errorField: y.array(y.string().required()),
  isGroup: y.boolean(),
  path: y.array(y.string().required())
});

const ApprovalDialog = ({ BasicDialog, handleClose, onConfirm }: ApprovalDialogProps) => {
  const [treeData, setTreeData] = useState<RcTreeNode<UserValidationType>[]>([]);
  const [searchParam, setSearchParam] = useState<UserPartialType>({});
  const [gridData, setGridData] = useState<ApprovalUser[]>([]);

  const approvalContentRef = useRef<HTMLInputElement>(null);
  const treeRef = useRef<RcTreeViewRef<UserValidationType>>(null);
  const gridRef = useRef<AgGridReact<ApprovalUser>>(null);
  const gridToolbarRef = useRef<FormikProps<GridToolbarType>>(null);

  const { data } = useUsers(searchParam);

  const { mutate: createApprovalLine } = useCreateApprovalLine();

  const { palette } = useTheme();

  const { onUpdateCells, removeRowNode, getErrorRows } = useEditGrid(gridRef, rowSchema);

  const columns = useMemo<(ExColDef | ExColGroupDef)[]>(
    () => [
      {
        field: 'order',
        headerName: '순서',
        rowDrag: true
      },
      {
        field: 'type',
        headerName: '역할',
        editable: ({ data }) => {
          return !data.isGroup;
        },
        cellEditor: GridSelectEditor,
        valueFormatter: GridSelectFormatter,
        context: {
          selectOption: tempTypeMap
        }
      },
      {
        field: 'name',
        headerName: '이름'
      },
      {
        field: 'deleteBtn',
        headerName: '삭제',
        cellRenderer: (params: DirectButtonRendererProps<unknown>) => {
          return DirectButtonRenderer(params);
        },
        cellRendererParams: {
          title: '삭제',
          color: 'error',
          onClick: (props: any) => {
            removeRowNode(props.node);
          },
          icononly: 'true',
          icon: <FontAwesomeIcon icon={faTrash} />
        }
      }
    ],
    []
  );

  const handleUserSelect = () => {
    const result = treeRef.current?.getCheckedData();
    if (!result || !gridRef.current?.api) return;
    let currentRows = getAllRows(gridRef.current.api);

    // 유저 중복 체크
    const userUidList = result.map((el) => el.key);
    const duplicateUserUidList = currentRows.filter((el) => userUidList.includes(el.userUid));
    if (duplicateUserUidList.length > 0) {
      commonNotification.error(`중복된 사용자를 지정할 수 없습니다. ${duplicateUserUidList.map((el) => el.name).join(', ')}`);
      return;
    }

    const processed = result
      .filter((el) => !!el)
      .map<ApprovalUser>((el, idx) => ({
        userUid: typeof el.key === 'number' ? Number(el.key) : el.key.toString(),
        type: ApprovalStepType.APPROVE || '',
        isGroup: !el.data,
        name: (el.title as string) ?? '',
        order: currentRows.length + (idx + 1),
        isNew: true
      }));

    const newData = currentRows
      .map((el, idx) => ({
        ...el,
        order: idx + 1
      }))
      .concat(processed);

    setGridData(newData);

    treeRef.current?.resetChecked();
  };

  const handleToolbarSubmit = (values: GridToolbarType) => {
    if (!gridRef.current?.api) return;
    const nodes: IRowNode<ApprovalUser>[] = [];
    gridRef.current.api.forEachNode((node) => {
      nodes.push(node);
    });
    const rows = nodes.sort((a, b) => (a.rowIndex ?? 999) - (b.rowIndex ?? 999)).map((node) => node.data!);
    if (rows.length < 1) {
      commonNotification.error('결재선을 지정해주세요.');
      return;
    }

    createApprovalLine(
      {
        approvalLineUid: Number(values.approvalId) || -1,
        approvalLineName: values.approvalLineName,
        steps: (rows || []).map((el, idx) => ({
          userUid: Number(el.userUid),
          userName: el.name,
          type: el.type,
          ord: idx + 1,
          uid: -1,
          approvalUid: -1
        }))
      },
      {
        onSuccess: () => {
          commonNotification.success('결재선이 저장되었습니다');
        },
        onError: (error) => handleServerError(error)
      }
    );
  };

  const onLineChange = async (approvalLineUid: number) => {
    if (!approvalLineUid) return;
    const result = await taskService.getApprovalLineUsers(approvalLineUid);
    if (result && result.length > 0) {
      setGridData(
        result.map((appUser) => ({
          userUid: appUser.userUid,
          type: appUser.type,
          name: appUser.userName,
          order: appUser.ord,
          isNew: true
        }))
      );
    } else {
      setGridData([]);
    }
  };

  const btnActions = {
    select: handleUserSelect
  };

  const overrideButtons: ButtonOverrideProps[] = [
    {
      btnLabel: '결재상신',
      btnOptions: {
        variant: 'contained'
      },
      btnAction: async () => {
        if (!gridRef.current?.api) return;
        const nodes: IRowNode<ApprovalUser>[] = [];
        gridRef.current.api.forEachNode((node) => {
          nodes.push(node);
        });
        const rows = nodes.sort((a, b) => (a.rowIndex ?? 999) - (b.rowIndex ?? 999)).map((node) => node.data!);
        if (rows.length < 1) {
          commonNotification.error('결재선을 지정해주세요.');
          return;
        }

        // 최소 결재자 1인 이상 체크
        const minApprovalCount = rows.filter((el) => el.type === ApprovalStepType.APPROVE).length;
        if (minApprovalCount < 1) {
          commonNotification.error('결재자를 한 명 이상 지정해주세요.');
          return;
        }

        let currentOrder = 1;

        const payload: Partial<ApprovalPayload> = {
          approvalSteps: rows.map<ApprovalStep>((el) => ({
            approvalType: el.type,
            approvalUid: -1,
            approvalUserUid: Number(el.userUid),
            ord: el.type === ApprovalStepType.DIST ? 0 : currentOrder++,
            uid: -1
          })),
          approvalCount: rows.filter((el) => el.type !== ApprovalStepType.DIST).length,
          comment: approvalContentRef.current?.value ?? '',
          parallel: gridToolbarRef.current?.values.parallel === 'Y' ? 'Y' : 'N'
        };
        const errorRows = await getErrorRows();
        if (errorRows.length > 0) {
          commonNotification.error(errorRows[0][0].message);
          return;
        }

        onConfirm(payload);
      }
    }
  ];

  useEffect(() => {
    if (data) {
      const treeData = data.map((el) => initRcTree(el, 'oid', 'grpUid', 'name'));
      setTreeData(treeData);
    }
  }, [data]);

  return (
    <>
      <BasicDialog
        options={{
          title: '결재선 지정',
          description: '결재선을 지정해주세요.'
        }}
        overrideButtons={overrideButtons}
      >
        <Box display="flex" alignItems="center" gap={1} sx={{ width: '40vw', mb: 2, mt: 2 }}>
          <Box sx={{ border: `1px solid ${palette.divider}`, p: 1, flex: 3, height: contentHeight }}>
            <TreeSearchBar
              btnActions={btnActions}
              initialValues={{}}
              direction="end"
              useTitle={false}
              onSubmit={(values) => setSearchParam(values)}
            />
            <Divider color={palette.divider} />
            <Box sx={{ height: 'calc(100% - 44px)', overflow: 'auto' }}>
              <RcTreeView
                ref={treeRef}
                treeData={searchTreeNodes(treeData, searchParam.name ?? '')}
                setTreeData={setTreeData}
                groupIcon={<ClusterOutlined style={{ color: '#E9BA00' }} />}
                itemIcon={<UserOutlined style={{ color: '#61AE89' }} />}
                useCheck
                readonly
                checkStrictly
              />
            </Box>
          </Box>
          <Box
            sx={{
              border: `1px solid ${palette.divider}`,
              height: contentHeight,
              p: 1,
              overflow: 'auto',
              flex: 4,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <GridSearchBar
              initialValues={{ parallel: 'N', approvalId: '', approvalLineName: '' }}
              onSubmit={handleToolbarSubmit}
              onLineChange={onLineChange}
              btnActions={{}}
              useTitle={false}
              ref={gridToolbarRef}
            />
            <Divider color={palette.divider} />
            <Box sx={{ overflow: 'auto', flexDirection: 'column', flex: 1 }}>
              <CommonGrid
                ref={gridRef}
                gridProps={{
                  rowData: gridData,
                  columnDefs: columns,
                  onCellValueChanged: onUpdateCells,
                  rowDragManaged: true
                }}
                style={{ height: '100%' }}
                noDataMsg="지정된 결재선이 없습니다."
              />
            </Box>
          </Box>
        </Box>
        <TextField
          name="approvalContent"
          placeholder="결재내용을 입력해주세요"
          variant="outlined"
          multiline
          rows={2}
          InputProps={{
            style: {
              height: '100%'
            }
          }}
          inputRef={approvalContentRef}
          fullWidth
        />
      </BasicDialog>
    </>
  );
};

export default ApprovalDialog;
