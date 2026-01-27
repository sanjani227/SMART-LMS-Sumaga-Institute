import { z } from "zod";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // Minimum 6 characters, at least one letter and one number

export const loginSchema = z.object({
    email: z.string().regex(emailRegex, { message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z.object({
    firstName: z
        .string()
        .min(1, { message: "First name is required" })
        .regex(/^[a-zA-Z]+$/, { message: "First name must only contain letters" }),
    lastName: z
        .string()
        .min(1, { message: "Last name is required" })
        .regex(/^[a-zA-Z]+$/, { message: "Last name must only contain letters" }),
    email: z.string().regex(emailRegex, { message: "Invalid email address" }),
    password: z.string().regex(passwordRegex, { message: "Password must be at least 6 characters and contain both letters and numbers" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
