import { json, redirect } from "@remix-run/react";
import { createSupabaseServerClient } from "./supabase.server";

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

  if (error) {
    return json({ error: error.message });
  }
  return redirect(successRedirectPath, { headers: headers });
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
