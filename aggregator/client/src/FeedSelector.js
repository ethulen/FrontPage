import React, { useState, useEffect } from "react";
import { useHistory  } from "react-router-dom";
import axios from 'axios';


const FeedSelector = (props) => {
  const {addSource, removeSource, selectedSources} = props;
  const [sources, setSources] = useState([]);
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
      console.log(sourceList)
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
    </div>
  );
};

export default FeedSelector;
