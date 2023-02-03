import {
	Paper,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Masonry } from '@mui/lab';
import React, { useState } from "react";

function Feed() {
	let heights;
	const [rssUrl, setRssUrl] = useState("");
	const [items, setItems] = useState([]);

	const getRss = async (e) => {
		e.preventDefault();
		const urlRegex =
			/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/;
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

	return (
		<form className="home__form" onSubmit={getRss}>
			<Masonry columns={2} spacing={2}>
				{heights.map((height, index) => (
					<Paper key={index}>
						<Accordion sx={{ minHeight: height }}>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								<Typography>Accordion {index + 1}</Typography>
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
									<input type="submit" />
								</div>

								{items.map((item) => {
									return (
										<div>
											<h1>{item.title}</h1>
											<p>{item.author}</p>
											<a href={item.link}>{item.link}</a>
										</div>
									);
								})}
							</AccordionDetails>
						</Accordion>
					</Paper>
				))}
			</Masonry>
		</form>
	);
}

export default Feed;
