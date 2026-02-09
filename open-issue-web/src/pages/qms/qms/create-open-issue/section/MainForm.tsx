import { Box, Grid, Typography } from '@mui/material';
import { useProjectList, useProjectWBS } from 'api/pms/usePmsService';
import { IssueValidationType } from 'api/qms/open-issue/openIssue.types';
import { UserValidationType } from 'api/system/user/user.types';
import CommonCheckbox from 'components/checkbox/Checkbox';
import FormDatePicker from 'components/datepicker/FormDatePicker';
import { withSimpleForm } from 'components/form/SimpleForm';
import FormInput from 'components/input/FormInput';
import SearchInput from 'components/input/SearchInput';
import UserSearchInput from 'components/input/UserSearchInput';
import FormSelect from 'components/select/FormSelect';
import { useMemo, useState } from 'react';
import useColumns from '../columns/project.column';
import dayjs from 'dayjs';
import { importanceList } from 'pages/qms/qms/open-issue';
import { SelectboxType } from 'components/select/selectbox.types';
import EditableCombo from 'components/select/EditableCombo';
import { useIntl } from 'react-intl';
import { useSalesOrders } from 'api/sales/useSalesOrderService';
import { useOverlayProgress } from 'hooks/useOverlayProgress';
import useLibrary from 'hooks/useLibrary';

enum ProjectStatus {
  Prepare = 1,
  Started = 2,
  Paused = 3,
  Completed = 4
}

enum ProjectType {
  SALES = 'SALES',
  DEVELOPMENT = 'DEV'
}

export const gateList: SelectboxType[] = [
  { label: 'Gate 1', value: '1' },
  { label: 'Gate 2', value: '2' },
  { label: 'Gate 3', value: '3' },
  { label: 'Gate 4', value: '4' },
  { label: '영업', value: '5' }
];

const MainForm = withSimpleForm<IssueValidationType>(({ formikProps }) => {
  const [currentPjtType, setCurrentPjtType] = useState<ProjectType>(formikProps.values.projectType as ProjectType);

  const { librarySelect } = useLibrary();
  const { formatMessage } = useIntl();

  const { data: projects, isFetching: projectLoading } = useProjectList({ bpolicyOID: ProjectStatus.Started });
  const { data: salesOrders, isFetching: salesOrderLoading } = useSalesOrders({});

  const { data: wbs } = useProjectWBS(formikProps.values.projectOID);

  const { pjtColumns, salesOrderColumns } = useColumns();
  const overlayProgress = useOverlayProgress(projectLoading || salesOrderLoading);

  const selectOptions = useMemo(() => {
    return {
      // issueState: libraries?.issueState.filter((el) => el.korNm && el.oid).map((item) => ({ label: item.korNm!, value: item.oid! })) || [],
      issueType: librarySelect.issueType || [],
      item: librarySelect.item || [],
      oem: librarySelect.oem || [],
      placeOfIssue: librarySelect.placeOfIssue || [],
      productionSite: librarySelect.productionSite || [],
      wbs: wbs?.filter((el) => el.type === 'GATE').map((item) => ({ label: item.name ?? '', value: item.oid! })) || []
    };
  }, [librarySelect, wbs]);

  return (
    <Box marginBottom={1} py={2}>
      {overlayProgress}
      <Grid container spacing={2} columns={11}>
        <Grid item xs={6} md={2} lg={1}>
          <FormSelect
            required
            name="placeOfIssue"
            label={formatMessage({ id: 'label-type' })}
            value={formikProps.values.placeOfIssue || ''}
            onChange={(e) => formikProps.setFieldValue('placeOfIssue', e.target.value)}
            selectProps={{
              items: selectOptions.placeOfIssue,
              hasAllOption: false
            }}
            error={!!formikProps.errors.placeOfIssue}
            helperText={formikProps.errors.placeOfIssue}
          />
        </Grid>
        <Grid item xs={6} md={2} lg={1}>
          <FormSelect
            required
            name="projectType"
            label={formatMessage({ id: 'label-project-type' })}
            value={formikProps.values.projectType}
            onChange={(e) => {
              setCurrentPjtType(e.target.value as ProjectType);
              formikProps.setFieldValue('projectType', e.target.value);
              formikProps.setFieldValue('gate', ProjectType.SALES === e.target.value ? '5' : '1');
            }}
            selectProps={{
              items: [
                { value: ProjectType.SALES, label: '영업' },
                { value: ProjectType.DEVELOPMENT, label: '개발' }
              ],
              hasAllOption: false
            }}
            error={!!formikProps.errors.projectType}
            helperText={formikProps.errors.projectType}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          {currentPjtType == ProjectType.DEVELOPMENT && (
            <SearchInput
              required
              label={formatMessage({ id: 'label-programNm' })}
              value={projects?.filter((el) => el.oid === formikProps.values.projectOID)}
              valueKey="oid"
              displayValue={projects?.filter((el) => el.oid === formikProps.values.projectOID).map((el) => el.name)}
              variant="outlined"
              data={projects || []}
              columns={pjtColumns}
              onSelect={(value) => {
                formikProps.setFieldValue('projectOID', value[0].oid);
                formikProps.setFieldValue('itemNm', selectOptions.item.find((el) => el.value === value[0].itemNo?.toString())?.label);
                formikProps.setFieldValue('oemNm', selectOptions.oem.find((el) => el.value === value[0].oemLibOID?.toString())?.label);
                formikProps.setFieldValue('sop', value[0].massProdDt);
              }}
              error={!!formikProps.errors.projectOID}
              helperText={formikProps.errors.projectOID}
            />
          )}
          {currentPjtType == ProjectType.SALES && (
            <SearchInput
              required
              label={formatMessage({ id: 'label-programNm' })}
              value={salesOrders?.filter((el) => el.oid === formikProps.values.projectOID)}
              valueKey="oid"
              displayValue={salesOrders?.filter((el) => el.oid === formikProps.values.projectOID).map((el) => el.name)}
              variant="outlined"
              data={salesOrders || []}
              columns={salesOrderColumns}
              onSelect={(value) => {
                console.log(value);
                formikProps.setFieldValue('projectOID', value[0].oid);
                formikProps.setFieldValue('itemNm', value[0].itemTypeNm);
                formikProps.setFieldValue('oemNm', value[0].customerNm);
              }}
              error={!!formikProps.errors.projectOID}
              helperText={formikProps.errors.projectOID}
            />
          )}
          {!currentPjtType && (
            <SearchInput
              required
              label={formatMessage({ id: 'label-programNm' })}
              variant="outlined"
              data={[]}
              columns={[]}
              onSelect={() => {}}
              disabled
            />
          )}
        </Grid>
        <Grid item xs={6} md={2} lg={1}>
          <FormSelect
            required
            name="gate"
            label="GATE"
            value={formikProps.values.gate}
            onChange={(e) => formikProps.setFieldValue('gate', e.target.value)}
            selectProps={{
              items: gateList,
              hasAllOption: false
            }}
            error={!!formikProps.errors.gate}
            helperText={formikProps.errors.gate}
            disabled={formikProps.values.projectType === ProjectType.SALES}
          />
        </Grid>
        <Grid item xs={6} md={3} lg={2}>
          <FormSelect
            required
            name="productionSite"
            label={formatMessage({ id: 'label-productionsite' })}
            value={formikProps.values.productionSite || ''}
            onChange={(e) => formikProps.setFieldValue('productionSite', e.target.value)}
            selectProps={{
              items: selectOptions.productionSite,
              hasAllOption: false
            }}
            error={!!formikProps.errors.productionSite}
            helperText={formikProps.errors.productionSite}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6} md={3} lg={2}>
          <FormInput required name="itemNm" label="Item" value={formikProps.values.itemNm || ''} variant="outlined" disabled />
        </Grid>
        <Grid item xs={6} md={3} lg={2}>
          <FormInput
            required
            name="oemNm"
            label={formatMessage({ id: 'label-customer' })}
            value={formikProps.values.oemNm || ''}
            variant="outlined"
            disabled
          />
        </Grid>
        <Grid item xs={6} md={2} lg={1}>
          <EditableCombo
            label="Category"
            value={selectOptions.issueType.find((el) => el.value.toString() === (formikProps.values.issueType ?? '').toString())}
            onChange={(e: any) => formikProps.setFieldValue('issueType', e?.value)}
            options={selectOptions.issueType}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={2} lg={1}>
          <FormInput
            name="issueTypeEtc"
            label={formatMessage({ id: 'label-category-etc' })}
            value={formikProps.values.issueTypeEtc}
            onChange={formikProps.handleChange}
            variant="outlined"
            disabled={formikProps.values.issueType !== '기타'}
          />
        </Grid>
        <Grid item xs={6} md={3} lg={2}>
          <UserSearchInput
            label="predecessors"
            variant="outlined"
            value={formikProps.values.predecessors as unknown as UserValidationType[]}
            onSelect={(value) => {
              formikProps.setFieldValue('predecessors', value);
            }}
            multiSelect={true}
          />
        </Grid>
        <Grid item xs={1}>
          <FormSelect
            name="importance"
            label={formatMessage({ id: 'label-importance' })}
            value={formikProps.values.importance || '1'}
            onChange={(e) => formikProps.setFieldValue('importance', e.target.value)}
            selectProps={{
              items: importanceList,
              hasAllOption: false
            }}
          />
        </Grid>
        <Grid item xs={6} md={3} lg={1.5}>
          <FormDatePicker
            name="strDt"
            label="Start Date"
            error={formikProps.errors.strDt}
            setValue={formikProps.setFieldValue}
            value={formikProps.values.strDt}
          />
        </Grid>
        <Grid item xs={6} md={3} lg={1.5}>
          <FormDatePicker
            name="finDt"
            label="End Date"
            error={formikProps.errors.finDt}
            setValue={formikProps.setFieldValue}
            value={formikProps.values.finDt}
          />
        </Grid>
        <Grid item xs={6} md={2} lg={1}>
          <FormInput
            name="duration"
            label="Duration"
            value={
              formikProps.values.strDt && formikProps.values.finDt
                ? `${dayjs(formikProps.values.finDt).diff(formikProps.values.strDt, 'day')}일`
                : ''
            }
            variant="outlined"
            disabled={true}
          />
        </Grid>
        <Grid item xs={6} md={3} lg={2}>
          <FormDatePicker
            name="sop"
            label="SOP"
            error={formikProps.errors.sop}
            setValue={formikProps.setFieldValue}
            value={formikProps.values.sop}
          />
        </Grid>
        <Grid item xs={6} md={2} lg={1}>
          <FormInput // system: create user
            name="managerNm"
            label={formatMessage({ id: 'label-manager-pm' })}
            value={formikProps.values.managerNm}
            onChange={formikProps.handleChange}
            variant="outlined"
            disabled
          />
        </Grid>
        <Grid item xs={6} md={4} lg={0.5}>
          <Box display={'flex'} flexDirection={'column'}>
            <Typography variant="h6" sx={{ textIndent: 4 }}>
              {formatMessage({ id: 'label-report' })}
            </Typography>
            <CommonCheckbox
              name="management"
              label=""
              value={formikProps.values.management}
              valueFormat={{ true: 'true', false: 'false' }}
              handleChange={(e) => {
                formikProps.setFieldValue('management', e.target.checked ? 'true' : 'false');
              }}
              size="large"
            />
          </Box>
        </Grid>

        {/* additional row  */}
        <Grid container item spacing={2} xs={12}>
          <Grid item xs={12} md={12} lg={6}>
            <FormInput
              name="description"
              label="Description"
              value={formikProps.values.description}
              onChange={formikProps.handleChange}
              variant="outlined"
              helperText={formikProps.errors.description}
              error={!!formikProps.errors.description}
              multiline
              rows={4}
              InputProps={{
                sx: { height: '100%', py: 0.5, px: 1.5 }
              }}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <FormInput
              name="remark"
              label={formatMessage({ id: 'label-remark' })}
              value={formikProps.values.remark}
              onChange={formikProps.handleChange}
              variant="outlined"
              multiline
              rows={4}
              InputProps={{
                sx: { height: '100%', py: 0.5, px: 1.5 }
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
});

export default MainForm;
