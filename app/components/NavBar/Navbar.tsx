import { NavigationLink } from "./Navigation-link";
import type { OutletContext } from "~/types";
import { useOutletContext } from "@remix-run/react";

const Navbar = () => {
  const { session } = useOutletContext<OutletContext>();
  return (
    <div className="sticky top-0 inset-x-0 bg-black pb-4 px-4 pt-1">
      <nav className="flex justify-between items-center">
        <NavigationLink
          to="/"
          className="font-semibold font-suse text-lg text-orange-500"
        >
          {" "}
          Cross Grain Studios
        </NavigationLink>
        <div className="flex gap-x-4">
          <NavigationLink
            to="/products"
            className="hover:animate-pulse font-semibold font-suse text-lg text-orange-500"
          >
            {" "}
            Products
          </NavigationLink>
          <NavigationLink
            to="/contacts"
            className="hover:animate-pulse font-semibold font-suse text-lg text-orange-500"
          >
            {"Contact"}
          </NavigationLink>
          <NavigationLink
            to="/about"
            className="hover:animate-pulse font-semibold font-suse text-lg text-orange-500"
          >
            {"About"}
          </NavigationLink>
        </div>
        {session?.user ? (
          <div>{"Hello User"}</div>
        ) : (
          <NavigationLink
            to="signin"
            className="hover:animate-pulse font-semibold font-suse text-lg text-orange-500"
          >
            {"Sign In"}
          </NavigationLink>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
