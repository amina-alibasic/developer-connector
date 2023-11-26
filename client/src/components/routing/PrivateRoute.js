import React from "react";
import PropTypes from "prop-types";
import { Navigate, Routes, Route } from "react-router-dom";
import { connect } from "react-redux";

/* If the user is authenticated (logged in), display the component passed to this private route.
Else, display the login page. 
This template is generic; it will work with any component in the app.
*/
const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  if (isAuthenticated) {
    return <Component {...rest} />;
  }
  return <Navigate tp="login" />;
};

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps)(PrivateRoute);
