import React from 'react';
import './App.css';

function App() {
  return (
    <header className="header">
      <h1 className="header-title text-white text-center font-bold text-xl py-3">
        Search for books
      </h1>

      <form className="flex flex-col items-center w-full max-w-xl mx-auto">
        <div className="w-full mb-3">
          <input className="py-2 pl-2 rounded-l-md w-[90%]" type="text" />
          <button className="py-2 bg-white rounded-r-md w-[10%]">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
        <div className="flex flex-col sm:flex-row py-3 gap-4 items-center">
          <label htmlFor="category" className="text-white cursor-pointer">
            Categories
          </label>
          <select className="rounded py-1 w-40 cursor-pointer" id="category">
            <option>all</option>
            <option>Art</option>
            <option>Biography</option>
            <option>Computers</option>
            <option>History</option>
            <option>Medical</option>
            <option>Poetry</option>
          </select>

          <label htmlFor="sortBy" className="text-white cursor-pointer">
            Sort by
          </label>
          <select className="rounded py-1 w-40 cursor-pointer" id="sortBy">
            <option>relevance</option>
            <option>newest</option>
          </select>
        </div>
      </form>
    </header>
  );
}

export default App;
