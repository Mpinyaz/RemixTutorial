import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { toast } from "react-hot-toast";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const { supabase, headers } = createSupabaseServerClient(request);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Error for code:", error);
      return redirect("/signin");
    } else {
      toast.success("User has been verified");
      return redirect("/dashboard", {
        headers,
      });
    }
  }
  return new Response("Authentication failed", {
    status: 400,
  });
};
