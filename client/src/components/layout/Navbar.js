import React from "react";
import { Link, Navigate } from "react-router-dom";
import { logout } from "../../actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Navbar = ({ logout, isAuthenticated }) => {
  const loggedOutUserLinks = [
    {
      placeholder: "Developers",
      link: "/profiles",
    },
    { placeholder: "Register", link: "/register" },
    {
      placeholder: "Login",
      link: "/login",
    },
  ];

  function customLinks() {
    if (isAuthenticated) {
      return (
        <ul>
          <li>
            <Link to="/" onClick={logout}>
              Logout
            </Link>
          </li>
        </ul>
      );
    } else {
      const listItems = loggedOutUserLinks.map((element) => (
        <li key={element.link}>
          <Link to={element.link}>{element.placeholder}</Link>
        </li>
      ));
      return <ul>{listItems}</ul>;
    }
  }

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
      <div> {customLinks()}</div>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
export default connect(mapStateToProps, { logout })(Navbar);
