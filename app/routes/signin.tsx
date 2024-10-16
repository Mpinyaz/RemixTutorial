import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import {
  isUserLoggedIn,
  signInWithGoogle,
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
  const signinMethod = formData.get("signin");

  if (signinMethod === "credentials") {
    const credentials = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    const error = await signInWithPassword(request, credentials, "/");
    return error;
  }

  if (signinMethod === "google") {
    const response = await signInWithGoogle(request);
    const { data, headers } = await response.json();
    return redirect(data.url!, { headers: headers });
  }
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
        <button type="submit" name="signin" value="credentials">
          Sign In
        </button>
      </Form>
      <Form method="post">
        <button type="submit" name="signin" value="google">
          Sign In with Google
        </button>
      </Form>
    </>
  );
}
