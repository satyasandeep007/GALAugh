import React, { useState } from 'react';

export default function JokeGenerator() {
  const [keyword, setKeyword] = useState('');
  const [joke, setJoke] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateJoke = async () => {
    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      setJoke(`Here's a joke about ${keyword}: [Your joke would go here]`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="container mx-auto mt-12 p-6">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">
            Turn text into high-quality jokes
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Enter any text (keyword, phrase, etc.) and hit "Generate" to get
            relevant jokes.
          </p>
          <div className="flex mb-4">
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="Enter a keyword"
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={generateJoke}
              disabled={isLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:bg-purple-400"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
            <span className="cursor-pointer hover:text-purple-600">
              Try sample text
            </span>
            <div className="flex items-center space-x-2">
              <span>Images</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="toggle"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
              <span>Jokes</span>
            </div>
            <span>0 / 300</span>
          </div>
          {joke && (
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg mb-4">{joke}</p>
              {/* Add joke actions here if needed */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
