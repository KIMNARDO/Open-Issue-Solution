import { faCheck, faMinus, faPlus, faSave, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AgGridReact } from 'ag-grid-react';
import { bdefineQueryOptions } from 'api/bdefine/bdefine.query';
import { commonNotification } from 'api/common/notification';
import { queryOptions } from 'api/qms/open-issue/openIssue.query';
import { OpenissueGroup, OpenissueGroupCategory, OpenIssueRelationship } from 'api/qms/open-issue/openIssue.types';
import openIssueService from 'api/qms/open-issue/openIssueService';
import { useUpdateGroupStatus } from 'api/qms/open-issue/useOpenIssueService';
import CommonButton from 'components/buttons/CommonButton';
import { getGridComboBoxOptions } from 'components/cellEditor/SelectEditor';
import { ButtonOverrideProps } from 'components/dialogs/BasicDialog';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import CommonGrid from 'components/grid/CommonGrid';
import { ExColDef, ExColGroupDef } from 'components/grid/grid.types';
import { useEditGrid } from 'components/grid/useEditGrid';
import FormInput from 'components/input/FormInput';
import KeywordInput from 'components/input/KeywordInput';
import { TreeNode } from 'components/treeView/SimpleTree';
import { ManageRoleType, OpenIssueGroupStatus } from 'constant/openIssueConst';
import UserSelectDialog from 'dialogs/UserSelectDialog';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { diffArrays } from 'utils/commonUtils';
import { handleServerError } from 'utils/error';

export interface IssueCategoryDialogRef {
  open: () => void;
  openRegist: () => void;
  close: () => void;
}

interface IssueCategoryDialogProps {
  onSave: (values: OpenissueGroup) => void;
  onRegist: (values: Partial<OpenissueGroup>) => void;
  selectedGroup?: number;
  selectedPlace?: string;
}

interface CategoryFormValues {
  category: string;
  status: string;
  managers: Partial<OpenIssueRelationship>[];
  categories: OpenissueGroupCategory[];
  ord?: string;
}

const IssueCategoryDialog = forwardRef<IssueCategoryDialogRef, IssueCategoryDialogProps>(
  ({ onSave, onRegist, selectedGroup, selectedPlace }, ref) => {
    const { BasicDialog: UserSelectBasicDialog, handleOpen: handleUserSelectOpen, handleClose: handleUserSelectClose } = useBasicDialog();
    const { BasicDialog, handleOpen, handleClose } = useBasicDialog();
    const [mode, setMode] = useState<'DETAIL' | 'REGIST'>('DETAIL');

    const gridRef = useRef<AgGridReact>(null);
    const previousMemberRef = useRef<Partial<OpenIssueRelationship>[]>([]);
    const previousTypesRef = useRef<OpenissueGroupCategory[]>([]);

    const { hasAuth } = useAuth();

    const { onUpdateCells } = useEditGrid(gridRef);

    const { data: roleList } = useQuery({
      ...bdefineQueryOptions.list({ type: 'ROLE', module: 'OPENISSUE' })
    });

    const { data, refetch } = useQuery({
      ...queryOptions.openIssueGroupDetail(selectedGroup ?? -1),
      enabled: mode === 'DETAIL' && !!selectedGroup && selectedGroup > 0
    });
    const { data: categories } = useQuery({
      ...queryOptions.openIssueGroupCategory(selectedGroup ?? -1),
      enabled: mode === 'DETAIL' && !!selectedGroup && selectedGroup > 0
    });

    const { mutate: updateGroupStatus } = useUpdateGroupStatus();

    const isEditable = useMemo(() => {
      if (mode === 'REGIST') return true;
      if (!data) return false;
      return hasAuth({ authTargetDiv: 'OWNER', authNm: 'Modify' }, data);
    }, [data, mode]);

    const isPromotable = useMemo(() => {
      if (mode === 'REGIST') return true;
      if (!data) return false;
      return hasAuth({ authTargetDiv: 'OWNER', authNm: 'Promote' }, data);
    }, [data, mode]);

    const formikProps = useFormik<CategoryFormValues>({
      initialValues: {
        category: '',
        status: '',
        managers: [],
        categories: [],
        ord: ''
      },
      onSubmit: ({ category, managers, ord, categories }) => {
        // 담당자
        const { add, remove } = diffArrays(previousMemberRef.current, managers || [], 'oid');
        const added = add.map((el) => ({ ...el, action: 'A' }));
        const removed = remove.map((el) => ({ ...el, action: 'D' }));
        const updated = previousMemberRef.current
          .filter((el) => el.isUpdated)
          .map((el) => {
            return { ...el, action: 'U' };
          });

        // 카테고리
        const { add: addCategories, remove: removeCategories } = diffArrays(previousTypesRef.current, categories || [], 'value');
        const addedCategories = addCategories.map((el) => ({ ...el, action: 'A' }));
        const removedCategories = removeCategories.map((el) => ({ ...el, action: 'D' }));

        const payload = {
          name: category,
          openIssueRelationship: added.concat(removed).concat(updated),
          groupCategory: addedCategories.concat(removedCategories),
          ord: parseInt(ord || '0')
        };

        switch (mode) {
          case 'DETAIL':
            if (!data) return;
            onSave({ ...data, ...payload });
            break;
          case 'REGIST':
            onRegist({ ...payload });
            break;
        }
      }
    });

    const handleDeleteManagers = () => {
      if (!gridRef.current?.api) return;
      const selectedNodes = gridRef.current.api.getSelectedNodes();
      if (selectedNodes.length < 1) {
        commonNotification.warn('삭제할 사용자를 선택해주세요');
        return;
      }
      const selectedData = selectedNodes.map((node) => node.data);
      formikProps.setFieldValue(
        'managers',
        formikProps.values.managers.filter((el) => !selectedData.some((node) => node?.oid === el?.oid))
      );
    };

    const handleAddManagers = (nodes: TreeNode[]) => {
      const hasDept = nodes.some((node) => !node.data);
      if (hasDept) {
        commonNotification.warn('부서는 등록할 수 없습니다.');
        return;
      }
      // exist check
      const currentManagers = formikProps.values.managers;
      const isExist = currentManagers.some((el) => nodes.some((node) => node.data?.oid === el?.toOID));
      if (isExist) {
        commonNotification.warn(`이미 존재하는 사용자입니다. ${nodes.map((node) => node.data?.name).join(', ')}`);
        return;
      }

      const selected = nodes.map<Partial<OpenIssueRelationship>>((node) => ({
        toOID: node.data?.oid,
        personNm: node.data?.name,
        departmentNm: node.data?.departmentNm,
        roleOid: ManageRoleType.MANAGER
      }));
      if (!selected || selected.length < 1) {
        commonNotification.warn('사용자를 선택해주세요.');
        return;
      }

      const existUserOids = formikProps.values.managers
        .filter((user) => selected.some((el) => el?.oid === user.oid))
        .map((user) => user.oid);

      formikProps.setFieldValue('managers', [
        ...formikProps.values.managers,
        ...selected.filter((el) => !existUserOids.includes(el?.oid || -1))
      ]);
    };

    const handleChangeCategories = (value: string[]) => {
      formikProps.setFieldValue(
        'categories',
        value.map<OpenissueGroupCategory>((el) => ({ oid: -1, openIssueGroupCategoryOid: selectedGroup || -1, value: el }))
      );
    };

    const handleProgress = () => {
      if (!data) return;
      updateGroupStatus(
        { ...data, groupStatus: 'Prepare' },
        {
          onSuccess: () => {
            commonNotification.success('처리되었습니다');
            refetch();
          },
          onError: (error) => handleServerError(error)
        }
      );
    };

    const handleComplete = () => {
      if (!data) return;
      updateGroupStatus(
        { ...data, groupStatus: 'Completed' },
        {
          onSuccess: () => {
            commonNotification.success('처리되었습니다');
            refetch();
          },
          onError: (error) => handleServerError(error)
        }
      );
    };

    const updateData = () => {
      if (data && mode === 'DETAIL') {
        formikProps.setValues({
          category: data.name,
          status: data.bpolicy.statusNm,
          managers: data.openIssueRelationship || [],
          ord: data.ord?.toString() || '',
          categories: categories || []
        });
        if (previousMemberRef.current) {
          previousMemberRef.current = data.openIssueRelationship || [];
        }
        if (previousTypesRef.current) {
          previousTypesRef.current = categories || [];
        }
      }
    };

    const columns = useMemo<(ExColDef | ExColGroupDef)[]>(() => {
      return [
        { field: 'no', headerName: 'No', cellDataType: 'index' },
        { field: 'personNm', headerName: '이름', editable: false },
        { field: 'departmentNm', headerName: '부서', editable: false },
        {
          field: 'roleOid',
          headerName: '역할',
          // cellEditor: GridSelectEditor,
          // valueFormatter: GridSelectFormatter,
          editable: true,
          ...getGridComboBoxOptions((roleList || []).map((el) => ({ label: el.description || '-', value: el.oid.toString() })))
        }
      ];
    }, [roleList]);

    const overrideButtons: ButtonOverrideProps[] = [
      {
        btnLabel: '닫기',
        btnAction: handleClose,
        btnOptions: {
          variant: 'outlined',
          startIcon: <FontAwesomeIcon icon={faXmark} />
        }
      },
      ...(mode === 'DETAIL' && isPromotable
        ? ([
            {
              btnLabel: '진행',
              btnAction: handleProgress,
              btnOptions: {
                variant: 'outlined',
                startIcon: <FontAwesomeIcon icon={faCheck} />,
                sx: {
                  display: data?.bpolicyOID === OpenIssueGroupStatus.PREPARE ? 'none' : undefined
                }
              }
            },
            {
              btnLabel: '완료',
              btnAction: handleComplete,
              btnOptions: {
                variant: 'outlined',
                startIcon: <FontAwesomeIcon icon={faCheck} />,
                sx: {
                  display: data?.bpolicyOID === OpenIssueGroupStatus.COMPLETE ? 'none' : undefined
                }
              }
            }
          ] satisfies ButtonOverrideProps[])
        : []),
      ...(isEditable || mode === 'REGIST'
        ? ([
            {
              btnLabel: '저장',
              btnAction: () => {
                formikProps.submitForm();
              },
              btnOptions: {
                variant: 'contained',
                startIcon: <FontAwesomeIcon icon={faSave} />
              }
            }
          ] satisfies ButtonOverrideProps[])
        : [])
    ];

    const openRegist = async () => {
      if (!selectedPlace) return;
      handleOpen();
      setMode('REGIST');
      const defaultMembers = await openIssueService.getMemberDefault(selectedPlace);
      formikProps.resetForm({ values: { managers: defaultMembers } as CategoryFormValues });
      previousMemberRef.current = [];
      previousTypesRef.current = [];
    };

    useImperativeHandle(ref, () => ({
      open: () => {
        setMode('DETAIL');
        handleOpen();
      },
      openRegist,
      close: () => handleClose()
    }));

    useEffect(() => {
      updateData();
    }, [data, categories]);

    return (
      <BasicDialog
        overrideButtons={overrideButtons}
        options={{
          title: '이슈카테고리 상세',
          confirmText: '저장',
          cancelText: '닫기'
        }}
        handleConfirm={() => {
          formikProps.submitForm();
        }}
        closeCallback={() => {
          updateData();
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 3, width: '30vw', height: '55vh' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInput
                name="category"
                label="이슈명"
                defaultValue={formikProps.values.category || ''}
                onBlur={formikProps.handleChange}
                variant="outlined"
                disabled={!isEditable}
              />
            </Grid>
            <Grid item xs={6}>
              <FormInput name="status" label="상태" value={formikProps.values.status || ''} variant="outlined" disabled />
            </Grid>
            <Grid item xs={6}>
              <FormInput
                name="ord"
                label="순서"
                defaultValue={formikProps.values.ord || ''}
                onBlur={formikProps.handleChange}
                variant="outlined"
                disabled={!isEditable}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>카테고리</Typography>
              <KeywordInput
                value={formikProps.values.categories?.map((el) => el.value)}
                onChange={handleChangeCategories}
                disabled={!isEditable}
              />
            </Grid>
          </Grid>
          <br />
          <Box display="flex" flexDirection="column" flex={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography>담당자</Typography>
              {isEditable && (
                <Stack direction="row" justifyContent="flex-end" spacing={1} py={1}>
                  <CommonButton
                    title="삭제"
                    icon={<FontAwesomeIcon icon={faMinus} />}
                    variant="outlined"
                    color="error"
                    onClick={handleDeleteManagers}
                    size="small"
                  />
                  <CommonButton
                    title="추가"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    variant="contained"
                    onClick={handleUserSelectOpen}
                    size="small"
                  />
                </Stack>
              )}
            </Box>

            <CommonGrid
              ref={gridRef}
              style={{ overflow: 'auto' }}
              gridProps={{
                rowData: formikProps.values.managers || [],
                columnDefs: columns,
                rowSelection: { mode: 'multiRow', checkboxes: true },
                onCellValueChanged: onUpdateCells
              }}
            />
          </Box>
          <UserSelectDialog
            BasicDialog={UserSelectBasicDialog}
            handleClose={handleUserSelectClose}
            onConfirm={handleAddManagers}
            multiSelect
          />
        </Box>
      </BasicDialog>
    );
  }
);

export default IssueCategoryDialog;
