import React, { useState, useEffect } from "react";
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { useSession } from "next-auth/react";
import Dropdown from "./Dropdown";

const Header = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  let accountTab;

  if (session) {
    accountTab = (
      <NavItem>
        <NavLink className="navLink" href="/account">
          My Account
        </NavLink>
      </NavItem>
    );
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className={`header${sticky ? " sticky" : ""}`}>
      <Navbar light expand="lg">
        <Container>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="m-auto" navbar>
              <NavbarBrand className="logo" href="/">
                <h1>
                  <strong>Testing Hub</strong>
                </h1>
              </NavbarBrand>
              <NavItem>
                <NavLink className="navLink" href="/">
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="navLink" href="/agency">
                  For Agencies
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="navLink" href="/brand">
                  For Brands
                </NavLink>
              </NavItem>
              {!session && (
                <NavItem>
                  <NavLink className="navLink" href={"/login"}>
                    Log In
                  </NavLink>
                </NavItem>
              )}
              {session && <Dropdown />}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
