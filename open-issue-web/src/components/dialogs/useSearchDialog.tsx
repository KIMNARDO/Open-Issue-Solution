import { useCallback, useState } from 'react';
import SearchDialog from './SearchDialog';
import { SearchDialogProps } from './SearchDialog.types';

type UseSearchDialogOptions<T> = Omit<SearchDialogProps<T>, 'open' | 'onClose'>;

/**
 * SearchDialog를 쉽게 사용하기 위한 custom hook
 * @example
 * const { SearchDialogComponent, handleOpen, handleClose } = useSearchDialog({
 *   title: '사용자 검색',
 *   searchConditions: [...],
 *   columnDefs: [...],
 *   onSearch: async (params) => {...},
 *   onSelect: (rows) => {...}
 * });
 */
function useSearchDialog<T = any>(options: UseSearchDialogOptions<T>) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const SearchDialogComponent = useCallback(
    () => <SearchDialog<T> {...options} open={open} onClose={handleClose} />,
    [options, open, handleClose]
  );

  return {
    SearchDialogComponent,
    handleOpen,
    handleClose,
    isOpen: open
  };
}

export default useSearchDialog;
