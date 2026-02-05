// tree css
import 'rc-tree/assets/index.css';
import './asset/treeview.css';

import React, {
  Dispatch,
  ForwardedRef,
  KeyboardEventHandler,
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import Tree from 'rc-tree';
import { DataNode, EventDataNode, Key, TreeNodeProps } from 'rc-tree/lib/interface';
import { NodeDragEventParams } from 'rc-tree/lib/contextTypes';

import {
  filterTreeByKeys,
  findByKey,
  findParentByKey,
  flattenItems,
  initReverseTree,
  modifyNode,
  modifyNodeTitleByKey,
  moveDataToChildren,
  moveDataToNextTo,
  setCheckableLevel,
  setIsLeaf,
  setLevel,
  setVisibleChildren
} from './treeUtil';
import { ContextMenu, ContextMenuOption, useContextMenu } from 'hooks/useContextMenu';
import { Box, IconButton } from '@mui/material';
import { v4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { confirmation } from 'components/confirm/CommonConfirm';
import { FileTextOutlined, FolderFilled, FolderOpenFilled, DownOutlined, UpOutlined, MoreOutlined } from '@ant-design/icons';

export interface RcTreeNode<T = any> extends DataNode {
  option?: Record<string, any>;
  newLocation?: [string | undefined, number];
  newTitle?: string;
  children?: RcTreeNode<T>[];
  originChildren?: RcTreeNode<T>[];
  visibleChildren?: number;
  data?: T;
  level?: number;
  type?: string;
  prefix?: string | React.ReactNode;
  customIcon?: React.ReactNode;
  customIconExpanded?: React.ReactNode;
}

/**
 * TreeView Props
 * @param treeData 트리 데이터
 * @param setTreeData 트리 데이터 state set 함수
 * @param readonly Readonly mode
 * @param groupIcon 그룹 노드에 표시할 아이콘
 * @param groupIconExpanded 그룹 노드가 펼쳐졌을 때 표시할 아이콘
 * @param itemIcon leaf 노드에 표시할 아이콘
 * @param expandIcon 펼치기 핸들 아이콘
 * @param collapseIcon 접기 핸들 아이콘
 * @param handleSelect 노드 선택 이벤트
 * @param useCheck 체크박스 사용 여부
 * @param multiCheck 체크박스 다중 선택
 * @param checkStrictly 체크박스 체크 전파 방지
 * @param checkableLevel 체크박스 사용 가능한 레벨
 * @param defaultExpandAll 트리 기본 펼침상태
 * @param isLeaf leaf 노드 여부 ( boolean 리턴 함수 )
 * @param onEdit 노드 편집 이벤트 ( 컨텍스트 메뉴 )
 * @param onDelete 노드 삭제 이벤트 ( 컨텍스트 메뉴 )
 * @param onCheck 체크박스 체크 이벤트
 * @param onMoreButtonClick 더보기 버튼 클릭 이벤트
 * @param displayLevel 트리 표시 레벨(깊이)
 * @param checkOnGroup 체크박스 체크 전파 방지
 * @param loadData 트리 데이터 로드 함수 (Promise 반환)
 */
export interface RcTreeviewProps<T = any> {
  treeData: RcTreeNode<T>[];
  setTreeData: Dispatch<SetStateAction<RcTreeNode<T>[]>>;
  readonly?: boolean;
  groupIcon?: React.ReactNode;
  groupIconExpanded?: React.ReactNode;
  itemIcon?: React.ReactNode;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  handleSelect?: (selected: RcTreeNode<T> | undefined) => void;
  useCheck?: boolean;
  multiCheck?: boolean;
  checkStrictly?: boolean;
  checkableLevel?: '1' | '2' | '3';
  defaultExpandAll?: boolean;
  defaultExpandedKeys?: string[];
  defaultCheckedKeys?: string[];
  defaultSelectedKeys?: string[];
  isLeaf?: (item: RcTreeNode<T>) => boolean;
  onEdit?: (node: RcTreeNode<T>) => void;
  onDelete?: (node: RcTreeNode<T>) => void;
  onCheck?: (checked: RcTreeNode<T>[]) => void;
  onDoubleClick?: (node: RcTreeNode<T>) => void;
  onMoreButtonClick?: () => void;
  displayLevel?: number;
  checkOnGroup?: boolean;
  loadData?: (treeNode: EventDataNode<RcTreeNode<T>>) => Promise<void | EventDataNode<RcTreeNode<any>>>;
  pagination?: boolean;
  cntPerPage?: number;
  getPrefix?: (data: RcTreeNode<T>) => string | React.ReactNode;
}

export interface RcTreeViewRef<T = any> {
  getTreeData: () => RcTreeNode<T>[];
  getCheckedData: () => RcTreeNode<T>[];
  resetChecked: () => void;
  getUpdatedData: () => RcTreeNode<T>[];
  setCheckedKeys: (keys: TreeCheckedKey) => void;
  expandNodeByKey: (key: Key, data?: RcTreeNode<T>[]) => void;
  setSelectedKeys: (keys: Key[]) => void;
  reloadNode: (key: Key) => void;
  expandAll: () => void;
}

type TreeCheckedKey =
  | {
      checked: Key[];
      halfChecked: Key[];
    }
  | Key[];

const MoreButtonNode = ({ onClick }: { onClick: () => void }) => {
  return (
    <Box display="flex" width={'18vw'} justifyContent="center">
      <IconButton onClick={onClick}>
        <MoreOutlined />
      </IconButton>
    </Box>
  );
};

const CustomNode = ({
  editingKey,
  nodeKey,
  onBlur,
  onKeyCancel,
  getPrefix,
  ...node
}: RcTreeNode & {
  editingKey: Key | null;
  nodeKey: Key;
  onBlur?: (value: string) => void;
  onKeyCancel?: () => void;
  getPrefix?: (data: RcTreeNode) => string | React.ReactNode;
}) => {
  const nodeTitle = node.title as React.ReactNode;
  const [currentTitle, setCurrentTitle] = useState(nodeTitle?.toString());
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleShortcuts: KeyboardEventHandler = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      if (editingKey) {
        inputRef.current?.blur();
        return;
      }
    }
    if (e.key === 'Escape' && editingKey) {
      onKeyCancel?.();
      setCurrentTitle(nodeTitle?.toString());
    }
  };

  useEffect(() => {
    if (editingKey === nodeKey) {
      setIsFocused(true);
      inputRef.current?.focus();
    }

    return () => {
      setIsFocused(false);
    };
  }, [editingKey, nodeKey]);

  return (
    <Box>
      {editingKey === nodeKey ? (
        <input
          ref={inputRef}
          type="text"
          name="title"
          value={currentTitle}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => setCurrentTitle(e.target.value)}
          autoFocus
          onBlur={() => {
            if (!onBlur || !isFocused) return;
            onBlur(currentTitle || '');
          }}
          onKeyDown={handleShortcuts}
          style={{ height: '100%', fontSize: '1rem' }}
        />
      ) : (
        <>
          <span style={{ userSelect: 'none' }}>
            {getPrefix?.(node)}
            {nodeTitle}
          </span>
        </>
      )}
    </Box>
  );
};

// const motion = {
//   motionName: 'node-motion',
//   motionAppear: false,
//   onAppearStart: () => ({ height: 0 }),
//   onAppearActive: (node: any) => ({ height: node.scrollHeight }),
//   onLeaveStart: (node: any) => ({ height: node.offsetHeight }),
//   onLeaveActive: () => ({ height: 0 })
// };

/**
 * RcTreeView
 * @description rc-tree를 사용한 TreeView
 * @param {RcTreeviewProps} props
 * @prop {RcTreeNode[]} treeData - tree의 데이터 state
 * @prop {Dispatch<SetStateAction<RcTreeNode[]>>} setTreeData - tree의 데이터 state set함수
 * @prop {ReactNode} groupIcon - 그룹의 아이콘
 * @prop {ReactNode} itemIcon - item의 아이콘
 * @prop {ReactNode} expandIcon - 펼칠때의 아이콘
 * @prop {ReactNode} collapseIcon - 접을때의 아이콘
 * @prop {boolean} readonly - 읽기전용 여부 (default: false)
 * @prop {(selected: RcTreeNode | undefined) => void} handleSelect - 선택된 item의 정보를 받는 함수
 * @returns {JSX.Element}
 * @example
 * <RcTreeView
 *   treeData={treeData}
 *   groupIcon={<FolderOpenIcon />}
 *   itemIcon={<DescriptionIcon />}
 *   expandIcon={<ExpandMoreIcon />}
 *   collapseIcon={<ChevronRightIcon />}
 *   readonly={false}
 *   handleSelect={(node) => console.log(node)}
 * />
 */
const RcTreeView = <T,>(
  {
    treeData,
    setTreeData,
    groupIcon = <FolderFilled style={{ color: '#E9BA00' }} />,
    groupIconExpanded = <FolderOpenFilled style={{ color: '#E9BA00' }} />,
    itemIcon = <FileTextOutlined style={{ color: '#61AE89' }} />,
    expandIcon = <DownOutlined style={{ fontSize: 12, marginRight: 4 }} />,
    collapseIcon = <UpOutlined style={{ fontSize: 12, marginRight: 4 }} />,
    readonly = false,
    handleSelect,
    useCheck = false,
    multiCheck = true,
    checkStrictly = false,
    checkableLevel = '3',
    defaultExpandAll = false,
    defaultExpandedKeys = [],
    defaultCheckedKeys = [],
    defaultSelectedKeys = [],
    isLeaf,
    onEdit,
    onDelete,
    onCheck,
    onDoubleClick,
    displayLevel,
    checkOnGroup,
    loadData,
    pagination = false,
    cntPerPage = 10,
    getPrefix
  }: RcTreeviewProps<T>,
  ref: ForwardedRef<RcTreeViewRef<T>>
) => {
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<TreeCheckedKey>();
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [editingKey, setEditingKey] = useState<Key | null>(null);
  const [loadedKeys, setLoadedKeys] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [innerData, setInnerData] = useState<RcTreeNode<T>[]>([]);

  const { menuOpen, mouseX, mouseY, handleOpen, handleClose } = useContextMenu({});

  const treeRef = useRef<Tree>(null);

  useImperativeHandle(ref, () => {
    return {
      getTreeData: () => innerData,
      getCheckedData: () => {
        if (checkStrictly) {
          const keys = checkedKeys as { checked: Key[]; halfChecked: Key[] };
          return keys.checked.map((key) => findByKey(innerData, key.toString())) as RcTreeNode<T>[];
        }
        const keys = checkedKeys as Key[];
        if (!keys || keys.length < 1) return [];
        if (checkOnGroup) {
          const filtered = filterTreeByKeys(
            innerData,
            keys.map((key) => key.toString())
          );
          return flattenItems(filtered).filter((item) => !!item && item.checkable) || [];
        }
        return (keys.map((key) => findByKey(innerData, key.toString())).filter((item) => !!item && item.isLeaf) as RcTreeNode<T>[]) || [];
      },
      resetChecked: () => {
        setCheckedKeys([]);
      },
      getUpdatedData: () => innerData.filter((el) => !!el.newLocation || !!el.newTitle) || [],
      setCheckedKeys: (keys: TreeCheckedKey) => {
        setCheckedKeys(keys);
      },
      expandNodeByKey: (key: Key, data?: RcTreeNode<T>[]) => {
        const reverseTree = initReverseTree(data || innerData, key.toString());
        if (!reverseTree) return;
        const expandedKeys = reverseTree.map((el) => el.key);
        setExpandedKeys(expandedKeys);
      },
      setSelectedKeys: (keys: Key[]) => {
        setSelectedKeys(keys);
      },
      reloadNode: (key: Key) => {
        const targetNode = findByKey(innerData, key.toString());
        if (!targetNode) return;
        loadDataHandler({
          active: true,
          expanded: true,
          selected: true,
          checked: true,
          loaded: false,
          loading: true,
          halfChecked: true,
          dragOver: false,
          dragOverGapTop: false,
          dragOverGapBottom: false,
          pos: '',
          ...targetNode
        });
      },
      expandAll: () => {
        setExpandedKeys(flattenItems(innerData).map((item) => item.key));
      }
    };
  }, [innerData, checkedKeys]);

  const onExpand = (expandedKeys: Key[]) => {
    setExpandedKeys(expandedKeys);
  };

  const onTreeCheck = (
    checked:
      | {
          checked: Key[];
          halfChecked: Key[];
        }
      | Key[]
  ) => {
    // pre-process
    if (!multiCheck && Array.isArray(checked) && checkedKeys) {
      checked = checked.filter((key) => !(checkedKeys as Key[]).includes(key));
    }

    if (checkStrictly) {
      const keys = checked as { checked: Key[]; halfChecked: Key[] };
      setCheckedKeys(multiCheck ? keys : { checked: keys.checked, halfChecked: [] });
      onCheck?.(keys.checked.map((key) => findByKey(innerData, key.toString())) as RcTreeNode<T>[]);
      return;
    }

    const keys = checked as Key[];
    setCheckedKeys(keys);
    if (!keys || keys.length < 1) {
      onCheck?.([]);
      return;
    }

    if (checkOnGroup) {
      onCheck?.(keys.map((key) => findByKey(innerData, key.toString())).filter((item) => !!item) as RcTreeNode<T>[]);
    } else {
      onCheck?.(keys.map((key) => findByKey(innerData, key.toString())).filter((item) => !!item && item.isLeaf) as RcTreeNode<T>[]);
    }
  };

  const onSelect = (selectedKeys: Key[]) => {
    setSelectedKeys(selectedKeys);
    if (selectedKeys.length < 1) {
      handleSelect?.(undefined);
      return;
    }

    const selected = findByKey(innerData, selectedKeys[0].toString());

    handleSelect?.(selected);
  };

  const getIcon = (item: TreeNodeProps<RcTreeNode>): React.ReactNode => {
    if (item.data && item.data?.option?.isButton) return null;
    if (item.expanded && item.data?.customIconExpanded) return item.data.customIconExpanded;
    if (item.data?.customIcon) return item.data.customIcon;
    return !item.isLeaf ? (item.expanded ? groupIconExpanded : groupIcon) : itemIcon;
  };

  const getSwitcherIcon = ({ expanded, data }: TreeNodeProps<RcTreeNode>): React.ReactNode => {
    if (!data?.children) return null;
    return expanded ? expandIcon : collapseIcon;
  };

  const onDrop = (
    info: NodeDragEventParams<RcTreeNode> & {
      dragNode: EventDataNode<RcTreeNode>;
      dragNodesKeys: Key[];
      dropPosition: number;
      dropToGap: boolean;
    }
  ) => {
    const dragKey = info.dragNode.key.toString();
    const dropKey = info.node.key.toString();
    const isOver = info.node.dragOver;
    const isOverGap = info.dropToGap;
    const hasChildren = info.node.children;

    if (isOver && hasChildren) {
      const processed = moveDataToChildren(treeData, dragKey, dropKey);
      !expandedKeys.includes(dropKey) && setExpandedKeys((prev) => [...prev, dropKey]);
      setTreeData(processed);

      return;
    }

    if (isOverGap) {
      const processed = moveDataToNextTo(treeData, dragKey, dropKey);
      setTreeData(processed);
      return;
    }
  };

  const getMenuOptions = (): ContextMenuOption[] => {
    const selected = selectedKeys.length > 0 ? findByKey(innerData, selectedKeys[0].toString()) : null;
    const contextMenu: ContextMenuOption[] = [];
    // const addFolderCallback = () => {
    //   !expandedKeys.includes(selectedKeys[0]) && setExpandedKeys((prev) => [...prev, selectedKeys[0]]);
    // };

    if (!selected) return [];

    if (onEdit) {
      contextMenu.push({
        label: '그룹명 변경',
        onClick: () => {
          setEditingKey(selectedKeys[0]);
          setSelectedKeys([]);
        },
        icon: <FontAwesomeIcon icon={faEdit} />
      });
    }

    if (onDelete) {
      contextMenu.push({
        label: '삭제',
        onClick: async () => {
          const result = await confirmation({
            title: '삭제',
            msg: '해당 항목을 삭제하시겠습니까?'
          });
          if (!result) return;
          onDelete?.(selected);
        },
        icon: <FontAwesomeIcon icon={faTrash} />
      });
    }

    return selected?.children ? contextMenu : [];
  };

  const handleViewMore = (node: RcTreeNode) => {
    const moreBtnNode: RcTreeNode = {
      key: `moreBtn-${v4()}`,
      title: '더보기',
      option: {
        isButton: true
      },
      selectable: false,
      checkable: false
    };

    const nextVisible = (node.visibleChildren ?? 0) + cntPerPage;
    node.visibleChildren = nextVisible;
    node.children =
      (node.originChildren?.length ?? 0) > nextVisible
        ? node.originChildren?.slice(0, nextVisible).concat([moreBtnNode])
        : node.originChildren;

    const added = modifyNode(innerData, node);
    setInnerData(added);
  };

  const loadDataHandler = async (node: EventDataNode<RcTreeNode>) => {
    const result = await loadData?.(node);
    if (!node.children || node.children.length < 1) {
      setLoadedKeys((prev) => prev.filter((el) => el !== node.key.toString()));
      return;
    }
    if (result) {
      setInnerData(modifyNode(innerData, result));
    }
  };

  const onLoadData = useCallback(
    async (keys: Key[]) => {
      setLoadedKeys(keys as string[]);

      return Promise.resolve();
    },
    [loadedKeys]
  );

  useEffect(() => {
    let processed = [...treeData];

    processed = setLevel(processed, displayLevel);

    let currentExpandedKeys = [];

    if (defaultExpandAll && !isExpanded && processed.length > 0) {
      const flattenData = flattenItems(processed);
      setExpandedKeys(flattenData.map((item) => item.key));
      setIsExpanded(true);
    } else if (defaultExpandedKeys.length > 0 && !isExpanded) {
      currentExpandedKeys = defaultExpandedKeys;
      setExpandedKeys(currentExpandedKeys);
      setIsExpanded(true);
    }

    if (defaultCheckedKeys.length > 0) {
      setCheckedKeys(defaultCheckedKeys);
    }

    if (defaultSelectedKeys.length > 0) {
      setSelectedKeys(defaultSelectedKeys);
    }

    if (useCheck) {
      processed = setCheckableLevel(processed, checkableLevel);
    }
    processed = setIsLeaf(processed, isLeaf);
    if (pagination) {
      processed = setVisibleChildren(processed, true, cntPerPage);
    }

    if (defaultSelectedKeys.length > 0) {
      const targets = initReverseTree(processed, defaultSelectedKeys[0].toString(), pagination)?.map((el) => el.key);
      if (targets) {
        targets.forEach((key) => {
          const node = findParentByKey(processed, key.toString(), pagination);
          if (!node) return;
          node.visibleChildren = Number.MAX_SAFE_INTEGER;
          node.children = node.originChildren;
        });
      }
    }

    setLoadedKeys([]);
    setInnerData(processed);
  }, [treeData]);

  return (
    <>
      <div
        id={`tree-container-${v4()}`}
        style={{ paddingTop: '10px', overflow: 'auto', flex: 1, height: '100%' }}
        onContextMenu={(e) => {
          e.preventDefault();
          if (readonly) return;
          setSelectedKeys([]);
          handleOpen(e);
        }}
      >
        <Tree
          ref={treeRef}
          showLine={true}
          checkable={useCheck}
          // draggable={{ nodeDraggable: (node) => !readonly && node.key.toString() !== editingKey?.toString() }}
          draggable={false}
          // motion={motion}
          treeData={innerData}
          expandedKeys={expandedKeys}
          expandAction="doubleClick"
          checkedKeys={checkedKeys}
          selectedKeys={selectedKeys}
          onRightClick={({ event, node }) => {
            event.preventDefault();
            event.stopPropagation();
            if (!node.children || readonly || node.isLeaf) return;
            setSelectedKeys([node.key]);
            handleOpen(event);
          }}
          titleRender={(node) => {
            return (node as RcTreeNode).option?.isButton ? (
              <MoreButtonNode
                onClick={() => {
                  const parent = findParentByKey(innerData, node.key.toString());
                  if (!parent) return;
                  handleViewMore(parent);
                }}
              />
            ) : (
              <CustomNode
                {...node}
                title={node.title}
                key={`treeNode-${node.key}`}
                nodeKey={node.key}
                editingKey={editingKey}
                onBlur={(value) => {
                  setTreeData(modifyNodeTitleByKey(treeData, editingKey?.toString() || '', value));
                  setEditingKey(null);
                  if (onEdit) {
                    const updated = findByKey(innerData, editingKey?.toString() || '');
                    if (!updated) return;
                    onEdit({ ...updated, newTitle: value });
                  }
                }}
                onKeyCancel={() => setEditingKey(null)}
                getPrefix={getPrefix}
              />
            );
          }}
          onExpand={onExpand}
          onSelect={onSelect}
          onCheck={onTreeCheck}
          onDoubleClick={(_e, node) => {
            if (!node.isLeaf) return;
            onDoubleClick?.(node);
          }}
          onDrop={onDrop}
          icon={getIcon}
          loadedKeys={loadedKeys}
          onLoad={onLoadData}
          loadData={loadDataHandler}
          switcherIcon={getSwitcherIcon}
          checkStrictly={checkStrictly}
          virtual
        />
      </div>
      <ContextMenu options={getMenuOptions()} mouseX={mouseX} mouseY={mouseY} open={menuOpen} onClose={handleClose} />
    </>
  );
};

const RctreeWithRef = forwardRef(RcTreeView) as <T>(
  props: RcTreeviewProps<T> & { ref?: ForwardedRef<RcTreeViewRef<T>> }
) => ReturnType<typeof RcTreeView>;

export default RctreeWithRef;
