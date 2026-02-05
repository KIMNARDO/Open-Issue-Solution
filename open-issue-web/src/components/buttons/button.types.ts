import { GroupAuthKey } from 'api/system/user/user.types';
import { ReactNode } from 'react';

export interface CommonButtonOptions {
  icon?: ReactNode;
  loading?: boolean;
  icononly?: 'true' | 'false';
  tooltip?: string;
  authTargetPath?: string;
  authkey?: GroupAuthKey;
}
