import {
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { isUserLoggedIn } from "~/utils/auth.supabase.server";
import React from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Create an account" }];
};

// add the loader
export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (await isUserLoggedIn(request)) {
    throw redirect("/dashboard");
  }
  return {
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    },
  };
};

export function action() {
  return redirect("/dashboard");
}

export default function Index() {
  const { env } = useLoaderData<typeof loader>();
  const supabase = createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  const inputForm = React.useRef<HTMLFormElement>();

  const doCreateAccount = async () => {
    const form = inputForm.current;
    if (!form) return;
    const formData = new FormData(form);

    const { name, email, password } = Object.fromEntries(formData.entries());
    const { data, error } = await supabase.auth.signUp({
      email: email as string,
      password: password as string,
      options: { data: { first_name: name } },
    });

    if (error) {
      return;
    }

    if (data.session) {
      redirect("/dashboard");
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Create Account </h1>
      <form method="post" ref={inputForm as React.RefObject<HTMLFormElement>}>
        <label className="block" htmlFor="name">
          Preferred Name
        </label>
        <input type="text" name="name" placeholder="username" required />
        <label className="block" htmlFor="email">
          Email
        </label>
        <input type="email" name="email" placeholder="email" required />
        <label className="block" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="password"
          required
        />
        <button type="button" onClick={() => doCreateAccount()}>
          CREATE ACCOUNT
        </button>
      </form>
      <Link to="/signin">Sign In</Link>
    </div>
  );
}
