import { useState } from "react";

/**
 * Dialog 상태를 관리하는 hook
 * 단일 책임: Dialog 열림/닫힘 상태만 담당
 */
export const useDialogState = (initialOpen = false) => {
  const [open, setOpen] = useState(initialOpen);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);
  const toggleDialog = () => setOpen((prev) => !prev);

  return {
    open,
    setOpen,
    openDialog,
    closeDialog,
    toggleDialog,
  };
};
