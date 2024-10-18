import {
  type LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Form, Link, useNavigate, useOutletContext } from "@remix-run/react";
import { OutletContext } from "~/types";
import { z } from "zod";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { isUserLoggedIn } from "~/utils/auth.supabase.server";

export const meta: MetaFunction = () => {
  return [{ title: "Cross Gain Studios | Update Password" }];
};

const ResetPaswdSchema = z
  .object({
    password: z.string().min(6, "Password must be more than 5 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be more than 5 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",

    path: ["confirmPassword"],
  });
type ResetPaswd = z.infer<typeof ResetPaswdSchema>;
type FormErrors = Partial<Record<keyof ResetPaswd, string[]>>;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userLoggedIn = await isUserLoggedIn(request);

  if (!userLoggedIn) {
    throw redirect("/");
  }
  return null;
};

export default function UpdatePassword() {
  const navigate = useNavigate();
  const { supabase } = useOutletContext<OutletContext>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState<boolean>(false);
  const [formData, setFormData] = useState<ResetPaswd>({
    password: "",
    confirmPassword: "",
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
      const { data, error } = await supabase.auth.updateUser({
        password: formData.confirmPassword,
      });
      if (error) {
        toast.error("Error: " + error.message);
        return;
      }
      if (data) {
        setIsPasswordUpdated(true);
        await supabase.auth.signOut();
        toast.success("Success! Check your email to update your password");
        navigate("/signin");
      }
    }
  };

  useEffect(() => {
    const broadcastChannel = new BroadcastChannel("password_update");
    const signOutUser = async () => {
      if (!isPasswordUpdated) {
        await supabase.auth.signOut();
        console.log("User signed out across all tabs");
        toast.error("Incomplete Update Password");
      }
    };

    broadcastChannel.onmessage = (message) => {
      if (message.data === "signOut") {
        signOutUser();
        navigate("/");
      }
    };

    return () => {
      if (!isPasswordUpdated) {
        broadcastChannel.postMessage("signOut");
      }
      broadcastChannel.close();
    };
  }, [isPasswordUpdated, supabase, navigate]);

  return (
    <>
      <h1 className="font-suse text-orange-600 text-2xl">Update Password</h1>
      <Form method="post" className="w-1/2" onSubmit={handleReset}>
        <fieldset>
          <legend>Update Password</legend>
          <div style={{ margin: 5 }}>
            <label htmlFor={"password"}>Enter new Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span>{errors.password[0]}</span>}
            <label htmlFor={"confirmPassword"}>Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <span>{errors.confirmPassword[0]}</span>}
          </div>
          <button onClick={() => setShowPassword(!showPassword)}>
            <p>{!showPassword ? "Show Password" : "Hide Password"}</p>
          </button>
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
