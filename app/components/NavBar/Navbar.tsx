import { NavigationLink } from "./Navigation-link";

const Navbar = () => {
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
            className="font-semibold font-suse text-lg text-orange-500"
          >
            {" "}
            Products
          </NavigationLink>
          <NavigationLink
            to="/contacts"
            className="font-semibold font-suse text-lg text-orange-500"
          >
            {"Contact"}
          </NavigationLink>
          <NavigationLink
            to="/about"
            className="font-semibold font-suse text-lg text-orange-500"
          >
            {"About"}
          </NavigationLink>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
