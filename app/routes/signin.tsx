import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useOutletContext } from "@remix-run/react";
import { OutletContext } from "~/types";
import {
  isUserLoggedIn,
  signInWithPassword,
} from "~/utils/auth.supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (await isUserLoggedIn(request)) {
    throw redirect("/dashboard");
  }
  return null;
};
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const error = await signInWithPassword(request, credentials, "/");
  return error;
}
export default function SignIn() {
  const actionResponse = useActionData<typeof action>();
  const { supabase } = useOutletContext<OutletContext>();
  const handleGoogleIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: {
          prompt: "consent",
        },
      },
    });
    if (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Form method="post">
        {!actionResponse ? null : <h3>{actionResponse?.error}</h3>}
        <input type="email" name="email" placeholder="Your Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <br />
        <button type="submit">Sign In</button>
      </Form>
      <button onClick={handleGoogleIn}>Sign In with Google</button>
    </>
  );
}
