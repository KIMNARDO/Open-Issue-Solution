import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { docClassQueryOptions } from 'api/doc-class/docClass.query';
import { DocClassification } from 'api/doc-class/docClass.types';
import { BasicDialogRef } from 'components/dialogs/BasicDialog';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import SimpleTree, { initSimpleTreeNodeByParent, searchTreeNodes, SimpleTreeViewRef, TreeNode } from 'components/treeView/SimpleTree';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface DocClassSearchDialogProps {
  rootOid: number;
  onSelect: (data: DocClassification[]) => void;
}

const DocClassSearchDialog = forwardRef<BasicDialogRef, DocClassSearchDialogProps>(({ rootOid, onSelect }, ref) => {
  const treeRef = useRef<SimpleTreeViewRef>(null);
  const [searchParam] = useState<any>({});
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  const { data } = useQuery(docClassQueryOptions.selectTree(rootOid));

  const { BasicDialog, handleOpen, handleClose } = useBasicDialog();

  const onClassSelect = () => {
    const match = treeRef.current?.getSelectedItem();
    if (!match || !match.data) onSelect([]);
    onSelect([match?.data]);
    handleClose();
  };

  useImperativeHandle(ref, () => ({
    open: () => handleOpen(),
    close: () => handleClose()
  }));

  useEffect(() => {
    const root = data?.find((el) => el.fromOID === null);
    const filtered = data?.filter((el) => el.fromOID !== null);
    if (root) {
      const result = initSimpleTreeNodeByParent(filtered || [], { idKey: 'oid', labelKey: 'name', parentKey: 'fromOID' });
      setTreeData(result);
    }
  }, [data]);

  return (
    <BasicDialog
      options={{
        title: '문서 분류 선택',
        description: '문서 분류를 선택해주세요.',
        contentMaxHeight: '40vh',
        confirmText: '선택'
      }}
      closeCallback={() => {}}
      actionButtons
      handleConfirm={onClassSelect}
    >
      <Box sx={{ width: '15vw', minHeight: '30vh' }}>
        <SimpleTree
          ref={treeRef}
          data={searchTreeNodes(treeData, searchParam.name || '')}
          expandAction="doubleClick"
          onSelect={() => {}}
          useCheck={false}
          isLeaf={(item) => !!item.data}
        />
      </Box>
    </BasicDialog>
  );
});

export default DocClassSearchDialog;
