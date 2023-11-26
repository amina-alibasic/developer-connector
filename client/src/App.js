import "./App.css";
import React, { Fragment } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Landing } from "./components/layout/Landing";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Register } from "./components/auth/Register";
import { Login } from "./components/auth/Login";

const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Routes>
        <Route exact path="/" Component={Landing} />
        <Route exact path="/register" Component={Register}></Route>
        <Route exact path="/login" Component={Login}></Route>
      </Routes>
    </Fragment>
  </Router>
);

export default App;
