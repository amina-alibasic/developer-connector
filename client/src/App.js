import "./App.css";
import React, { Fragment, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import { Landing } from "./components/layout/Landing";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

// Redux
import { Provider } from "react-redux";
import store from "./store";
if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  // This will run only once, when the component is mounted.
  // The [] in the end are the key for it to run only once, not in a loop.
  useEffect(() => {
    store.dispatch(loadUser(), []);
  });
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Alert />
          <Routes>
            <Route exact path="/" Component={Landing} />
            <Route exact path="/register" Component={Register}></Route>
            <Route exact path="/login" Component={Login}></Route>
          </Routes>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
