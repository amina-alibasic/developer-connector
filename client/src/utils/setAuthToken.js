/*
    A function which takes in a token. 
    If the token is there, add it to the headers.
    If not, delete it from the headers.
*/
import axios from "axios";
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
