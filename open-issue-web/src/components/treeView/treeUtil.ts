import { v4 } from 'uuid';
import { RcTreeNode } from './RcTreeview';

/**
 * 주어진 키에 해당하는 트리 노드를 찾아 반환합니다.
 * @param data - 검색할 트리 데이터 배열
 * @param key - 찾을 노드의 키
 * @returns 찾은 노드 또는 undefined
 */
export const findByKey = (data: RcTreeNode[], key: string): RcTreeNode | undefined => {
  for (const item of data) {
    if (item.key.toString() === key) {
      return item;
    }
    if (item.children) {
      const foundItem = findByKey(item.children, key.toString());
      if (foundItem) {
        return foundItem;
      }
    }
  }
  return undefined;
};

export const findParentByKey = (data: RcTreeNode[], key: string, pagination?: boolean): RcTreeNode | undefined => {
  for (const item of data) {
    if (pagination) {
      if (item.originChildren) {
        const foundItem = item.originChildren.find((child) => child.key.toString() === key);
        if (foundItem) {
          return item;
        }
        const foundParentItem = findParentByKey(item.originChildren, key, true);
        if (foundParentItem) {
          return foundParentItem;
        }
      }
    } else {
      if (item.children) {
        const foundItem = item.children.find((child) => child.key.toString() === key);
        if (foundItem) {
          return item;
        }
        const foundParentItem = findParentByKey(item.children, key);
        if (foundParentItem) {
          return foundParentItem;
        }
      }
    }
  }
  return undefined;
};

/**
 * 주어진 제목과 일치하는 모든 트리 노드를 찾아 반환합니다.
 * @param data - 검색할 트리 데이터 배열
 * @param title - 찾을 노드의 제목
 * @returns 일치하는 모든 노드 배열
 */
export const findByTitle = (data: RcTreeNode[], title: string): RcTreeNode[] => {
  const result: RcTreeNode[] = [];

  for (const item of data) {
    if (item.title?.toString() === title) {
      result.push(item);
    }
    if (item.children) {
      const foundItems = findByTitle(item.children, title);
      if (foundItems.length > 0) {
        result.push(...foundItems);
      }
    }
  }
  return result;
};

// tree관련 오류가 있어 우선 leaf 검색만 적용
/**
 * @deprecated 트리노드 검색 시엔 searchTreeNodes 함수 사용 권장
 */
export const findByTitleIncluded = (data: RcTreeNode[], title: string): RcTreeNode[] => {
  const existKeys = [];
  const result: RcTreeNode[] = [];
  if (!title) return data;

  for (const item of data) {
    if (item.title?.toString().toLowerCase().includes(title.toLowerCase())) {
      existKeys.push(item.key);
      result.push(item);
    }
    if (item.children) {
      const foundItems = findByTitleIncluded(item.children, title);
      if (foundItems.length > 0) {
        result.push(...foundItems);
      }
    }
  }
  return result;
};

/**
 * 주어진 키를 가진 노드를 트리에서 제거합니다.
 * @param item - 트리 데이터 배열
 * @param key - 제거할 노드의 키
 * @returns 수정된 트리 데이터 배열
 */
export const removeDataRecursive = (item: RcTreeNode[], key: string): RcTreeNode[] => {
  return item
    .map((el) => {
      if (el.key === key) {
        return null;
      }
      if (el.children) {
        el.children = removeDataRecursive(el.children, key);
      }
      return el;
    })
    .filter((el) => el !== null && el !== undefined) as RcTreeNode[];
};

/**
 * 드래그한 항목을 드롭한 노드의 자식으로 이동시킵니다.
 * @param data - 트리 데이터 배열
 * @param dragItem - 드래그한 항목
 * @param dropKey - 드롭한 노드의 키
 * @returns 수정된 트리 데이터 배열
 */
const moveAtoBChildren = (data: RcTreeNode[], dragItem: RcTreeNode, dropKey: string) => {
  const modifyDataRecursive = (item: RcTreeNode): RcTreeNode | null => {
    if (item.key === dropKey) {
      if (!dragItem) return item;
      dragItem.newLocation = [item.key, 0];
      if (!item.children)
        return {
          ...item,
          children: [dragItem]
        };
      return {
        ...item,
        children: [
          dragItem,
          ...(item.children.map((child) => modifyDataRecursive(child)).filter((el) => el !== undefined && el !== null) as RcTreeNode[])
        ]
      };
    }

    return {
      ...item,
      children: item.children?.map((child) => modifyDataRecursive(child)).filter((el) => el !== undefined && el !== null) as RcTreeNode[]
    };
  };

  return data.map((item) => modifyDataRecursive(item)).filter((el) => el !== undefined && el !== null) as RcTreeNode[];
};

/**
 * 드래그한 항목을 드롭한 노드의 다음 형제로 이동시킵니다.
 * @param data - 트리 데이터 배열
 * @param dragItem - 드래그한 항목
 * @param dropKey - 드롭한 노드의 키
 * @returns 수정된 트리 데이터 배열
 */
const moveAtoBNextTo = (data: RcTreeNode[], dragItem: RcTreeNode, dropKey: string) => {
  const isTopNode = !!data.find((item) => item.key === dropKey);

  if (isTopNode) {
    const dropChildIndex = data.findIndex((item) => item.key === dropKey);
    dragItem.newLocation = [undefined, dropChildIndex + 1];
    return [...data.slice(0, dropChildIndex + 1), dragItem, ...data.slice(dropChildIndex + 1)];
  }

  const modifyDataRecursive = (item: RcTreeNode): RcTreeNode | null => {
    if (item.children) {
      const dropChildIndex = item.children.findIndex((child) => child.key === dropKey);
      if (dropChildIndex >= 0) {
        dragItem.newLocation = [item.key.toString(), dropChildIndex + 1];
        return {
          ...item,
          children: [...item.children.slice(0, dropChildIndex + 1), dragItem, ...item.children.slice(dropChildIndex + 1)]
        };
      }
    }

    return {
      ...item,
      children: item.children?.map((child) => modifyDataRecursive(child)).filter((el) => el !== undefined && el !== null) as RcTreeNode[]
    };
  };

  return data.map((item) => modifyDataRecursive(item)).filter((el) => el !== undefined && el !== null) as RcTreeNode[];
};

/**
 * 항목을 대상 노드의 자식으로 이동시킵니다.
 * @param data - 트리 데이터 배열
 * @param dragKey - 이동시킬 항목의 키
 * @param dropKey - 드롭 대상 노드의 키
 * @returns 수정된 트리 데이터 배열
 */
export const moveDataToChildren = (data: RcTreeNode[], dragKey: string, dropKey: string): RcTreeNode[] => {
  const dragItem = findByKey(data, dragKey);
  const dropItem = findByKey(data, dropKey);
  if (!dragItem || !dropItem) return data;

  const processed = removeDataRecursive(data, dragKey);
  return moveAtoBChildren(processed, dragItem, dropKey);
};

/**
 * 항목을 대상 노드의 다음 형제로 이동시킵니다.
 * @param data - 트리 데이터 배열
 * @param dragKey - 이동시킬 항목의 키
 * @param dropKey - 드롭 대상 노드의 키
 * @returns 수정된 트리 데이터 배열
 */
export const moveDataToNextTo = (data: RcTreeNode[], dragKey: string, dropKey: string): RcTreeNode[] => {
  const dragItem = findByKey(data, dragKey);
  const dropItem = findByKey(data, dropKey);
  if (!dragItem || !dropItem) return data;

  const processed = removeDataRecursive(data, dragKey);
  return moveAtoBNextTo(processed, dragItem, dropKey);
};

/**
 * 새로운 그룹을 트리에 추가합니다.
 * @param data - 트리 데이터 배열
 * @param key - 부모 노드의 키 (null인 경우 최상위에 추가)
 * @returns 수정된 트리 데이터 배열
 */
export const addGroup = (data: RcTreeNode[], key: string | null) => {
  const newGroup: RcTreeNode = {
    key: v4(),
    title: 'New Group',
    children: []
  };

  if (!key) {
    return [newGroup, ...data];
  }

  const modifyDataRecursive = (item: RcTreeNode): RcTreeNode => {
    if (item.key === key) {
      return {
        ...item,
        children: item.children ? [newGroup, ...item.children] : [newGroup]
      };
    }

    if (item.children) {
      return {
        ...item,
        children: item.children.map((child) => modifyDataRecursive(child))
      };
    }

    return item;
  };

  return data.map((item) => modifyDataRecursive(item));
};

/**
 * 지정된 키를 가진 노드의 제목을 수정합니다.
 * @param data - 트리 데이터 배열
 * @param key - 수정할 노드의 키
 * @param newTitle - 새로운 제목
 * @returns 수정된 트리 데이터 배열
 */
export const modifyNodeTitleByKey = (data: RcTreeNode[], key: string, newTitle: string) => {
  const modifyDataRecursive = (item: RcTreeNode): RcTreeNode => {
    if (item.key === key) {
      item.newTitle = newTitle;
      return {
        ...item,
        title: newTitle
      };
    }

    if (item.children) {
      return {
        ...item,
        children: item.children.map((child) => modifyDataRecursive(child))
      };
    }

    return item;
  };

  return data.map((item) => modifyDataRecursive(item));
};

/**
 * 트리 데이터에서 변경된 사항이 있는 노드를 찾아 반환합니다.
 * @param data - 트리 데이터 배열
 * @returns 변경된 노드가 포함된 트리 데이터 배열
 */
export const getUpdatedData = (data: RcTreeNode[]) => {
  const cloneItems: RcTreeNode[] = [...data];

  // const flattenItems = (items: RcTreeNode[]): RcTreeNode[] =>
  //   items.reduce((acc, item) => {
  //     acc.push(item);
  //     if (item.children) {
  //       acc.push(...flattenItems(item.children));
  //     }
  //     return acc;
  //   }, [] as RcTreeNode[]);

  const flattenedItems = flattenItems(cloneItems);

  return flattenedItems.filter((el) => el.newLocation || el.newTitle);
};

/**
 * 중첩된 트리 구조를 평탄화된 배열로 변환합니다.
 * @param items - 변환할 트리 데이터 배열
 * @returns 평탄화된 노드 배열
 */
export const flattenItems = <T extends { children?: T[] }>(items: T[]): T[] => {
  return items.reduce((acc, item) => {
    acc.push(item);
    if (item.children) {
      acc.push(...flattenItems(item.children));
    }
    return acc;
  }, [] as T[]);
};

/**
 * 지정된 키를 가진 노드를 포함하는 트리 경로를 찾아 반환합니다.
 * @param data - 트리 데이터 배열
 * @param key - 찾을 노드의 키
 * @returns 트리 경로 배열 ( 찾을 노드가 없는 경우 null )
 */
export const initReverseTree = (data: RcTreeNode[], key: string, pagination?: boolean) => {
  const traverseTree = (stack: RcTreeNode[], item: RcTreeNode): RcTreeNode[] | null => {
    stack.push(item);
    if (item.key.toString() === key) {
      return stack;
    }

    if (pagination) {
      if (item.originChildren) {
        let result: RcTreeNode[] | null = null;
        item.originChildren.some((child) => {
          result = traverseTree([...stack], child);
          return !!result;
        });
        if (result) return result;
      }
    } else {
      if (item.children) {
        let result: RcTreeNode[] | null = null;
        item.children.some((child) => {
          result = traverseTree([...stack], child);
          return !!result;
        });
        if (result) return result;
      }
    }

    return null;
  };

  for (const item of data) {
    const stack: RcTreeNode[] = [];
    const result = traverseTree(stack, item);
    if (result) {
      return result;
    }
  }
  return null;
};

/**
 * 트리 노드의 checkable 속성을 설정합니다.
 * @param data - 설정할 트리 데이터 배열
 * @param level - checkable 속성을 설정할 레벨 (1: 하위 그룹 제외, 2: 최상위 포함, 3: 모든 노드)
 * @returns 설정된 트리 데이터 배열
 */
export const setCheckableLevel = (data: RcTreeNode[], level: '1' | '2' | '3') => {
  const modifyDataRecursive = (item: RcTreeNode): RcTreeNode => {
    const isTopNode = !!data.find((el) => el.key === item.key);
    const isGroup = !!item.children;
    const checkable = level === '1' ? !isTopNode && !isGroup : level === '2' ? !isTopNode : true;
    if (item.children) {
      return {
        ...item,
        checkable,
        children: item.children.map((child) => modifyDataRecursive(child))
      };
    }

    return {
      ...item,
      checkable
    };
  };

  return data.map((item) => modifyDataRecursive(item));
};

/**
 * 트리 노드의 isLeaf 속성을 설정합니다.
 * @param data - 설정할 트리 데이터 배열
 * @param isLeaf - isLeaf 속성을 설정할 함수 (선택사항)
 * @returns 설정된 트리 데이터 배열
 */
export const setIsLeaf = (data: RcTreeNode[], isLeaf?: (item: RcTreeNode) => boolean) => {
  const modifyDataRecursive = (item: RcTreeNode): RcTreeNode => {
    const isNodeLeaf = isLeaf ? isLeaf(item) : !item.children;
    if (item.children) {
      return {
        ...item,
        isLeaf: isNodeLeaf,
        originChildren: item.children.map((child) => modifyDataRecursive(child)),
        children: isNodeLeaf ? undefined : item.children.map((child) => modifyDataRecursive(child))
      };
    }

    return {
      ...item,
      isLeaf: isNodeLeaf
    };
  };

  return data.map((item) => modifyDataRecursive(item));
};

/**
 * 트리 노드의 레벨을 설정합니다.
 * @param data - 설정할 트리 데이터 배열
 * @param limitedLevel - 제한할 최대 레벨 (선택사항)
 * @returns 설정된 트리 데이터 배열
 */
export const setLevel = (data: RcTreeNode[], limitedLevel?: number) => {
  let level = 0;
  const modifyDataRecursive = (item: RcTreeNode, level: number): RcTreeNode => {
    if (limitedLevel && level + 1 > limitedLevel) {
      delete item.children;
      return { ...item, level: level };
    }

    if (item.children) {
      return {
        ...item,
        level: level,
        children: item.children.map((child) => modifyDataRecursive(child, level + 1))
      };
    }

    return {
      ...item,
      level: level
    };
  };

  return data.map((item) => modifyDataRecursive(item, level));
};

export const setVisibleChildren = (data: RcTreeNode[], add?: boolean, cntPerPage?: number) => {
  if (!cntPerPage) {
    cntPerPage = 10;
  }

  const modifyDataRecursive = (item: RcTreeNode): RcTreeNode => {
    if (item.children) {
      if (add) {
        item.visibleChildren = (item.visibleChildren ?? 0) + cntPerPage;
      }

      const moreBtnNode: RcTreeNode = {
        key: `moreBtn-${v4()}`,
        title: '더보기',
        option: {
          isButton: true
        },
        selectable: false,
        checkable: false
      };

      const processedChildren = item.children?.map((child) => modifyDataRecursive(child)) ?? [];

      return (item.originChildren?.length ?? 0) > (item.visibleChildren ?? 0)
        ? {
            ...item,
            originChildren: processedChildren,
            children: processedChildren.slice(0, item.visibleChildren ?? 0).concat([moreBtnNode])
          }
        : {
            ...item,
            originChildren: processedChildren,
            children: processedChildren
          };
    }

    return {
      ...item
    };
  };

  return data.map((item) => modifyDataRecursive(item));
};

/**
 * RcTree 컴포넌트를 위한 트리 데이터를 초기화합니다.
 * @param data - 초기화할 데이터
 * @param key - 노드의 키로 사용할 필드
 * @param childrenKey - 자식 노드 목록을 가진 필드
 * @param titleKey - 노드 제목으로 사용할 필드
 * @returns 초기화된 트리 노드
 */
export const initRcTree = <T extends Record<string, any>>(
  data: T,
  key: keyof T,
  childrenKey: keyof T,
  titleKey: keyof T,
  disableCheckbox?: (data: T) => boolean
) => {
  const initNode = (data: T): RcTreeNode => {
    return {
      key: data[key] as string,
      title: data[titleKey] as string,
      data: data,
      disableCheckbox: disableCheckbox?.(data) ?? false,
      children:
        data[childrenKey] && Array.isArray(data[childrenKey]) ? (data[childrenKey] as any[]).map((child) => initNode(child)) : undefined
    };
  };
  return initNode(data);
};

/**
 * RcTree 컴포넌트를 위한 트리 데이터를 초기화합니다.
 * @param items - 초기화할 데이터 배열 (부모-자식 관계는 parentKey로 연결됨)
 * @param key - 노드의 키로 사용할 필드
 * @param parentKey - 부모 노드의 키를 가진 필드
 * @param titleKey - 노드 제목으로 사용할 필드
 * @param disableCheckbox - 체크박스 비활성화 여부를 결정하는 함수 (선택사항)
 * @returns 초기화된 트리 노드 배열
 */
export const initRcTreeParent = <T extends Record<string, any>>(
  items: T[],
  key: keyof T,
  parentKey: keyof T,
  titleKey: keyof T,
  disableCheckbox?: (data: T) => boolean
): RcTreeNode[] => {
  // Create a map for quick lookup of nodes by their key
  const nodeMap = new Map<string, RcTreeNode>();
  const rootNodes: RcTreeNode[] = [];

  // First pass: create all nodes
  items.forEach((item) => {
    const nodeKey = String(item[key]);
    const node: RcTreeNode = {
      key: nodeKey,
      title: String(item[titleKey]),
      data: item,
      disableCheckbox: disableCheckbox?.(item) ?? false,
      children: []
    };
    nodeMap.set(nodeKey, node);
  });

  // Second pass: build the tree structure
  items.forEach((item) => {
    const node = nodeMap.get(String(item[key]));
    if (!node) return;

    const itemParentKey = item[parentKey];
    const parentNode = itemParentKey ? nodeMap.get(String(itemParentKey)) : null;

    if (parentNode) {
      if (!parentNode.children) {
        parentNode.children = [];
      }
      parentNode.children.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  return rootNodes;
};

/**
 * 트리 구조에서 title을 기준으로 노드를 검색하는 함수
 * @param treeData - 검색할 트리 데이터
 * @param searchTitle - 검색할 title (포함 검색)
 * @param conditionKeys - 검색 조건이 되는 키 배열
 * @returns 검색된 노드들과 상위 경로를 포함한 트리 구조 결과
 */
export const searchTreeNodes = <T>(treeData: RcTreeNode<T>[], searchTitle: string, conditionKeys?: (keyof T)[]): RcTreeNode[] => {
  const foundKeys = new Set<string>();

  // 노드와 모든 하위 노드를 포함하는 헬퍼 함수
  function includeAllChildren(node: RcTreeNode): RcTreeNode {
    return {
      ...node,
      children: node.children?.map((child) => includeAllChildren(child)) || undefined
    };
  }

  function searchRecursive(nodes: RcTreeNode[]): RcTreeNode[] {
    const result: RcTreeNode[] = [];

    for (const node of nodes) {
      // 현재 노드의 title이 검색어를 포함하는지 확인
      const isCurrentMatch = node.title?.toString().toLowerCase().includes(searchTitle.toLowerCase());

      // conditionKeys or로 매칭되는 검색결과 확인 ( data )
      let isConditionMatch = false;

      if (conditionKeys) {
        for (const key of conditionKeys) {
          if (node.data && node.data[key]?.toString().toLowerCase().includes(searchTitle.toLowerCase())) {
            isConditionMatch = true;
            break;
          }
        }
      }

      if (isCurrentMatch || isConditionMatch) {
        // 현재 노드가 매칭되면 이 노드와 모든 하위 노드를 포함
        if (!foundKeys.has(node.key.toString())) {
          foundKeys.add(node.key.toString());

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
            if (!foundKeys.has(node.key.toString())) {
              foundKeys.add(node.key.toString());

              const newNode: RcTreeNode = {
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

/**
 * 트리에서 특정 노드를 수정합니다.
 * @param data - 수정할 트리 데이터 배열
 * @param node - 새로운 노드 데이터
 * @returns 수정된 트리 데이터 배열
 */
export const modifyNode = (data: RcTreeNode[], node: RcTreeNode) => {
  const modifyDataRecursive = (item: RcTreeNode): RcTreeNode => {
    if (item.key === node.key) {
      return {
        ...node
      };
    }

    if (item.children) {
      return {
        ...item,
        children: item.children.map((child) => modifyDataRecursive(child))
      };
    }

    return item;
  };

  return data.map((item) => modifyDataRecursive(item));
};

/**
 * 주어진 키들을 가진 노드들로 구성된 트리를 반환합니다.
 * @param treeData - 검색할 트리 데이터
 * @param keys - 포함시킬 노드의 키 배열
 * @returns 필터링된 트리 구조 (키에 해당하는 노드들과 그들의 상위 노드들 포함)
 */
export const filterTreeByKeys = (treeData: RcTreeNode[], keys: string[]): RcTreeNode[] => {
  const keySet = new Set<string>([]);

  function filterNodes(nodes: RcTreeNode[]): RcTreeNode[] {
    const result: RcTreeNode[] = [];

    for (const node of nodes) {
      // 현재 노드가 키 목록에 있는지 확인
      const isIncluded = keys.includes(node.key.toString());

      // 하위 노드에서 필터링된 노드들 가져오기
      let filteredChildren: RcTreeNode[] | null = [];
      if (node.children && node.children.length > 0) {
        filteredChildren = filterNodes(node.children);
      } else {
        filteredChildren = null;
      }

      // 현재 노드가 키 목록에 있거나, 필터링된 하위 노드가 있는 경우
      if (isIncluded || (filteredChildren && filteredChildren.length > 0)) {
        // 중복 체크
        if (!keySet.has(node.key.toString())) {
          keySet.add(node.key.toString());

          // 새로운 노드 객체 생성 (원본 데이터 수정 방지)
          const newNode: RcTreeNode = {
            ...node,
            children: filteredChildren || node.children
          };

          result.push(newNode);
        }
      }
    }

    return result;
  }

  return filterNodes(treeData);
};

export const setDisableCheckbox = (data: RcTreeNode[], disableCheckbox?: (item: RcTreeNode) => boolean) => {
  const modifyDataRecursive = (item: RcTreeNode): RcTreeNode => {
    if (item.children) {
      return {
        ...item,
        disableCheckbox: disableCheckbox ? disableCheckbox(item) : false,
        children: item.children.map((child) => modifyDataRecursive(child))
      };
    }

    return {
      ...item,
      disableCheckbox: disableCheckbox ? disableCheckbox(item) : false
    };
  };

  return data.map((item) => modifyDataRecursive(item));
};
