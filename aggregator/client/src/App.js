import React from "react";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import Feed from "./Feed"
import Header from "./Header"
import {
	Paper,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Masonry } from '@mui/lab';

const App = () => {

	const heights = [150, 30, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 30, 50, 80];
	let hasAccount;

	return (
		<div className="home">
			<Header/>
			{/* <div>{hasAccount ? <RegistrationForm /> : <LoginForm />}</div> */}
			<form className="home__form">
				<Masonry columns={2} spacing={2}>
					{heights.map((height, index) => (
						<Paper key={index}>
							<Accordion sx={{ minHeight: height }}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
								>
									<Typography>
										Accordion {index + 1}
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<div>
										<Feed/>
									</div>
								</AccordionDetails>
							</Accordion>
						</Paper>
						
					))}
				</Masonry>
			</form>
		</div>
	);
};

export default App;
