import { v4 } from 'uuid';
import { create } from 'zustand';

interface TabStatus {
  tabName: string;
  activeTab: number;
}

interface CommonTabStore {
  tabStatus: TabStatus;
  setTabStatus: (status: TabStatus) => void;
}

const useCommonTabStore = create<CommonTabStore>((set) => ({
  tabStatus: { activeTab: 0, tabName: v4() },
  setTabStatus: (status) => set({ tabStatus: status })
}));

export default useCommonTabStore;
