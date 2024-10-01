import { NavLink, type NavLinkProps } from "@remix-run/react";
import { type ElementRef, forwardRef } from "react";

export const NavigationLink = forwardRef<
  ElementRef<typeof NavLink>,
  NavLinkProps
>(({ ...props }, ref) => {
  return <NavLink ref={ref} {...props}></NavLink>;
});

NavigationLink.displayName = "NavigationLink";
