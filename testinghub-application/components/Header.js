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

const Header = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const [sticky, setSticky] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  let accountTab;

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  });

  const handleScroll = () => {
    if (window.scrollY > 90) {
      setSticky(true);
    } else if (window.scrollY < 90) {
      setSticky(false);
    }
  };

  if (session) {
    accountTab = (
      <NavItem>
        <NavLink className="navLink" href="/account">
          My Account
        </NavLink>
      </NavItem>
    );
  }

  return (
    <div className={`header${sticky ? " sticky" : ""}`}>
      <Navbar light expand="md">
        <Container>
          <NavbarToggler onClick={toggle} />

          <Collapse isOpen={isOpen} navbar>
            <Nav className="m-auto" navbar>
              <NavbarBrand className="logo" href="/">
                Testing Hub
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
              <NavItem>
                <NavLink
                  className="navLink"
                  href={session ? "/testing" : "/login"}
                >
                  Account/Testing
                </NavLink>
              </NavItem>
              {accountTab}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
