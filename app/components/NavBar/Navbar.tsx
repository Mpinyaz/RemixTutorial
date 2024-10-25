import { NavigationLink } from "./Navigation-link";
import type { OutletContext } from "~/types";
import { useOutletContext, useNavigate } from "@remix-run/react";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const { session, supabase } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdown] = useState<boolean>(false);
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    } else {
      navigate("/");
    }
  };
  const dialogRef = useRef<HTMLDialogElement>(null);
  const handleSignOutClick = () => {
    dialogRef.current?.showModal();
    setDropdown(!isDropdownOpen);
  };
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClickOutside = (event: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.bottom &&
        rect.left <= event.clientX &&
        event.clientX <= rect.right;

      if (!isInDialog) {
        dialog.close();
      }
    };

    dialog.addEventListener("click", handleClickOutside);
    return () => {
      dialog.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="sticky top-0 inset-x-0 bg-black p-4">
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
          <div className="flex items-center justify-center gap-x-4">
            {session?.user ? (
              <p className="hover:animate-pulse font-semibold font-suse text-lg text-orange-500">
                {session.user.email}
              </p>
            ) : (
              <NavigationLink
                to="/signin"
                className="hover:animate-pulse font-semibold font-suse text-lg text-orange-500"
              >
                {"Sign In"}
              </NavigationLink>
            )}
            <div className="relative flex justify-center items-center">
              <button onClick={() => setDropdown(!isDropdownOpen)}>
                {isDropdownOpen ? (
                  <IoCloseSharp size={25} color={"white"} />
                ) : (
                  <GiHamburgerMenu size={25} color={"white"} />
                )}
              </button>
              {isDropdownOpen && (
                <div
                  className={`absolute bg-white w-64 top-10 right-0 p-4 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transform transition-all duration-200 ease-in-out origin-top-right ${
                    isDropdownOpen
                      ? "scale-100 opacity-100 translate-y-0"
                      : "scale-95 opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <ul>
                    <li>Need Help</li>
                    <hr></hr>
                    <li>Contact Me</li>
                    {session?.user && (
                      <li>
                        <hr />
                        <button
                          className="hover:animate-pulse font-semibold font-suse text-lg text-orange-500"
                          onClick={handleSignOutClick}
                        >
                          Sign Out
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
      <dialog
        ref={dialogRef}
        className="rounded-lg shadow-xl backdrop:bg-black backdrop:bg-opacity-25 p-0 open:animate-fade-in"
      >
        <div className="w-[400px] bg-white p-6">
          <h3 className="text-xl font-semibold text-gray-900 text-center">
            Sign Out Confirmation
          </h3>
          <div className="mt-4">
            <p className="text-sm text-gray-500 text-center">
              Are you sure you want to sign out? <br />
              You&apos;ll need to sign in again to access your account.
            </p>
          </div>
          <div className="mt-6 flex justify-center items-center gap-x-4">
            <button
              onClick={() => dialogRef.current?.close()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Navbar;
