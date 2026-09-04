import { z } from "zod";
export const UserRegisterSchema = z.object({
  name: z.string(),
  email: z.email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(32, { message: "Password cannot exceed 32 characters" }),
});

export type UserRegisterType = z.infer<typeof UserRegisterSchema>;
