import {
  Link,
  useNavigate,
  useOutletContext,
  redirect,
} from "@remix-run/react";
import { toast } from "react-hot-toast";
import React, { ChangeEvent, useEffect, useState } from "react";
import { OutletContext } from "~/types";
import { z } from "zod";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { isUserLoggedIn } from "~/utils/auth.supabase.server";
import ProgressBar from "~/components/ProgressBar";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (await isUserLoggedIn(request)) {
    return redirect("/");
  }
  return null;
};
export default function SignUp() {
  const navigate = useNavigate();
  const { supabase } = useOutletContext<OutletContext>();
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length > 6) score += 1;
    if (pwd.length > 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    setStrength(score);
  };
  const getStrengthColor = () => {
    if (strength <= 2) return "#f56565"; // red
    if (strength <= 4) return "#ecc94b"; // yellow
    return "#48bb78"; // green
  };
  const SignUpSchema = z.object({
    fullname: z.string().min(1, "Full name is required"),
    password: z.string().min(6, "Password must have more than 6 characters"),
    email: z.string().trim().email("Invalid email address"),
  });

  type SignUp = z.infer<typeof SignUpSchema>;
  type FormErrors = Partial<Record<keyof SignUp, string[]>>;
  const [formData, setFormData] = useState<SignUp>({
    fullname: "",
    password: "",
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isEmailUnique, setIsEmailUnique] = useState(true);
  const validateForm = (data: SignUp, field?: keyof FormData): FormErrors => {
    try {
      SignUpSchema.parse(data);
      return field ? { [field]: [] } : {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.flatten().fieldErrors;
        return field ? { [field]: newErrors[field] || [] } : newErrors;
      }
      return {};
    }
  };
  const checkEmailExists = async (email: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("email", email);

    if (error) {
      console.error("Error checking email: ", error);
      return false;
    }

    return data.length > 0;
  };
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = validateForm(formData);
    setErrors(newErrors);
    const emailExists = await checkEmailExists(formData.email);
    setIsEmailUnique(!emailExists);

    if (isEmailUnique) {
      toast.error("Email already in use!");
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: ["Email already in use!"],
      }));
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${location.origin}/auth/credentials`,
          data: {
            fullname: formData.fullname,
          },
        },
      });

      if (error) {
        toast.error("Error signing up: " + error.message);
        return;
      }

      if (data) {
        toast.success("A verification link has been sent to your email");
        navigate("/");
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    if (name == "password") {
      calculateStrength(value);
      setPassword(value);
    }
    const newErrors = validateForm(updatedFormData);
    setErrors(newErrors);
  };
  useEffect(() => {
    calculateStrength(password);
  }, [password]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        <form onSubmit={handleLogin} className="space-y-4">
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
              onChange={handleChange}
              value={formData.fullname}
            />
            {errors.fullname && (
              <span className="text-sm italic text-red-800">
                {errors.fullname[0]}
              </span>
            )}
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
              onChange={handleChange}
              value={formData.email}
            />
            {errors.email && (
              <span className="text-sm italic text-red-800">
                {errors.email[0]}
              </span>
            )}
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
              onChange={handleChange}
              value={formData.password}
            />
            {errors.password && (
              <span className="text-sm italic text-red-800">
                {errors.password[0]}
              </span>
            )}
            <div className="display flex justify-center items-center space-x-2 mt-1">
              <p className="text-sm italic text-nowrap">Password Strength</p>
              <ProgressBar value={strength * 20} color={getStrengthColor()} />
            </div>
            <p className="text-sm text-muted-foreground text-end">
              {strength === 0 && ""}
              {strength === 1 && "Weak"}
              {strength === 2 && "Fair"}
              {strength === 3 && "Good"}
              {strength === 4 && "Strong"}
              {strength === 5 && "Very Strong"}
            </p>
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
