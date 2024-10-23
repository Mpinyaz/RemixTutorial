import {
  type LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Link, useNavigate, useOutletContext } from "@remix-run/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { OutletContext, SignInSchema } from "~/types";
import { isUserLoggedIn } from "~/utils/auth.supabase.server";
import { z } from "zod";

type SignIn = z.infer<typeof SignInSchema>;
type FormErrors = Partial<Record<keyof SignIn, string[]>>;

export const meta: MetaFunction = () => {
  return [{ title: "Cross Grain Studios | User Sign In" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (await isUserLoggedIn(request)) {
    throw redirect("/dashboard");
  }
  return null;
};

export default function SignIn() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<SignIn>({
    email: "",
    password: "",
  });

  const { supabase } = useOutletContext<OutletContext>();

  const validateForm = (data: SignIn, field?: keyof SignIn): FormErrors => {
    try {
      SignInSchema.parse(data);
      return field ? { [field]: [] } : {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.flatten().fieldErrors;
        return field
          ? { [field]: newErrors[field] || [] }
          : (newErrors as FormErrors);
      }
      return {};
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof SignIn
  ) => {
    const newValue = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: newValue }));

    // Validate single field as user types
    const fieldErrors = validateForm({ ...formData, [field]: newValue }, field);
    setErrors((prev) => ({ ...prev, ...fieldErrors }));
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          toast.error(error.message);
          setErrors({ password: ["Invalid email or password"] });
          return;
        }
        if (data?.session) {
          navigate("/dashboard");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
          queryParams: { prompt: "consent" },
        },
      });

      if (error) throw error;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to sign in with Google"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md bg-zinc-500 p-6 rounded-lg shadow-[5px_5px_rgba(255,_255,_255,_0.4),_10px_10px_rgba(255,_255,_255,_0.3),_15px_15px_rgba(255,_255,_255,_0.2),_20px_20px_rgba(255,_255,_255,_0.1),_25px_25px_rgba(255,_255,_255,_0.05)]">
        <h1 className="text-orange-500 text-4xl mb-4 text-center font-bold">
          Sign In - CrossGrain Studios
        </h1>

        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-lg space-y-4"
        >
          <div>
            <label htmlFor="email" className="block font-bold italic mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange(e, "email")}
              className={`block w-full p-2 rounded-lg border ${
                errors.email?.length
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-gray-50"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Your Email"
            />
            {errors.email?.length > 0 && (
              <span className="text-sm text-red-600 mt-1">
                {errors.email[0]}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block font-bold italic mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange(e, "password")}
                className={`block w-full p-2 rounded-lg border ${
                  errors.password?.length
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password?.length > 0 && (
              <span className="text-sm text-red-600 mt-1">
                {errors.password[0]}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 mt-6">
            <button
              type="submit"
              className="w-full max-w-xs p-2 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:ring-4 focus:ring-blue-300"
            >
              Sign In
            </button>

            <div className="w-full flex items-center gap-4 before:flex-1 before:border-t before:border-gray-300 after:flex-1 after:border-t after:border-gray-300">
              <span className="text-gray-500">or</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full max-w-xs p-2 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-2"
            >
              <FcGoogle size={20} />
              <span>Sign In with Google</span>
            </button>
          </div>
        </form>

        <div className="flex justify-between mt-4 px-2">
          <Link
            to="/resetpassword"
            className="text-orange-500 hover:text-orange-600"
          >
            Forgot Password?
          </Link>
          <Link to="/signup" className="text-orange-500 hover:text-orange-600">
            Need an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
