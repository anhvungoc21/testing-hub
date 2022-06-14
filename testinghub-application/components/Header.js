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

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [sticky, setSticky] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

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
                <NavLink className="navLink" href="/testing">
                  Account/Testing
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
