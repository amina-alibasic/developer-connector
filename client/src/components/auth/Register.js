import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

export const Register = () => {
  // The useState hook enables functional components to hold and update their internal state.
  // This is the initial state:
  const [formData, setState] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const { name, email, password, password2 } = formData;

  // setState: updates the state in a React component. It is initialized usinf the useState hook.
  // When setState is called, React will re-render the component with the updated state.
  // First it creates a new object formData by copying the previous values, then it updates the field, depending on the name of the field.
  const onChange = (e) =>
    setState({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      console.log("passwords don't match");
    } else {
      console.log("SUCESS");
      // newUser is the body of the POST request
      /* const newUser = {
        name,
        email,
        password,
      };

      try {
        const config = {
          heders: {
            "Content-Type": "application/json",
          },
        };

        const res = await axios.post("/api/users", newUser, config);
        console.log(res.data);
      } catch (error) {
        console.log(error.response.data);
      } */
    }
  };

  return (
    <Fragment>
      {" "}
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
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
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};
