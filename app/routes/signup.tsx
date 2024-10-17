import { Link, useNavigate, useOutletContext } from "@remix-run/react";
import { toast } from "react-hot-toast";
import React, { useRef } from "react";
import { OutletContext } from "~/types";

export default function SignUp() {
  const navigate = useNavigate();
  const { supabase } = useOutletContext<OutletContext>();
  const inputForm = useRef<HTMLFormElement>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior

    if (!inputForm.current) return;

    const formData = new FormData(inputForm.current);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullname") as string;

    // Supabase sign up logic
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:5173/auth/credentials",
        data: {
          fullname: fullName,
        },
      },
    });

    if (error) {
      toast.error("Error signing up: " + error.message);
      return;
    }

    if (data) {
      toast.success("A verification link has been sent to your email");
      navigate("/"); // Navigate to homepage or a success page
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        <form
          ref={inputForm}
          onSubmit={handleLogin} // Call handleLogin on form submission
          className="space-y-4"
        >
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
        </form>

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
