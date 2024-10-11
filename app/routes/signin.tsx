import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
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
  const error = await signInWithPassword(request, "/");
  return error;
}

export default function SignIn() {
  const actionResponse = useActionData<typeof action>();
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
    </>
  );
}
