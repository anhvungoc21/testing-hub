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
  let testingTab;

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
          Settings
        </NavLink>
      </NavItem>
    );

    testingTab = (
      <NavItem>
        <NavLink className="navLink" href="/testing">
          My TestingHub
        </NavLink>
      </NavItem>
    );
  } else {
    testingTab = (
      <NavItem>
        <NavLink className="navLink" href="/login">
          Log In
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
              {testingTab}
              {accountTab}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
