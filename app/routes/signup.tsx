import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  json,
  type MetaFunction,
} from "@remix-run/node";
import { Link, useActionData, Form, useNavigate } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { getErrorMessage } from "~/utils/errormsg";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { isUserLoggedIn } from "~/utils/auth.supabase.server";

type ActionData =
  | { success: string } // When sign-up is successful
  | { success: boolean; error: string };
export const meta: MetaFunction = () => {
  return [{ title: "Create an account" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (await isUserLoggedIn(request)) {
    throw redirect("/");
  }

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullname") as string;
  const { supabase } = createSupabaseServerClient(request);

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:5173/auth/callback",
        data: {
          fullname: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }
    return json<ActionData>({ success: "Sign Up registered" });
  } catch (error) {
    return json<ActionData>(
      {
        success: false,
        error: getErrorMessage(error) || "An error occurred during signup.",
      },
      { status: 400 }
    );
  }
};

export default function SignUp() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.success) {
      toast.success("A verification link has been sent to your email");
      navigate("/");
    }
  }, [actionData, navigate]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        <Form method="post" className="space-y-4">
          {actionData && actionData.success === false && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {actionData.error}
            </div>
          )}

          <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-700"
            >
              Preferred Name
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Your preferred name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
