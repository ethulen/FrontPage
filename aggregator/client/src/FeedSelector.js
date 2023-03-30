import React, { useState, useEffect } from "react";

const FeedSelector = (props) => {
  const {addSource, removeSource, selectedSources} = props;
  const [sources, setSources] = useState([]);

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
    console.log(source)
    if (event.target.checked) {
      addSource(source);
    } else {
      removeSource(source);
    }
  };

  const handleSaveSources = () => {
    localStorage.setItem("selectedSources", JSON.stringify(selectedSources));
    window.location.href = "http://localhost:3000/"
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