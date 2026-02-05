import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Box, Checkbox, IconButton, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown, faFolder, faFile } from '@fortawesome/free-solid-svg-icons';
import { flattenItems } from './treeUtil';

export interface TreeNode {
  id: string;
  label: string;
  data?: any;
  children?: TreeNode[];
}

interface TreeItemProps {
  item: TreeNode;
  level?: number;
  checked: Record<string, boolean>;
  onCheck: (itemId: string, isChecked: boolean, item: TreeNode) => void;
  selected: string | null;
  onSelect: (itemId: string) => void;
  expanded: Record<string, boolean>;
  onToggle: (itemId: string) => void;
  useCheck?: boolean;
  expandAction: 'none' | 'click' | 'doubleClick';
  groupIcon?: React.ReactNode;
  leafIcon?: React.ReactNode;
  isLeaf?: (node: TreeNode) => boolean;
}

const TreeItem: React.FC<TreeItemProps> = ({
  item,
  level = 0,
  checked,
  onCheck,
  selected,
  onSelect,
  expanded,
  onToggle,
  useCheck,
  expandAction,
  groupIcon,
  leafIcon,
  isLeaf
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expanded[item.id] || false;
  const isChecked = checked[item.id] || false;
  const isSelected = selected === item.id;

  const handleCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onCheck(item.id, !isChecked, item);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggle(item.id);
    }
  };

  const handleSelect = () => {
    onSelect(item.id);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1,
          py: 0.75,
          cursor: 'pointer',
          paddingLeft: `${level * 24}px`,
          borderRadius: 1,
          // borderLeft: isSelected ? '4px solid' : 'none',
          // borderLeftColor: isSelected ? 'primary.main' : 'transparent',
          backgroundColor: isSelected ? 'primary.lighter' : 'transparent',
          '&:hover': {
            backgroundColor: isSelected ? 'primary.100' : 'grey.100'
          },
          transition: 'background-color 0.2s'
        }}
        onClick={(e) => {
          if (expandAction === 'click') {
            handleToggle(e);
          }
          handleSelect();
        }}
        onDoubleClick={(e) => {
          if (expandAction === 'doubleClick') {
            handleToggle(e);
          }
          handleSelect();
        }}
      >
        <IconButton
          onClick={handleToggle}
          disabled={!hasChildren}
          size="small"
          sx={{
            width: 20,
            height: 20,
            padding: 0,
            '&:hover': {
              backgroundColor: 'grey.200'
            }
          }}
        >
          {hasChildren ? (
            isExpanded ? (
              <FontAwesomeIcon icon={faChevronDown} size="xs" />
            ) : (
              <FontAwesomeIcon icon={faChevronRight} size="xs" />
            )
          ) : (
            <Box sx={{ width: 16 }} />
          )}
        </IconButton>

        {useCheck && (
          <Checkbox
            checked={isChecked}
            onChange={handleCheckboxClick}
            onClick={(e) => e.stopPropagation()}
            size="small"
            sx={{
              padding: 0,
              width: 20,
              height: 20
            }}
          />
        )}
        {isLeaf ? (isLeaf(item) ? leafIcon : groupIcon) : hasChildren || !(item.data?.type === 'PERSON') ? groupIcon : leafIcon}

        <Typography
          variant="body2"
          sx={{
            userSelect: 'none',
            fontSize: '0.875rem'
          }}
        >
          {item.label}
        </Typography>
      </Box>

      {hasChildren && isExpanded && (
        <Box>
          {item.children!.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              level={level + 1}
              checked={checked}
              onCheck={onCheck}
              selected={selected}
              onSelect={onSelect}
              expanded={expanded}
              onToggle={onToggle}
              expandAction={expandAction}
              useCheck={useCheck}
              groupIcon={groupIcon}
              leafIcon={leafIcon}
              isLeaf={isLeaf}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

interface SimpleTreeOptions {
  groupIcon?: React.ReactNode;
  leafIcon?: React.ReactNode;
}

export interface SimpleTreeViewProps {
  data: TreeNode[];
  useCheck?: boolean;
  expandAction?: 'none' | 'click' | 'doubleClick';
  onSelect?: (id: string) => void;
  options?: SimpleTreeOptions;
  isLeaf?: (node: TreeNode) => boolean;
}

export interface SimpleTreeViewRef {
  getCheckedItems: () => TreeNode[];
  getSelectedItem: () => TreeNode | null;
  getItemById: (id: string) => TreeNode | null;
  getCheckedLeaves: () => TreeNode[];
  setSelectedItem: (id: string) => void;
  setCheckedItems: (ids: string[]) => void;
  expandById: (id: string) => void;
  expandAll: () => void;
  isTopLevelSelected: () => boolean;
}

/**
 * 트리 컴포넌트
 * @param data 트리 데이터 ( TreeNode 객체 )
 * @param useCheck 체크박스 사용 여부
 * @param expandAction 트리 확장의 추가적인 트리거에 대한 속성 ( none | click | doubleClick )
 * @param onSelect 트리 아이템 선택 이벤트 ( 선택된 아이템 ID )
 * @param options 기능과 관련없는 기타 옵션 ( ex. 아이콘 설정 등 )
 * @param isLeaf 트리 아이템이 리프 노드인지 확인하는 함수
 * @description
 * - 트리의 제어는 id를 기본으로 합니다.
 * - 외부에서 트리를 제어해야하는 경우 ref를 사용하여 제어할 수 있습니다. ( SimpleTreeViewRef )
 * - 노드의 상태는 3가지로 관리하고, 상태들은 내부에서 제어합니다 ( checked, selected, expanded )
 * @example
 * <SimpleTree data={treeData} ref={treeRef} useCheck={true} onSelect={(id) => {}} expandAction='click' />
 */
const SimpleTree = forwardRef<SimpleTreeViewRef, SimpleTreeViewProps>(
  (
    {
      data,
      useCheck = false,
      expandAction = 'none',
      onSelect,
      options = {
        groupIcon: <FontAwesomeIcon icon={faFolder} style={{ fontSize: '18px', color: '#f59e0b' }} />,
        leafIcon: <FontAwesomeIcon icon={faFile} style={{ fontSize: '18px', color: '#6b7280' }} />
      },
      isLeaf
    },
    ref
  ) => {
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [selected, setSelected] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    // Recursive function to get all descendant IDs
    const getAllDescendantIds = (item: TreeNode): string[] => {
      const ids: string[] = [item.id];
      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          ids.push(...getAllDescendantIds(child));
        });
      }
      return ids;
    };

    // Find item by ID in the tree
    const findItemById = (items: TreeNode[], id: string): TreeNode | null => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findItemById(item.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    // 최상위 레벨 노드 인지 확인
    const isTopLevelNode = (items: TreeNode[], id: string): boolean => {
      for (const item of items) {
        if (item.id === id) {
          return true;
        }
      }
      return false;
    };

    const isTopLevelSelected = () => {
      return isTopLevelNode(data, selected || '');
    };

    const getPathById = (items: TreeNode[], id: string): string[] => {
      const path: string[] = [];

      const findPath = (item: TreeNode) => {
        if (item.id === id) {
          path.push(item.id);
          return true;
        }

        if (item.children) {
          for (const child of item.children) {
            if (findPath(child)) {
              path.push(item.id);
              return true;
            }
          }
        }

        return false;
      };

      for (const node of items) {
        if (findPath(node)) {
          break;
        }
      }

      return path;
    };

    const handleCheck = (itemId: string, isChecked: boolean, item: TreeNode) => {
      const newChecked = { ...checked };

      // If item has children, check/uncheck all descendants
      if (item.children && item.children.length > 0) {
        const allDescendantIds = getAllDescendantIds(item);
        allDescendantIds.forEach((id) => {
          newChecked[id] = isChecked;
        });
      } else {
        // Leaf node - just toggle itself
        newChecked[itemId] = isChecked;
      }

      setChecked(newChecked);
    };

    const handleSelect = (itemId: string) => {
      setSelected(itemId);
      onSelect?.(itemId);
    };

    const handleToggle = (itemId: string) => {
      setExpanded((prev) => ({
        ...prev,
        [itemId]: !prev[itemId]
      }));
    };

    const getCheckedItems = () => {
      const checkedItems = Object.keys(checked).filter((key) => checked[key]);
      return checkedItems.map((key) => findItemById(data, key)).filter((item) => item !== null);
    };

    const getSelectedItem = () => {
      const selectedNode = findItemById(data, selected || '');
      return selectedNode;
    };

    const getItemById = (id: string) => {
      const selectedNode = findItemById(data, id);
      return selectedNode;
    };

    const setSelectedItem = (id: string) => {
      setSelected(id);
    };

    const setCheckedItems = (ids: string[]) => {
      setChecked((prev) => {
        const newChecked = { ...prev };
        ids.forEach((id) => {
          newChecked[id] = true;
        });
        return newChecked;
      });
    };

    const expandById = (id: string) => {
      const path = getPathById(data, id);
      setExpanded(path.reduce((acc, id) => ({ ...acc, [id]: true }), {}));
    };

    const expandAll = () => {
      setExpanded(flattenItems(data).reduce((acc, node) => ({ ...acc, [node.id]: true }), {}));
    };

    const getCheckedLeaves = () => {
      return (
        (
          Object.keys(checked).filter(
            (key) => (!findItemById(data, key)?.children || !findItemById(data, key)?.children?.length) && checked[key]
          ) || []
        )
          .map((key) => findItemById(data, key))
          .filter((item) => item !== null) || []
      );
    };

    useImperativeHandle(
      ref,
      () => ({
        getCheckedItems,
        getSelectedItem,
        getItemById,
        getCheckedLeaves,
        setSelectedItem,
        setCheckedItems,
        expandById,
        expandAll,
        isTopLevelSelected
      }),
      [checked, selected]
    );

    return (
      <Box
        sx={{
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          overflow: 'auto',
          height: '100%'
        }}
      >
        {data.map((item) => (
          <TreeItem
            key={item.id}
            item={item}
            checked={checked}
            onCheck={handleCheck}
            selected={selected}
            onSelect={handleSelect}
            expanded={expanded}
            useCheck={useCheck}
            onToggle={handleToggle}
            expandAction={expandAction}
            groupIcon={options?.groupIcon}
            leafIcon={options?.leafIcon}
            isLeaf={isLeaf}
          />
        ))}
      </Box>
    );
  }
);

// 유틸 함수
export const searchTreeNodes = (treeData: TreeNode[], searchTitle: string): TreeNode[] => {
  const foundKeys = new Set<string>();

  // 노드와 모든 하위 노드를 포함하는 헬퍼 함수
  function includeAllChildren(node: TreeNode): TreeNode {
    return {
      ...node,
      children: node.children?.map((child) => includeAllChildren(child)) || undefined
    };
  }

  function searchRecursive(nodes: TreeNode[]): TreeNode[] {
    const result: TreeNode[] = [];

    for (const node of nodes) {
      // 현재 노드의 title이 검색어를 포함하는지 확인
      const isCurrentMatch = node.label?.toString().toLowerCase().includes(searchTitle.toLowerCase());

      if (isCurrentMatch) {
        // 현재 노드가 매칭되면 이 노드와 모든 하위 노드를 포함
        if (!foundKeys.has(node.id.toString())) {
          foundKeys.add(node.id.toString());

          // 매칭된 노드의 모든 하위 노드를 포함
          const nodeWithAllChildren = includeAllChildren(node);
          result.push(nodeWithAllChildren);
        }
      } else {
        // 현재 노드가 매칭되지 않으면 하위 노드에서 검색
        if (node.children && node.children.length > 0) {
          const filteredChildren = searchRecursive(node.children);

          // 하위 노드에서 매칭된 것이 있으면 현재 노드도 포함
          if (filteredChildren.length > 0) {
            if (!foundKeys.has(node.id.toString())) {
              foundKeys.add(node.id.toString());

              const newNode: TreeNode = {
                ...node,
                children: filteredChildren
              };

              result.push(newNode);
            }
          }
        }
      }
    }

    return result;
  }

  // 검색 실행
  return searchRecursive(treeData);
};

export const initSimpleTreeNode = <T,>(data: T[], options: { idKey: keyof T; labelKey: keyof T; childrenKey: keyof T }): TreeNode[] => {
  const { idKey, labelKey, childrenKey } = options;

  const initNode = (item: T): TreeNode => ({
    id: item[idKey] as string,
    label: item[labelKey] as string,
    data: item,
    children: ((item[childrenKey] || []) as T[]).map((child) => initNode(child))
  });

  return data.map((item) => initNode(item));
};

export const initSimpleTreeNodeByParent = <T extends Record<string, any>>(
  items: T[],
  options: {
    idKey: string;
    labelKey: string;
    parentKey: string;
  }
): TreeNode[] => {
  const { idKey, labelKey, parentKey } = options;

  // 빠른 조회를 위한 맵 생성
  const itemMap = new Map<any, TreeNode>();
  const rootNodes: TreeNode[] = [];

  // 모든 아이템을 TreeNode로 변환하여 맵에 저장
  items.forEach((item) => {
    itemMap.set(item[idKey], {
      id: item[idKey],
      data: item,
      label: item[labelKey],
      children: []
    });
  });

  // 부모-자식 관계 설정
  items.forEach((item) => {
    const node = itemMap.get(item[idKey])!;
    const parentId = item[parentKey];

    if (!parentId) {
      // 루트 노드
      rootNodes.push(node);
    } else {
      // 자식 노드
      const parentNode = itemMap.get(parentId);
      if (parentNode) {
        parentNode.children?.push(node);
      } else {
        // 부모를 찾을 수 없는 경우 루트로 처리
        rootNodes.push(node);
      }
    }
  });

  return rootNodes;
};

export default SimpleTree;
