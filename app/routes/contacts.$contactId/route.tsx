import { json, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { BreadcrumbsItem } from "~/components/Breadcrumbs/BreadcrumbsItem";
import { Breadcrumbs } from "~/components/Breadcrumbs/Breadcrumbs";
export async function loader({ params }: LoaderFunctionArgs) {
  return json({
    id: params.contactId,
    name: "Ryan",
    date: new Date(),
    title: "Example Contacts",
    slug: "Deetz",
  });
}

export const handle = {
  breadcrumb: (data: { title: string; id: string }) => (
    <BreadcrumbsItem href={`/contacts/${data.id}`}>
      {data.title}
    </BreadcrumbsItem>
  ),
};
export default function SomeRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <Breadcrumbs />
      <div>{data.id}</div>
      <div>{data.name}</div>
      <div>{data.date}</div>
    </>
  );
}
