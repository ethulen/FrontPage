import React from "react";
import Feed from "./Feed"
import Header from "./Header"
import { Masonry } from '@mui/lab';

const App = () => {

	const heights = [150, 30, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 30, 50, 80];


	return (
		<div className="home">
			<Header />
			<form className="home__form">
				<Masonry columns={2} spacing={2}>
					{heights.map((height, index) => (
						<Feed />
					))}
				</Masonry>
			</form>
		</div>
	);
};

export default App;
