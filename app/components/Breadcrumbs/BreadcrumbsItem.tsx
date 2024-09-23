import { Link } from "@remix-run/react";
import { AnchorHTMLAttributes } from "react";
export const BreadcrumbsItem = ({
  children,
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <Link to={href || ""} itemProp="item" {...props}>
      <span itemProp="name">{children}</span>
    </Link>
  );
};
