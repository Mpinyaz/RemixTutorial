import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "~/utils/supabase.server";
export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabase, headers } = createSupabaseServerClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return redirect("/");
  }
  await supabase.auth.signOut();

  return redirect("/", {
    headers,
  });
};
