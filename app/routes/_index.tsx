import type { MetaFunction } from "@remix-run/node";
import { BreadcrumbsItem } from "../components/Breadcrumbs/BreadcrumbsItem";
import { Breadcrumbs } from "~/components/Breadcrumbs/Breadcrumbs";
import Navbar from "~/components/NavBar/Navbar";
export const meta: MetaFunction = () => {
  return [
    { title: "Cross Gain Studios" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const handle = {
  breadcrumb: () => <BreadcrumbsItem href="/">Home</BreadcrumbsItem>,
};

export default function Index() {
  return (
    <div className="font-sans">
      <Navbar />
      <Breadcrumbs />
    </div>
  );
}
