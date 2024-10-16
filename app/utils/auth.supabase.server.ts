import { json, redirect } from "@remix-run/react";
import { createSupabaseServerClient } from "./supabase.server";

export const signInWithGoogle = async (
  request: Request,
  successRedirectPath: string = "http://localhost:5173/auth/callback"
) => {
  const { supabase, headers } = createSupabaseServerClient(request);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: successRedirectPath,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  return json({
    ok: !error && data ? true : false,
    data: data,
    error: error ? error.message : "Sign In error occurred",
    headers: headers,
  });
};
export const signInWithPassword = async (
  request: Request,
  credentials: { email: string; password: string },
  successRedirectPath: string
) => {
  const { supabase, headers } = createSupabaseServerClient(request);
  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (!error) {
    throw redirect(successRedirectPath, { headers: headers });
  }
  return json({ error: error.message });
};

export const signOut = async (
  request: Request,
  successRedirectPath: string = "/"
) => {
  const { supabase, headers } = createSupabaseServerClient(request);
  const { error } = await supabase.auth.signOut();
  if (!error) {
    return redirect(successRedirectPath, { headers: headers });
  }
  return json({ error: error.message });
};

export const getUser = async (request: Request) => {
  const { supabase } = createSupabaseServerClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user || null;
};
export const getSession = async (request: Request) => {
  const { supabase } = createSupabaseServerClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session || null;
};
export const isUserLoggedIn = async (request: Request) => {
  const { supabase } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
};
