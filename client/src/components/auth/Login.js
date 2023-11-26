import React, { Fragment, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { login } from "../../actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Login = ({ login, isAuthenticated }) => {
  // The useState hook enables functional components to hold and update their internal state.
  // This is the initial state:
  const [formData, setState] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  // setState: updates the state in a React component. It is initialized usinf the useState hook.
  // When setState is called, React will re-render the component with the updated state.
  // First it creates a new object formData by copying the previous values, then it updates the field, depending on the name of the field.
  const onChange = (e) =>
    setState({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };
  // Navigate if user logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace={true} />;
  }

  return (
    <Fragment>
      {" "}
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
export default connect(mapStateToProps, { login })(Login);
