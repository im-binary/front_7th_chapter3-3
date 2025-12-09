import { useState } from "react";

/**
 * Form 상태를 관리하는 generic hook
 * 단일 책임: Form 데이터 상태 관리만 담당
 */
export const useFormState = <T extends object>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateForm = (data: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  return {
    formData,
    setFormData,
    updateField,
    updateForm,
    resetForm,
  };
};
