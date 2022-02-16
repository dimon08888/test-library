import React from 'react';
import { useState } from 'react';
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
  const [orderBy, setOrderBy] = useState('relevance');
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${search}+${
        category !== 'all' ? `subject:${category}` : ''
      }&orderBy=${orderBy}&key=${apiKey}`,
    )
      .then(response => response.json())
      .then(data => setBooks(data))
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="h-screen flex flex-col">
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
            <button type="submit" className="py-2 bg-white rounded-r-md w-[10%]">
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
              <option value="all">All</option>
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
              value={orderBy}
              onChange={e => setOrderBy(e.target.value)}
            >
              <option value="relevance">relevance</option>
              <option value="newest">newest</option>
            </select>
          </div>
        </form>
      </header>
      {books && (books.totalItems === 0 ? <NotFound /> : <Books books={books} />)}
      {isLoading && (
        <div className="flex-grow grid place-items-center">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}

function Books({ books }: { books: APIResponse }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center font-bold mt-3">Found {books.totalItems} results</div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
        {books.items.map(book => (
          <div key={book.id} className="bg-stone-300">
            <div className="grid place-items-center pt-3">
              <img
                className="shadow-md shadow-black"
                src={book.volumeInfo.imageLinks.smallThumbnail}
                alt=""
              />
            </div>
            <div className="px-3 py-2">
              <p className="text-xs underline text-slate-400 text-left">
                {book.volumeInfo.categories}
              </p>
              <h4 className="font-bold">{book.volumeInfo.title}</h4>
              <p>{book.volumeInfo.authors}</p>
            </div>
          </div>
        ))}{' '}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div>
      <h2>Книги не найдены!</h2>
    </div>
  );
}

export default App;
