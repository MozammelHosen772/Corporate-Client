import { z } from "zod";

export const zodValidator = <T>(payload: T, schema: z.ZodTypeAny) => {
  const result = schema.safeParse(payload);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message || "Validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    };
  }

  return {
    success: true,
    data: result.data,
  };
};
