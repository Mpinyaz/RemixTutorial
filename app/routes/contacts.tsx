import { Outlet } from "@remix-run/react";
import { BreadcrumbsItem } from "~/components/Breadcrumbs/BreadcrumbsItem";
import Navbar from "~/components/NavBar/Navbar";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Contact Us" }];
};
export const handle = {
  breadcrumb: () => (
    <BreadcrumbsItem href="/contacts">Contacts</BreadcrumbsItem>
  ),
};

export default function Contacts() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
