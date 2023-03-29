import React, { useState, useEffect } from "react";

const FeedSelector = (props) => {
  const {addSource, removeSource} = props;
  const [sources, setSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);

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

  const handleSelectSource = (id) => {
    const index = selectedSources.indexOf(id);
    if (index === -1) {
      addSource([...selectedSources, id]);
    } else {
      const newSources = [...selectedSources];
      newSources.splice(index, 1);
      addSource(newSources);
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
              checked={selectedSources.includes(source.id)}
              onChange={() => handleSelectSource(source.id)}
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