import React, { useState } from "react";
import Loading from "./Loading";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import {
	Masonry,
	Paper,
	StyledAccordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	ExpandMoreIcon,
} from "@mui-material";

const App = () => {
	const [url, setURL] = useState("");
	const [loading, setLoading] = useState(false);
	const [websiteContent, setWebsiteContent] = useState([]);
	const [rssUrl, setRssUrl] = useState("");
	const [items, setItems] = useState([]);

	let heights;
	let hasAccount;

	if (loading) {
		return <Loading />;
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		setURL("");
		//Calls the function.
		sendURL();
	};

	async function sendURL() {
		try {
			const request = await fetch("http://localhost:4000/api/url", {
				method: "POST",
				body: JSON.stringify({
					url,
				}),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});
			const data = await request.json();
			if (data.message) {
				setLoading(false);
				//update the state with the server response
				setWebsiteContent(data.database);
			}
		} catch (err) {
			console.error(err);
		}
	}

	const getRss = async (e) => {
		e.preventDefault();
		const urlRegex =
			/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
		if (!urlRegex.test(rssUrl)) {
			return;
		}
		const res = await fetch(`https://api.allorigins.win/get?url=${rssUrl}`);
		const { contents } = await res.json();
		const feed = new window.DOMParser().parseFromString(
			contents,
			"text/xml"
		);
		const items = feed.querySelectorAll("item");
		const feedItems = [...items].map((el) => ({
			link: el.querySelector("link").innerHTML,
			title: el.querySelector("title").innerHTML,
			author: el.querySelector("author").innerHTML,
		}));
		setItems(feedItems);
	};

	const trimDescription = (content) =>
		content.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");

	return (
		<div className="home">
			<div>{hasAccount ? <RegistrationForm /> : <LoginForm />}</div>
			<form className="home__form" onSubmit={getRss}>
				<h2>Website Aggregator</h2>
				<Masonry columns={2} spacing={2}>
					{heights.map((height, index) => (
						<Paper key={index}>
							<StyledAccordion sx={{ minHeight: height }}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
								>
									<Typography>
										Accordion {index + 1}
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<div>
										<label> rss url</label>
										<br />
										<input
											onChange={(e) =>
												setRssUrl(e.target.value)
											}
											value={rssUrl}
										/>
									</div>
									<button onClick={handleSubmit}>
										ADD WEBSITE
									</button>
								</AccordionDetails>
							</StyledAccordion>
						</Paper>
					))}
				</Masonry>
			</form>
			<main className="website__container ">
				{websiteContent.map((item) => (
					<div className="website__item" key={item.id}>
						<img src={item?.brandImage} alt={item?.brandName} />
						<h3>{item?.brandName}</h3>
						<p>{trimDescription(item?.brandDescription)}</p>
					</div>
				))}
			</main>
		</div>
	);
};

export default App;
