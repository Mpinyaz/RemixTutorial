import { NavigationLink } from "./Navigation-link";

const Navbar = () => {
  return (
    <div className="fixed top-0 pointer-events-none inset-x-0">
      <nav>
        <NavigationLink to="/"> Cross Grain Studio</NavigationLink>
      </nav>
    </div>
  );
};

export default Navbar;
