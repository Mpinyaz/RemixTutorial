import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

export type OutletContext = {
  supabase: SupabaseClient;
  session: Session;
};

export const SignUpSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  password: z
    .string()
    .min(6, "Password must have more than 6 characters")
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must include at least one digit." })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must include at least one special character.",
    }),
  email: z.string().trim().email("Invalid email address"),
});

export const SignInSchema = z.object({
  email: z.string().min(1, "Required").trim().email("Invalid email address"),
  password: z.string().min(1, "Required"),
});
