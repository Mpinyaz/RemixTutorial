import { json, redirect } from "@remix-run/react";
import { createSupabaseServerClient } from "./supabase.server";

export const signInWithPassword = async (
  request: Request,
  successRedirectPath: string
) => {
  const { supabase, headers } = createSupabaseServerClient(request);
  const formData = await request.formData();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
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
    throw redirect(successRedirectPath, { headers: headers });
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
  const sessionResponse = await supabase.auth.getSession();
  return !!sessionResponse;
};
