import {
  type MetaFunction,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { json, Link, Outlet } from "@remix-run/react";
import { BreadcrumbsItem } from "../components/Breadcrumbs/BreadcrumbsItem";
import { Breadcrumbs } from "~/components/Breadcrumbs/Breadcrumbs";
import { getUser } from "~/utils/auth.supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const handle = {
  breadcrumb: () => (
    <BreadcrumbsItem href="/dashboard">Dashboard</BreadcrumbsItem>
  ),
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!user) {
    return redirect("/");
  }
  return json(user);
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix - DASHBOARD PAGE</h1>
      <Breadcrumbs />

      <div>
        DASHBOARD MENU
        <ul>
          <li>
            <Link to="/dashboard">Dashboard Home</Link>
          </li>
          <li>
            <Link to="/dashboard/about">Dashboard About</Link>
          </li>
          <li>
            <Link to="/dashboard/contact">Dashboard Contact</Link>
          </li>
        </ul>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
