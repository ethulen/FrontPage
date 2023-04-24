import React from "react"
import Feed from "./Feed"
import Recommended from "./Recommended"
import { Masonry } from '@mui/lab';

const Home = (props) => {
	const {loggedInAccount} = props;
	return (
		<form className="home__form">
			<Masonry columns={2} spacing={2}>
				<Recommended loggedInAccount={loggedInAccount}/>
				<Feed loggedInAccount={loggedInAccount}/>
			</Masonry>
		</form>)
}
export default Home;