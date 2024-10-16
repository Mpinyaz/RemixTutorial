import { NavigationLink } from "./Navigation-link";
import type { OutletContext } from "~/types";
import { useOutletContext, useNavigate } from "@remix-run/react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { session, supabase } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    // Redirect or refresh the page after sign out
    if (error) {
      toast.error(error.message);
      return;
    } else {
      navigate("/");
    }
  };
  return (
    <div className="sticky top-0 inset-x-0 bg-black pb-4 px-4 pt-1">
      <nav className="flex justify-between items-center">
        <NavigationLink
          to="/"
          className="font-semibold font-suse text-lg text-orange-500"
        >
          Cross Grain Studios
        </NavigationLink>
        <div className="flex gap-x-4">
          <NavigationLink
            to="/products"
            className="hover:animate-pulse font-semibold font-suse text-lg text-orange-500"
          >
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
        <div>
          {session?.user ? (
            <button
              className="hover:animate-pulse font-semibold font-suse text-lg text-orange-500"
              onClick={handleSignOut}
            >
              Sign Out, {session.user.email}
            </button>
          ) : (
            <NavigationLink
              to="/signin"
              className="hover:animate-pulse font-semibold font-suse text-lg text-orange-500"
            >
              {"Sign In"}
            </NavigationLink>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
