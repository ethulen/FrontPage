import React, { useState, useEffect } from "react";
import { useHistory  } from "react-router-dom";
import natural from "natural";
import axios from 'axios';

const calculateTfIdf = (doc, docs) => {
  const tfidf = new natural.TfIdf();
  docs.forEach((d) => tfidf.addDocument(d));
  const terms = doc.split(" ");
  const scores = {};
  terms.forEach((term) => {
    const tfidfScore = tfidf.tfidf(term, docs.indexOf(doc));
    scores[term] = tfidfScore;
  });
  return scores;
};

const FeedSelector = (props) => {
  const {addSource, removeSource, selectedSources} = props;
  const [sources, setSources] = useState([]);
  const [userTopics, setUserTopics] = useState([]);
  const history = useHistory ();

  useEffect(() => {
    const fetchSources = async () => {
      const response = await fetch(
        "https://newsapi.org/v2/sources?apiKey=e188a3e6d6c64590be570b46271bd205"
      );
      const data = await response.json();
      setSources(data.sources);
    };

    fetchSources();
  }, []);

  // useEffect(() => {
  //   const docs = selectedSources.map((source) => source.name.toLowerCase());
  //   const tfidfScores = {};
  //   selectedSources.forEach((source) => {
  //     const keywords = sources.keywords.split(",");
  //     keywords.forEach((keyword) => {
  //       const scores = calculateTfIdf(keyword, docs);
  //       if (tfidfScores[keyword]) {
  //         tfidfScores[keyword] = tfidfScores[keyword] + scores[keyword];
  //       } else {
  //         tfidfScores[keyword] = scores[keyword];
  //       }
  //     });
  //   });
  //   const topics = Object.keys(tfidfScores).map((keyword) => ({
  //     name: keyword,
  //     score: tfidfScores[keyword],
  //   }));
  //   setUserTopics(topics);
  // }, [selectedSources]);

  const handleSelectSource = (id, event) => {
    const source = sources.find(x => x.id === id);
    if (event.target.checked) {
      addSource(source);
    } else {
      removeSource(source);
    }
  };

  const handleSaveSources = () => {
    const sourceList = selectedSources.map((source) => (
      source.id))
    axios.post("http://localhost:4000/sourceSelect", { sourceList }, { withCredentials: true }).then((response) => {
			console.log(response);
      history.push('/');
		})
  };
  
  return (
    <div>
      <h2>News Sources</h2>
      {sources.map((source) => (
        <div key={source.id}>
          <label>
            <input
              type="checkbox"
              checked={selectedSources.some(item => item.id === source.id)}
              onChange={(event) => handleSelectSource(source.id, event)}
            />
            {source.name}
          </label>
        </div>
      ))}
      <button onClick={handleSaveSources}>Save Sources</button>
      
      {/* <h2>User Topics</h2>
      <ul>
        {userTopics.map((topic) => (
          <li key={topic.name}>
            {topic.name}: {topic.score}
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default FeedSelector;
