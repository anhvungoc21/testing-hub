import { forwardRef } from "react";
import Link from "next/link";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { signOut } from "next-auth/react";

const MyLink = forwardRef((props, ref) => {
  let { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  );
});

export default function Dropdown() {
  return (
    <div>
      <UncontrolledDropdown className="h-full" nav inNavbar>
        <DropdownToggle nav caret className="">
          My Account
        </DropdownToggle>
        <DropdownMenu className="relative h-[15vh] p-0" right>
          <DropdownItem className="h-1/3 py-0" href="/testing">
            My Hub
          </DropdownItem>
          <DropdownItem className="h=1/3 py-0" href="/account">
            Settings
          </DropdownItem>
          <DropdownItem className="py-0 m-0" divider />
          <DropdownItem
            className="h-1/3 pt-0"
            onClick={() => signOut({ callbackUrl: "http://localhost:3000/" })}
          >
            Sign out
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
}
