import React, { useState } from "react";
import {Redirect} from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
	const [error, setError] = useState({});
	const [isSubmitted, setIsSubmitted] = useState(false);
	let name, password;

    const handleSubmit = (event) => {
		//Prevent page reload
		event.preventDefault();

		if (name === '' || password === '') {
			setError(true);
		} else {
			setIsSubmitted(true);
			setError(false);
			axios.get("http://127.0.0.1:4000/login", { name, password }).then((response) => {
			console.log(response);
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
            {isSubmitted ? <Redirect to='/'/>: renderForm}
          </div>
        </div>
      );
}

export default LoginForm;