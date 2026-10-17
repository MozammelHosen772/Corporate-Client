import { z } from "zod";

/* =========================
   REGISTER SCHEMA
========================= */
export const registerUserValidationZodSchema = z
  .object({
    name: z.string().min(2, { message: "Name is required" }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address"),

    address: z.string().optional(),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/(?=.*[A-Z])/, {
        message: "Password must contain 1 uppercase letter.",
      })
      .regex(/(?=.*\d)/, {
        message: "Password must contain 1 number.",
      }),

    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* =========================
   LOGIN SCHEMA (FIXED)
========================= */
/* =========================
   LOGIN SCHEMA
========================= */
export const loginValidationZodSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .email("Please enter a valid email address"),

  // login-e strength check na, shudhu khali kina dekhbe,
  // jate purano weak password-er user-ra dhukte pare
  password: z.string().min(1, { message: "Password is required" }).max(100),
});

/* =========================
   RESET PASSWORD
========================= */
export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPasswordSchema = z.object({
  phone: z.string().regex(/^\+8801\d{9}$/, {
    message: "Enter valid phone number",
  }),
});

/* =========================
   CHANGE PASSWORD
========================= */
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
