import React, { useState } from "react";
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useHistory  } from "react-router-dom";

const LoginForm = (props) => {
  const {loggedInAccount, setLoggedInAccount} = props
	const [error, setError] = useState({});
	let name, password;
  const history = useHistory ();

    const handleSubmit = (event) => {
		//Prevent page reload
		event.preventDefault();
      console.log(event)
      name = event.target[0].value
      password = event.target[1].value
		if (name === '' || password === '') {
			setError(true);
		} else {
			setError(false);
			axios.post("http://127.0.0.1:4000/login", { name, password }).then((response) => {
			console.log(response);
      if (response.data.token) {
        var decoded = jwt_decode(response.data.token);
        console.log(decoded)
        setLoggedInAccount(decoded.userId);
        console.log(loggedInAccount)
        history.push("/")
      }
		})
		}
		
	};
	// Generate JSX code for error message
	const renderErrorMessage = (name) =>
		name === error.name && (
			<div className="error">{error.message}</div>
		);
	// JSX code for login form
	const renderForm = (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label>Username </label>
              <input type="text" name="username" required />
              {renderErrorMessage("username")}
            </div>
            <div className="input-container">
              <label>Password </label>
              <input type="password" name="password" required />
              {renderErrorMessage("password")}
            </div>
            <div className="button-container">
              <input type="submit" />
            </div>
          </form>
        </div>
    );
	return (
        <div className="app">
          <div className="login-form">
            <div className="title" style={{paddingTop: 18}}><h2>Sign In</h2></div>
            {loggedInAccount !== null ? <Redirect to='/'/>: renderForm}
          </div>
        </div>
      );
}

export default LoginForm;