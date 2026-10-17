import { getInputFieldError, IInputErrorState } from "@/lib/getInputFieldError";
import { FieldDescription } from "../components/ui/field";

interface InputFieldErrorProps {
  field: string;
  state?: IInputErrorState | null;
}

const InputFieldError = ({ field, state }: InputFieldErrorProps) => {
  const errorMessage = getInputFieldError(field, state);

  if (!errorMessage) return null;

  return (
    <FieldDescription className="text-red-600 text-sm mt-1">
      {errorMessage}
    </FieldDescription>
  );
};

export default InputFieldError;
