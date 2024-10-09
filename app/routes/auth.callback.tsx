import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/utils/supabase.server";
export const loader = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const { supabase, headers } = createSupabaseServerClient(request);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return redirect("/signin");
    }
    return redirect("/dashboard", {
      headers,
    });
  }
  return new Response("Authentication failed", {
    status: 400,
  });
};
