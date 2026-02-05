import { ColumnState, GridApi } from 'ag-grid-community';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GridState {
  [k: string]: ColumnState[];
}

interface GridStateStore {
  state: GridState;
  setState: (newState: GridState) => void;
  resetState: () => void;
  updateState: (api: GridApi, id: string) => void;
}

export const useGridStateStore = create<GridStateStore>()(
  persist(
    (set) => ({
      state: {},
      setState: (newState: GridState) => set({ state: newState }),
      resetState: () => set({ state: { columnDefs: [], rowData: [] } }),
      updateState: (api: GridApi, id: string) => {
        set((prevState) => ({ ...prevState, state: { ...prevState.state, [id]: api.getColumnState() } }));
      }
    }),
    { name: 'gridState-storage' }
  )
);
