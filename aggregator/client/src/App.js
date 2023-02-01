import React from "react";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import Feed from "./Feed"
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

	let heights;
	let hasAccount;

	return (
		<div className="home">
			<div>{hasAccount ? <RegistrationForm /> : <LoginForm />}</div>
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
