import React, { useContext } from "react";
import { Context } from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LOGIN_ROUTE,
  MAIN_ROUTE,
  // REQUEST_FLIGHT_ROUTE,
  MY_FLIGHTS_ROUTE,
  ADMIN_REQUESTS_ROUTE,
  ALL_FLIGHTS_ROUTE,
} from "../utils/consts";
import {
  Button,
  NavDropdown,
  Container,
} from "react-bootstrap";
import { observer } from "mobx-react-lite";

const NavBar = observer(() => {
  const { user, ui } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.removeItem("token");
    navigate(LOGIN_ROUTE);
  };

  const isAuthPage = location.pathname === LOGIN_ROUTE || location.pathname === "/registration";

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>
          <NavLink
            style={{ color: "white", textDecoration: "none" }}
            to={MAIN_ROUTE}
          >
            UTM
          </NavLink>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {user.isAuth ? (
            <Nav className="ms-auto">
              {user.user.role === "PILOT" && (
                <>
                  <Nav.Link
                    as="span"
                    onClick={() => ui.openFlightForm()}
                    style={{ color: "white", cursor: "pointer" }}
                  >
                    Request Flight
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to={MY_FLIGHTS_ROUTE}
                    style={{ color: "white" }}
                  >
                    My Flights
                  </Nav.Link>
                  <Nav.Link
                    as="span"
                    onClick={() => ui.openDronesForm()}
                    style={{ color: "white", cursor: "pointer" }}
                  >
                    My Drones
                  </Nav.Link>
                </>
              )}

              {user.user.role === "ADMIN" && (
                <>
                  <Nav.Link
                    as={NavLink}
                    to={ADMIN_REQUESTS_ROUTE}
                    style={{ color: "white" }}
                  >
                    Requests
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to={ALL_FLIGHTS_ROUTE}
                    style={{ color: "white" }}
                  >
                    All Flights
                  </Nav.Link>
                </>
              )}

              <NavDropdown
                title={`${user.user.email} (${user.user.role})`}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={logOut}>Log Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            !isAuthPage && (
              <Nav className="ms-auto">
                <Button
                  variant="outline-light"
                  onClick={() => navigate(LOGIN_ROUTE)}
                >
                  Login
                </Button>
              </Nav>
            )
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default NavBar;
