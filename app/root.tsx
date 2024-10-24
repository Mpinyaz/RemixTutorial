import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
  type ErrorResponse,
  Outlet,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import "./tailwind.css";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "./utils/supabase.server";
import { json } from "@remix-run/node";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { getSession } from "./utils/auth.supabase.server";
import { Toaster } from "react-hot-toast";
import NotFound from "./components/NotFound";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_PUBLIC_KEY: process.env.SUPABASE_ANON_KEY!,
  };
  const { headers } = createSupabaseServerClient(request);
  const session = await getSession(request);

  return json({ env, session, headers });
};
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=SUSE:wght@100..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { env, session } = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();
  const [supabase] = useState(() =>
    createBrowserClient(env.SUPABASE_URL, env.SUPABASE_PUBLIC_KEY)
  );

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        revalidate();
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, serverAccessToken, revalidate]);
  return <Outlet context={{ supabase, session }} />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFound />;
    }

    throw new Error(`${error.status} ${error.statusText}`);
  }

  throw new Error(error instanceof Error ? error.message : "Unknown Error");
}
