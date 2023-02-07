import React from "react";
import axios from 'axios';

class Feed extends React.Component{
	constructor(props){
        super(props)
        this.state = {
            headlinesNews: [],
            isLoading: true,
            errors: null
        };
    }


	getHeadlines(catagories) {
        // Axios fetches headlines
        axios.get('https://newsapi.org/v2/top-headlines/sources',{
            params: {country: catagories, apiKey: 'e188a3e6d6c64590be570b46271bd205'}
        })
          // Once a response is obtained, map the API endpoints to props
          .then(response =>
            response.data.articles.map(news => ({
              title: `${news.title}`,
              description: `${news.description}`,
              author: `${news.author}`,
              newsurl: `${news.url}`,
              url: `${news.urlToImage}`,
              content: `${news.content}`
            }))
          )
          // Change the loading state to display the data
          .then(headlinesNews => {
            this.setState({
              headlinesNews,
              isLoading: false
            });
          })
          // We can still use the `.catch()` method since axios is promise-based
          .catch(error => this.setState({ error, isLoading: false }));
    }

    componentDidMount() {
        this.getHeadlines('us')
    }

    render(){
        const { isLoading, headlinesNews } = this.state;
        return (
            <React.Fragment>
            <div className="subhead"><h2>Headlines</h2></div>
            <div>
                {!isLoading ? (
                headlinesNews.map(news => {
                    const { title, description, author, newsurl, url, content } = news;
                    return (
                    <div className="collumn" key={title}>
                        <div className="head">
                            <span className="headline hl3">
                                {title}
                            </span>
                            <p>
                                <span className="headline hl4">
                                    {author}
                                </span>
                            </p>
                            <figure className="figure">
								<img className="media" src={url} alt="" />
						    </figure>
                            <p>
                                {description}<br />
                                {content}
                            </p>
                            <a href={newsurl} target="_blank" rel="noopener noreferrer">Read full news</a>
                        </div>
                    </div>
                    );
                })
                ) : (
                <p>Loading...</p>
                )}
            </div>
            </React.Fragment>
        );
    }
}

export default Feed;
