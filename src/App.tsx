import React from 'react';
import { useState, useEffect } from 'react';
import { APIResponse, Book } from './types';
import './App.css';
import { Routes, Route, Link, useParams } from 'react-router-dom';

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error('REACT_APP_GOOGLE_API_KEY must be set');
}

function App() {
  const [pages, setPages] = useState<APIResponse[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [orderBy, setOrderBy] = useState('relevance');
  const [isLoading, setIsLoading] = useState(false);
  const startIndexRef = React.useRef(0);
  const maxResults = 10;

  function fetchBooks({ loadMore = false }: { loadMore?: boolean } = {}) {
    setIsLoading(true);
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${search}+${
        category !== 'all' ? `subject:${category}` : ''
      }&orderBy=${orderBy}&startIndex=${
        startIndexRef.current
      }&maxResults=${maxResults}&key=${apiKey}`,
    )
      .then(response => response.json())
      .then(data => {
        if (loadMore) {
          setPages(pages => [...pages, data]);
        } else {
          setPages([data]);
        }
      })
      .finally(() => setIsLoading(false));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchBooks();
  }

  function handleLoadMore() {
    startIndexRef.current += maxResults;
    fetchBooks({ loadMore: true });
  }

  return (
    <div className="h-screen flex flex-col">
      <Header
        onSubmit={handleSubmit}
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
      />

      <Routes>
        <Route
          path="/"
          element={
            <MainPage pages={pages} isLoading={isLoading} onLoadMore={handleLoadMore} />
          }
        />
        <Route path="/:bookId" element={<DetailPage />} />
      </Routes>
    </div>
  );
}

function MainPage({
  pages,
  isLoading,
  onLoadMore,
}: {
  pages: APIResponse[];
  isLoading: boolean;
  onLoadMore: () => void;
}) {
  const books: Book[] = pages.reduce<Book[]>(
    (all, next) => (next.items ? all.concat(next.items) : all),
    [],
  );

  return (
    <>
      {pages.length > 0 && (
        <div className="text-center font-bold mt-3">
          Found {pages[0].totalItems} results
        </div>
      )}

      <Books books={books} />

      {isLoading && (
        <div className="flex-grow grid place-items-center">
          <div className="loader"></div>
        </div>
      )}

      {pages.length > 0 && pages[0].totalItems !== 0 && (
        <div className="flex justify-center mt-5">
          <button
            className="bg-neutral-500 hover:bg-neutral-400 rounded px-5 py-3 font-bold transition-colors duration-500"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}

function DetailPage() {
  const [book, setBook] = useState<Book | undefined>(undefined);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { bookId } = useParams();

  useEffect(() => {
    fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setBook(data);
        }
      })
      .finally(() => setIsLoading(false));
  }, [bookId]);

  if (isLoading) {
    return <div className="loader" />;
  }

  if (error) {
    return (
      <div>
        <h1>Book with id "{bookId}" was not found. Sorry!</h1>
      </div>
    );
  }

  // typescript -_-
  if (book === undefined) return null;

  return (
    <div className="flex flex-row gap-10 justify-center items-center">
      <div>
        <img className="w-56 h-80" src={book.volumeInfo.imageLinks.thumbnail} alt="" />
      </div>
      <div>
        <div className="font-bold mb-4">{book.volumeInfo.categories}</div>
        <div className="font-bold mb-4">{book.volumeInfo.title}</div>
        <div className="font-bold mb-4">{book.volumeInfo.authors}</div>
        <div className="max-w-xl border-2 border-solid border-black px-3 py-3 bg-stone-100">
          {book.volumeInfo.description}
        </div>
      </div>
    </div>
  );
}

function Header({
  onSubmit,
  search,
  setSearch,
  category,
  setCategory,
  orderBy,
  setOrderBy,
}: {
  onSubmit: React.FormEventHandler;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  orderBy: string;
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <header className="header">
      <h1 className="header-title text-white text-center font-bold text-xl py-3">
        Search for books
      </h1>

      <form
        className="flex flex-col items-center w-full max-w-xl mx-auto"
        onSubmit={onSubmit}
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
  );
}

function Books({ books }: { books: Book[] }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
        {books.map((book, i) => (
          <div key={book.id + '_' + i} className="bg-stone-300">
            <div className="grid place-items-center pt-3">
              <Link to={book.id}>
                <img
                  className="shadow-md shadow-black h-40 w-28"
                  src={book.volumeInfo.imageLinks.smallThumbnail}
                  alt=""
                />
              </Link>
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

export default App;
