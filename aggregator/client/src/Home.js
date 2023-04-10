import React, {useState} from "react"
import Feed from "./Feed"
import { Masonry } from '@mui/lab';

const Home = () => {
	const loggedInAccount = useState(0);
	return (
		<form className="home__form">
			<Masonry columns={2} spacing={2}>
				<Feed loggedInAccount={loggedInAccount}/>
			</Masonry>
		</form>)
}
export default Home;