import {
  type LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import {
  Form,
  json,
  Link,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { OutletContext } from "~/types";
import { z } from "zod";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { getUser, isUserLoggedIn } from "~/utils/auth.supabase.server";

export const meta: MetaFunction = () => {
  return [{ title: "Cross Gain Studios | Reset Password" }];
};

const ResetPaswdSchema = z.object({ email: z.string().email() });
type ResetPaswd = z.infer<typeof ResetPaswdSchema>;
type FormErrors = Partial<Record<keyof ResetPaswd, string[]>>;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const chngPaswd = searchParams.has("changepassword");
  const isLoggedIn = await isUserLoggedIn(request);

  if (chngPaswd && !isLoggedIn) {
    throw redirect("/");
  }

  if (!chngPaswd && isLoggedIn) {
    throw redirect("/");
  }

  const data = await getUser(request);
  return json({ outcome: chngPaswd, email: data?.email });
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const { supabase } = useOutletContext<OutletContext>();
  const { outcome: isChngPasswd, email: loggedInEmail } =
    useLoaderData<typeof loader>();
  const [formData, setFormData] = useState<ResetPaswd>({
    email: loggedInEmail || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const validateForm = (
    data: ResetPaswd,
    field?: keyof FormData
  ): FormErrors => {
    try {
      ResetPaswdSchema.parse(data);
      return field ? { [field]: [] } : {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.flatten().fieldErrors;
        return field ? { [field]: newErrors[field] || [] } : newErrors;
      }
      return {};
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    const newErrors = validateForm(updatedFormData);
    setErrors(newErrors);
  };
  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: `${location.origin}/auth/update-password`,
        }
      );
      if (error) {
        toast.error("Error: " + error.message);
        return;
      }
      if (data) {
        toast.success("Success! Check your email to reset your password");
        navigate("/");
      }
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md bg-zinc-500 p-6 rounded-lg shadow-[5px_5px_rgba(255,_255,_255,_0.4),_10px_10px_rgba(255,_255,_255,_0.3),_15px_15px_rgba(255,_255,_255,_0.2),_20px_20px_rgba(255,_255,_255,_0.1),_25px_25px_rgba(255,_255,_255,_0.05)]">
        <Form method="post" className="w-full" onSubmit={handleReset}>
          <fieldset>
            <legend className="text-orange-500 text-2xl font-bold">
              {isChngPasswd ? "Change" : "Reset"} Password
            </legend>
            <p className="p-2 italic font-bold">
              Please enter your email address so we can send you the link to{" "}
              {isChngPasswd ? "change " : "reset "}
              your password.
            </p>
            <div style={{ margin: 5 }}>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={!!loggedInEmail}
                placeholder="Your Email"
                className={`w-full px-4 py-3 bg-white/5 border ${
                  errors.email?.length
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10 focus:border-blue-500"
                } rounded-lg outline-none transition-colors duration-200 text-white placeholder-gray-400
                    focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              {errors.email && (
                <span className="text-red-600 italic font-bold">
                  {errors.email[0]}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center gap-4 pt-2">
              <button
                className="flex-1 justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm font-medium text-xl text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                type="submit"
              >
                Reset password
              </button>
              <Link
                className="bg-red-500 hover:bg-red-600 rounded-lg hover:text-white py-3 px-6 text-xl font-medium"
                to={`/`}
              >
                Cancel
              </Link>
            </div>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
