import { TreeItemProps } from '@mui/lab';
import { Box, SxProps, Theme, alpha } from '@mui/material';
import { TreeItem2Icon, TreeItem2Provider, RichTreeView as MuiRichTreeView, TreeViewBaseItem } from '@mui/x-tree-view';
import {
  TreeItem2Content,
  TreeItem2GroupTransition,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Props,
  TreeItem2Root
} from '@mui/x-tree-view/TreeItem2';

import { useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import { ContextMenu, ContextMenuOption, useContextMenu } from 'hooks/useContextMenu';
import { CSSProperties, ReactNode, forwardRef, useEffect, useMemo, useState } from 'react';
import { flattenItems } from './treeUtil';
import { styled } from '@mui/material';

// Define the shape of the tree data
export interface TreeViewElement<T = any> extends Omit<TreeItemProps, 'children' | 'label'> {
  id: string;
  label: string;
  children?: TreeViewElement<T>[];
  innerContent?: T;
}

export interface TreeViewEvents {
  onItemClick?: (item: TreeViewElement) => void;
  onLabelChange?: (itemId: string, newLabel: string) => void;
}

export const findByNodeId = (items: TreeViewElement[], nodeId: string): TreeViewElement | undefined => {
  for (const item of items) {
    if (item.id.toString() === nodeId.toString()) {
      return item;
    }
    if (item.children) {
      const foundItem = findByNodeId(item.children, nodeId);
      if (foundItem) {
        return foundItem;
      }
    }
  }
  return undefined;
};

interface RichTreeViewProps<T = any> {
  /** Array of tree items to display */
  items: TreeViewElement<T>[];
  /** Event handlers for tree interactions */
  events?: TreeViewEvents;
  /** Icon to display when a node is collapsed */
  collapseIcon?: ReactNode;
  /** Icon to display when a node is expanded */
  expandIcon?: ReactNode;
  /** Custom render function for node content */
  contentElement?: (content: T, nodeId: string) => ReactNode;
  /** Custom styles for group transitions */
  groupTransitionStyle?: CSSProperties;
  /** Icon to display when a node is a leaf */
  leafStartIcon?: ReactNode;
  selectable?: boolean;
  sx?: SxProps<Theme>;
}

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  [`&[aria-selected="true"]`]: {
    '& .labelIcon': {
      color: theme.palette.primary.dark,
      ...theme.applyStyles('light', {
        color: theme.palette.primary.main
      }),
      backgroundColor: alpha(theme.palette.primary.darker, 0.5),
      ...theme.applyStyles('light', {
        backgroundColor: theme.palette.primary.main
      })
    }
  },
  [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
    backgroundColor: alpha(theme.palette.primary.darker, 0.5),
    color: theme.palette.primary.contrastText,
    ...theme.applyStyles('light', {
      backgroundColor: theme.palette.primary.main
    })
  }
}));

// Custom Tree Item component using MUI's Rich Tree View API
const CustomTreeItem = forwardRef(
  (
    {
      nodeId,
      label: labelProp,
      children,
      contentElement,
      groupTransitionStyle,
      events,
      item,
      handleContextMenu,
      leafStartIcon,
      ...other
    }: {
      nodeId: string;
      label: string;
      children?: ReactNode;
      contentElement?: (content: any, nodeId: string) => ReactNode;
      groupTransitionStyle?: CSSProperties;
      events?: TreeViewEvents;
      item: TreeViewElement;
      handleContextMenu?: (e: React.MouseEvent<HTMLLIElement>, itemId: string) => void;
      leafStartIcon?: ReactNode;
    },
    ref: React.Ref<HTMLLIElement>
  ) => {
    const { getRootProps, getContentProps, getIconContainerProps, getGroupTransitionProps, status, publicAPI } = useTreeItem2({
      itemId: nodeId,
      children,
      label: labelProp
    });

    const hasChildren = !!children;
    const isTopNode = !!publicAPI.getItemTree().find((item) => item.id === nodeId);

    return (
      <TreeItem2Provider itemId={nodeId}>
        <TreeItem2Root
          {...getRootProps(other)}
          ref={ref}
          onClick={(e) => {
            e.stopPropagation();
            events?.onItemClick?.(item);
          }}
          onContextMenu={(e) => {
            publicAPI.selectItem({ event: e, itemId: nodeId });
            handleContextMenu?.(e, nodeId);
          }}
        >
          <CustomTreeItemContent {...getContentProps()}>
            <TreeItem2IconContainer {...getIconContainerProps()} sx={{ display: 'none' }}>
              <TreeItem2Icon status={status} />
            </TreeItem2IconContainer>
            <TreeItem2Label>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {!isTopNode && leafStartIcon}
                {item.innerContent && contentElement ? contentElement(item.innerContent, nodeId) : labelProp}
              </Box>
            </TreeItem2Label>
          </CustomTreeItemContent>
          {hasChildren && (
            <TreeItem2GroupTransition {...getGroupTransitionProps()} style={groupTransitionStyle}>
              {children}
            </TreeItem2GroupTransition>
          )}
        </TreeItem2Root>
      </TreeItem2Provider>
    );
  }
);

// Convert the tree data to MUI's TreeViewBaseItem format
const convertToTreeViewBaseItem = <T,>(items: TreeViewElement<T>[], parentId: string | null = null): TreeViewBaseItem[] => {
  return items.map((item) => ({
    id: item.id,
    label: item.label,
    children: item.children ? convertToTreeViewBaseItem(item.children, item.id) : []
  }));
};

/**
 * 트리 뷰 컴포넌트
 * - MUI의 Rich Tree View API를 사용하여 구현된 트리 뷰 컴포넌트
 * @param {RichTreeViewProps<T>} props
 * @prop {TreeViewElement<T>[]} items - 트리 뷰를 구성하는 아이템 목록
 * @prop {TreeViewEvents} events - 트리 뷰 이벤트
 * @prop {ReactNode} collapseIcon - 노드가 접혔을 때 표시할 아이콘
 * @prop {ReactNode} expandIcon - 노드가 펼쳐졌을 때 표시할 아이콘
 * @prop {(content: T) => ReactNode} contentElement - 노드의 콘텐츠를 표시하는 컴포넌트
 * @prop {CSSProperties} groupTransitionStyle - 그룹 전환 스타일
 * @example
 * const items = [
 *   {
 *     id: '1',
 *     label: 'Parent',
 *     type: 'group',
 *     children: [
 *       {
 *         id: '2',
 *         label: 'Child 1',
 *         innerContent: { customData: 'value' }
 *       }
 *     ]
 *   }
 * ];
 *
 * <CustomRichTreeView
 *   items={items}
 *   collapseIcon={<ExpandMoreIcon />}
 *   expandIcon={<ChevronRightIcon />}
 *   contentElement={(content) => (
 *     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 *       <FolderIcon />
 *       <span>{content?.customData || 'Default'}</span>
 *     </div>
 *   )}
 * />
 */
const CustomRichTreeView = <T,>({
  items,
  events = {},
  collapseIcon,
  expandIcon,
  contentElement,
  groupTransitionStyle,
  leafStartIcon,
  selectable = true,
  sx
}: RichTreeViewProps<T>) => {
  const [currentItemId, setCurrentItemId] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const treeItems = useMemo(() => convertToTreeViewBaseItem(items), [items]);

  const { handleOpen, handleClose, menuOpen, mouseX, mouseY } = useContextMenu({});

  // Create a map of items for quick lookup
  const itemsMap = useMemo(() => {
    const map = new Map<string, TreeViewElement<T>>();
    const processItems = (items: TreeViewElement<T>[]) => {
      items.forEach((item) => {
        map.set(item.id, item);
        if (item.children) {
          processItems(item.children);
        }
      });
    };
    processItems(items);
    return map;
  }, [items]);

  const contextMenuOptions: ContextMenuOption[] = [
    {
      label: '테스트',
      onClick: () => {
        alert(`currnetItem: ${currentItemId}`);
      }
    }
  ];

  const handleContextMenu = (e: React.MouseEvent<HTMLLIElement>, itemId: string) => {
    setCurrentItemId(itemId);
    handleOpen(e);
  };

  useEffect(() => {
    setExpandedItems(flattenItems(items).map((item) => item.id));
  }, [items]);

  // Custom item component with our styling and behavior
  const CustomItem = useMemo(
    () =>
      forwardRef<HTMLLIElement, TreeItem2Props>((props, ref) => {
        const item = itemsMap.get(props.itemId);
        if (!item) return null;

        return (
          <CustomTreeItem
            ref={ref}
            nodeId={props.itemId}
            label={item.label}
            item={item}
            handleContextMenu={(e) => handleContextMenu(e, props.itemId)}
            contentElement={contentElement}
            groupTransitionStyle={groupTransitionStyle}
            events={events}
            leafStartIcon={leafStartIcon}
          >
            {props.children}
          </CustomTreeItem>
        );
      }),
    [collapseIcon, expandIcon, contentElement, groupTransitionStyle, events, itemsMap]
  );

  return (
    <>
      <MuiRichTreeView
        items={treeItems}
        slots={{
          item: CustomItem
        }}
        expandedItems={expandedItems}
        expansionTrigger="iconContainer"
        itemChildrenIndentation={20}
        disableSelection={!selectable}
        sx={sx}
      />
      <ContextMenu open={menuOpen} onClose={handleClose} mouseX={mouseX} mouseY={mouseY} options={contextMenuOptions} />
    </>
  );
};

export default CustomRichTreeView;
