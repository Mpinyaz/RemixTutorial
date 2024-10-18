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
    <>
      <h1 className="font-suse text-orange-600 text-2xl">
        {isChngPasswd ? "Change" : "Reset"} Password
      </h1>
      <Form method="post" className="w-1/2" onSubmit={handleReset}>
        <fieldset>
          <legend>{isChngPasswd ? "Change" : "Reset"} Password</legend>
          <p>
            Please enter your email address so we can send you the link to{" "}
            {isChngPasswd ? "change " : "reset "}
            your password.
          </p>
          <div style={{ margin: 5 }}>
            <label>
              Email{" "}
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={!!loggedInEmail}
              />
            </label>
            {errors.email && <span>{errors.email[0]}</span>}
          </div>
          <div style={{ margin: 5 }}>
            <button type="submit">Reset password</button>
            <Link style={{ marginLeft: 10 }} to={`/`}>
              Cancel
            </Link>
          </div>
        </fieldset>
      </Form>
    </>
  );
}
