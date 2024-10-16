import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";
  const headers = new Headers();

  if (code) {
    const cookies = parseCookieHeader(request.headers.get("Cookie") ?? "");
    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookies;
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              headers.append(
                "Set-Cookie",
                serializeCookieHeader(name, value, options)
              )
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    console.log(error?.message);

    if (!error) {
      return redirect(next, { headers });
    } else {
      console.error("Error exchanging code for session", error);
    }
  }

  // return the user to an error page with instructions
  return redirect("/auth/auth-code-error", { headers });
}
