import React from "react";
import axios from "axios";
import { Paper } from "@mui/material";

class Feed extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.state = {
			headlinesNews: [],
			isLoading: true,
			errors: null,
		};
	}

	getRecommendedArticles(){
		axios.get("http://localhost:3000/user/:id/recommended")
	}
	
	getHeadlines(sources) {
		console.log(sources)
		// Axios fetches headlines
		if (sources != null) {
			let output = ""
			sources = JSON.parse(sources)
			console.log(sources)
			for (var s in sources) {
				console.log(s)
				output = output + sources[s] + ","
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
						source: `${news.source.id}`
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
                    url: `${news.urlToImage}`,
					source: `${news.source.id}`
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
		console.log("feed mounted")
		console.log(this.props.loggedInAccount)
		if(this.props.loggedInAccount !== undefined){
		axios
		.get(`http://localhost:4000/user/${this.props.loggedInAccount}`).then((response) => {
			console.log(response.data)
			if (
				response.data !== undefined &&
				response.data !== null 
			) {
				this.getHeadlines(response.data.sources);
			} 
		})}
		else{
			this.getHeadlines(null)
		}
	}

	handleClick = (e) => {
		let article = e.target.dataset.source
		e.preventDefault();
		axios.post("http://localhost:4000/user/:id/clicks", { article }, { withCredentials: true }).then((response) => {
			console.log(response);
		});
	}

	render() {
		const { isLoading, headlinesNews } = this.state;
		return (
			<React.Fragment>
				{!isLoading ? (
					headlinesNews.map((news) => {
						const { title, description, author, newsurl, url, source } =
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
											onClick={this.handleClick}
											href={newsurl}
											target="_blank"
											rel="noopener noreferrer"
											data-source={source}
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
