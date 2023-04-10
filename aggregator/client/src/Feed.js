import React from "react";
import axios from "axios";
import { Paper } from "@mui/material";

class Feed extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			headlinesNews: [],
			isLoading: true,
			errors: null,
			loggedInAccount: 0,
		};
	}
	
	getHeadlines(sources) {
		// Axios fetches headlines
		if (sources != null) {
			let output = ""
			console.log(sources)
			for (var s in sources) {
				console.log(s)
				output = output + sources[s].id + ","
			}
			axios
				.get("https://newsapi.org/v2/everything", {
					params: {
						sources: output,
						apiKey: "e188a3e6d6c64590be570b46271bd205",
					},
				})
				// Once a response is obtained, map the API endpoints to props
				.then((response) =>
					response.data.articles.map((news) => ({
						title: `${news.title}`,
						description: `${news.description}`,
						author: `${news.author}`,
						newsurl: `${news.url}`,
						url: `${news.urlToImage}`,
					}))
				)
				// Change the loading state to display the data
				.then((headlinesNews) => {
					this.setState({
						headlinesNews,
						isLoading: false,
					});
				})
				// Use the `.catch()` method since axios is promise-based
				.catch((error) => this.setState({ error, isLoading: false }));
		} else {
			axios.get("https://newsapi.org/v2/top-headlines", {
				params: { country: "us", apiKey: "e188a3e6d6c64590be570b46271bd205" },
			})
            // Once a response is obtained, map the API endpoints to props
            .then(response =>
                response.data.articles.map(news => ({
                    title: `${news.title}`,
                    description: `${news.description}`,
                    author: `${news.author}`,
                    newsurl: `${news.url}`,
                    url: `${news.urlToImage}`
                }))
            )
            // Change the loading state to display the data
            .then(headlinesNews => {
                this.setState({
                    headlinesNews,
                    isLoading: false
                });
            })
            // Use the `.catch()` method since axios is promise-based
            .catch(error => this.setState({ error, isLoading: false }));
		}
	}

	componentDidMount() {
		if(this.id !== undefined){
		axios
		.get(`http://localhost:4000/user/${this.id}`).then((response) => {
			if (
				response.data !== undefined &&
				response.data !== null &&
				response.data.length > 0
			) {
				let sourceArray = JSON.parse(
					response.data
				);
				this.getHeadlines(sourceArray);
			} else {
				this.getHeadlines(this.sources);
			}
		})}
		else{
			this.getHeadlines(null)
		}
	}

	render() {
		const { isLoading, headlinesNews } = this.state;
		return (
			<React.Fragment>
				{!isLoading ? (
					headlinesNews.map((news) => {
						const { title, description, author, newsurl, url } =
							news;
						return (
							<div className="column" key={title}>
								<div className="head">
									<Paper>
										<span className="headline hl3">
											{title}
										</span>
										<p>
											<span className="headline hl4">
												{author}
											</span>
										</p>
										<figure className="figure">
											<img
												className="media"
												src={url}
												alt=""
											/>
										</figure>
										<p>
											{description}
											<br />
										</p>
										<a
											href={newsurl}
											target="_blank"
											rel="noopener noreferrer"
										>
											Read full article
										</a>
									</Paper>
								</div>
							</div>
						);
					})
				) : (
					<p>Loading...</p>
				)}
			</React.Fragment>
		);
	}
}

export default Feed;
