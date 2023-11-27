import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Navigate, Route } from "react-router-dom";
import { connect } from "react-redux";
import Login from "../auth/Login";

/* If the user is authenticated (logged in), display the component passed to this private route.
Else, display the login page. 
This template is generic; it will work with any component in the app.
*/
const PrivateRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps)(PrivateRoute);
