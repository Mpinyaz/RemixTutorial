import { Outlet } from "@remix-run/react";
import { BreadcrumbsItem } from "~/components/Breadcrumbs/BreadcrumbsItem";
import Navbar from "~/components/NavBar/Navbar";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Products" }];
};
export const handle = {
  breadcrumb: () => (
    <BreadcrumbsItem href="/products">Contacts</BreadcrumbsItem>
  ),
};

export default function Products() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
