import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
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
export async function loader({ request }: LoaderFunctionArgs) {
  const headers = new Headers();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );

  const userResponse = await supabase.auth.getUser();
  if (!userResponse?.data?.user) {
    return redirect("/signin");
  }

  return new Response("...", {
    headers,
  });
}
export default function Index() {
  return (
    <>
      {" "}
      <div className="font-suse">
        <Navbar />
        <Breadcrumbs />
      </div>
      <div className="flex w-full justify-center">
        <h1 className="font-bold text-5xl animate-in fade-in duration-1000 delay-1000 flex flex-wrap items-center">
          <img
            className="rounded-full w-20 h-20"
            src="../../public/assets/CROSS GRAIN LOGO abbr.jpg"
            alt="logo"
          />
          Cross Grain Studios
        </h1>
      </div>
    </>
  );
}
