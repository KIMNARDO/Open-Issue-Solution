import { Box, Divider } from '@mui/material';
import MainCard from 'components/MainCard';
import Toolbar from './section/Toolbar';
import MainForm from './section/MainForm';
import { Dispatch, SetStateAction, useRef } from 'react';
import { FormikProps } from 'formik';
import { issueSchema, IssueValidationType } from 'api/qms/open-issue/openIssue.types';
import { OpenIssueMode } from '../open-issue';
import useAuth from 'hooks/useAuth';
import { useInsOpenIssue } from 'api/qms/open-issue/useOpenIssueService';
import { handleServerError } from 'utils/error';
import { commonNotification } from 'api/common/notification';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from 'api/qms/open-issue/openIssue.query';

const formInit: IssueValidationType = issueSchema.cast({});

interface CreateOpenIssueProps {
  setMode: Dispatch<SetStateAction<OpenIssueMode>>;
  selectedGroup: string;
}

const CreateOpenIssue = ({ setMode, selectedGroup }: CreateOpenIssueProps) => {
  const formRef = useRef<FormikProps<IssueValidationType>>(null);

  const queryClient = useQueryClient();

  const { user } = useAuth();

  const { mutate: insOpenIssue } = useInsOpenIssue();

  const toolbarActions = {
    save: () => {
      console.log(formRef.current?.errors);
      formRef.current?.submitForm();
    },
    list: () => {
      setMode('READ');
    }
  };

  const handleFormSubmit = (values: IssueValidationType) => {
    if (values.issueTypeEtc && values.issueTypeEtc.length > 1) {
      values.issueType = values.issueTypeEtc;
    }
    insOpenIssue(
      {
        ...values,
        replaceMembers: values.predecessors?.map((el) => el.oid).join(','),
        openIssueGroup: Number(selectedGroup)
      },
      {
        onSuccess: () => {
          commonNotification.success('등록되었습니다');
          queryClient.invalidateQueries({ queryKey: queryKeys.openIssues() });
          setMode('READ');
        },
        onError: (error) => handleServerError(error)
      }
    );
  };

  return (
    <MainCard>
      <Box p={2}>
        {/* toolbar */}
        <Toolbar title="Open Issue 신규 등록" onSubmit={() => {}} initialValues={{}} btnActions={toolbarActions} />
        <Divider />
        {/* form */}
        <MainForm
          ref={formRef}
          onSubmit={handleFormSubmit}
          initialValues={{ ...formInit, manager: user?.oid?.toString() || '', managerNm: user?.name || '', openIssueType: 'DEV' }}
          validationSchema={issueSchema}
        />
      </Box>
    </MainCard>
  );
};

export default CreateOpenIssue;
