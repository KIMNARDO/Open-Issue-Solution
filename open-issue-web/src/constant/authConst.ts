import { BPolicyAuth } from 'api/common/common.types';

const bpolicyAuthType = ['View', 'Modify', 'Promote', 'Relation', 'Delete', 'Download', 'MemberModify'] as const;

type BPolicyAuthType = (typeof bpolicyAuthType)[number];

export const BASIC_AUTH: Record<'ADMIN' | 'OWNER' | 'PUBLIC', Record<BPolicyAuthType, Partial<BPolicyAuth>>> = {
  ADMIN: {
    ...bpolicyAuthType.reduce(
      (acc, type) => {
        acc[type] = { authDiv: 'Admin', authNm: type };
        return acc;
      },
      {} as Record<BPolicyAuthType, Partial<BPolicyAuth>>
    )
  },
  OWNER: {
    ...bpolicyAuthType.reduce(
      (acc, type) => {
        acc[type] = { authDiv: 'OWNER', authNm: type };
        return acc;
      },
      {} as Record<BPolicyAuthType, Partial<BPolicyAuth>>
    )
  },
  PUBLIC: {
    ...bpolicyAuthType.reduce(
      (acc, type) => {
        acc[type] = { authDiv: 'PUBLIC', authNm: type };
        return acc;
      },
      {} as Record<BPolicyAuthType, Partial<BPolicyAuth>>
    )
  }
};
