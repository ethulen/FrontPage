import React from "react";
import Feed from "./Feed"
import Header from "./Header"
import { Link, Switch, Route, Router } from 'react-router-dom'
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import { Masonry } from '@mui/lab';
import { createBrowserHistory } from "history";
import FeedSelector from "./FeedSelector";

const customHistory = createBrowserHistory();

const Home = () => {
	return (
		<form className="home__form">
			<Masonry columns={2} spacing={2}>
				<Feed />
			</Masonry>
		</form>)
}

const App = () => {
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
								</>
							</ul>
						</nav>
						<Switch>
							<Route path="/login" component={LoginForm}></Route>
							<Route path="/register" component={RegistrationForm}></Route>
							<Route path="/feedSelector" component={FeedSelector}></Route>
							<Route exact path="/" component={Home}></Route>
						</Switch>
					</Router>
			</div>
		</div>
	);
};

export default App;
