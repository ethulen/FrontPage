import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {

	// States for registration
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// States for checking the errors
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState(false);

	// Handling the name change
	const handleName = (e) => {
		setName(e.target.value);
		setSubmitted(false);
	};

	// Handling the email change
	const handleEmail = (e) => {
		setEmail(e.target.value);
		setSubmitted(false);
	};

	// Handling the password change
	const handlePassword = (e) => {
		setPassword(e.target.value);
		setSubmitted(false);
	};

	// Handling the form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		if (name === '' || email === '' || password === '') {
			setError(true);
		} else {
			setSubmitted(true);
			setError(false);
		}
		axios.post("http://127.0.0.1:4000/register", { name, email, password }).then((response) => {
			console.log(response);
		})
	};

	// Showing success message
	const successMessage = () => {
		return (
			<div
				className="success"
				style={{
					display: submitted ? '' : 'none',
				}}>
				User {name} successfully registered!!
			</div>
		);
	};

	// Showing error message if error is true
	const errorMessage = () => {
		return (
			<div
				className="error"
				style={{
					display: error ? '' : 'none',
				}}>
				Please enter all the fields
			</div>
		);
	};

	return (
		<div className="form">
			<div/>
			<div style={{paddingTop: 18}}>
				<h2>User Registration</h2>
			</div>

			<form>
				{/* Labels and inputs for form data */}
				<label className="label">Name: </label>
				<input onChange={handleName} className="input"
					value={name} type="text" />
				<p/>
				<label className="label">Email: </label>
				<input onChange={handleEmail} className="input"
					value={email} type="email" />
				<p/>
				<label className="label">Password: </label>
				<input onChange={handlePassword} className="input"
					value={password} type="password" />
				<p/>
				<button onClick={handleSubmit} className="btn" type="submit">
					Submit
				</button>
			</form>
			{/* Calling to the methods */}
			<div className="messages">
				{errorMessage()}
				{successMessage()}
			</div>
		</div>
	);
}
export default RegistrationForm;