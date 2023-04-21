import React, { useState, useEffect } from "react";
import Header from "./Header"
import { Link, Switch, Route, Router } from 'react-router-dom'
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import { createBrowserHistory } from "history";
import FeedSelector from "./FeedSelector";
import Home from "./Home"

const customHistory = createBrowserHistory();

const App = () => {
	const [loggedInAccount, setLoggedInAccount] = useState(0);
	const [checkedSources, setCheckedSources] = useState([]);
	function addSource(source) {
		const combinedSources = [...checkedSources, source];
		setCheckedSources(combinedSources);
	}
	function removeSource(source) {
		const combinedSources = checkedSources.filter(item => item.id !== source.id);
		setCheckedSources(combinedSources);
	}

	const [width, setWidth] = useState(window.innerWidth);

	useEffect(() => {
		function handleResize() {
			setWidth(window.innerWidth);
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [width]);

	useEffect(() => {
		width < 600 && handleSideNavToggle();
	}, [width]);

	function handleSideNavToggle() {
		console.log("toggle it");
	}

	return (
		<div className="home">
			<Header />
			<div align="right">
				<Router history={customHistory}>
					<nav>
						<ul>
							<>
								<span><Link to={"/"}>Home</Link></span>
								<span>   	</span>
								<span><Link to={"/login"}>Login</Link></span>
								<span>   	</span>
								<span><Link to={"/register"}>Register</Link></span>
								<span>   	</span>
								<span><Link to={"/logout"}>Logout</Link></span>
							</>
						</ul>
					</nav>
					<Switch>
						<Route path="/login" component={(routeProps) =>
							<LoginForm {...routeProps} setLoggedInAccount={setLoggedInAccount} loggedInAccount={loggedInAccount} />
						}></Route>
						<Route path="/register" component={RegistrationForm}></Route>
						<Route path="/feedSelector" render={routeProps => (
							<FeedSelector {...routeProps} selectedSources={checkedSources} addSource={addSource} removeSource={removeSource} />
						)}></Route>
						<Route exact path="/" render={routeProps => (
							<Home {...routeProps} loggedInAccount={loggedInAccount} />
						)}></Route>
					</Switch>
				</Router>
			</div>
		</div>
	);
};

export default App;
