import { forwardRef } from "react";
import Link from "next/link";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { signOut } from "next-auth/react";

export default function Dropdown() {
  return (
    <div>
      <UncontrolledDropdown className="" nav inNavbar>
        <DropdownToggle nav caret className="">
          My Account
        </DropdownToggle>
        <DropdownMenu className="h-[18.5vh] p-0" right>
          <DropdownItem
            className="h-[6vh] py-0 hover:rounded-sm"
            href="/testing"
          >
            My Hub
          </DropdownItem>
          <DropdownItem
            className="h-[6vh] py-0 hover:rounded-sm"
            href="/account"
          >
            Settings
          </DropdownItem>
          <DropdownItem className="h-0 py-0 m-0 z-0" divider />
          <DropdownItem
            className="h-[6vh] py-0 hover:rounded-sm"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
}
