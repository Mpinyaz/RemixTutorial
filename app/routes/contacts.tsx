import { Outlet } from "@remix-run/react";
import { BreadcrumbsItem } from "~/components/Breadcrumbs/BreadcrumbsItem";

export const handle = {
  breadcrumb: () => (
    <BreadcrumbsItem href="/contacts">Contacts</BreadcrumbsItem>
  ),
};

export default function Contacts() {
  return <Outlet />;
}
