export interface IInputErrorState {
  success: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}

export const getInputFieldError = (
  fieldName: string,
  state?: IInputErrorState | null,
) => {
  if (!state?.errors?.length) return null;

  const error = state.errors.find((err) => err.field === fieldName);
  return error?.message || null;
};
