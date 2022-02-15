import React from 'react';
import { useState, useEffect } from 'react';
import { APIResponse } from './types';
import './App.css';

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error('REACT_APP_GOOGLE_API_KEY must be set');
}

function App() {
  const [books, setBooks] = useState<APIResponse | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&key=${apiKey}`)
      .then(response => response.json())
      .then(data => setBooks(data));
  }

  return (
    <div>
      <header className="header">
        <h1 className="header-title text-white text-center font-bold text-xl py-3">
          Search for books
        </h1>

        <form
          className="flex flex-col items-center w-full max-w-xl mx-auto"
          onSubmit={handleSubmit}
        >
          <div className="w-full mb-3">
            <input
              className="py-2 pl-2 rounded-l-md w-[90%]"
              type="text"
              onChange={e => setSearch(e.target.value)}
              value={search}
            />
            <button className="py-2 bg-white rounded-r-md w-[10%]">
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row py-3 gap-4 items-center">
            <label htmlFor="category" className="text-white cursor-pointer">
              Categories
            </label>
            <select
              className="rounded py-1 w-40 cursor-pointer"
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="all">all</option>
              <option value="art">Art</option>
              <option value="biography">Biography</option>
              <option value="computers">Computers</option>
              <option value="history">History</option>
              <option value="medical">Medical</option>
              <option value="poetry">Poetry</option>
            </select>

            <label htmlFor="sortBy" className="text-white cursor-pointer">
              Sort by
            </label>
            <select
              className="rounded py-1 w-40 cursor-pointer"
              id="sortBy"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="relevance">relevance</option>
              <option value="newest">newest</option>
            </select>
          </div>
        </form>
      </header>
      {books && <Books books={books} />}
    </div>
  );
}

function Books({ books }: { books: APIResponse }) {
  return (
    <div>
      <div>Founds {books.totalItems} results</div>
      {books.items.map(book => (
        <div>
          <h3>{book.volumeInfo.title}</h3>
          <img src={book.volumeInfo.imageLinks.smallThumbnail} alt="" />
          <p>{book.volumeInfo.categories}</p>
          <p>{book.volumeInfo.authors}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
