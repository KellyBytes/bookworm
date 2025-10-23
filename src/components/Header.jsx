import { useState } from 'react';
import axios from 'axios';

const Header = ({ setBookData }) => {
  const [search, setSearch] = useState('');

  const searchBook = (e) => {
    if (e.key === 'Enter') {
      const api_key = import.meta.env.VITE_GBOOKS_API_KEY;
      let url = `https://www.googleapis.com/books/v1/volumes?q=${search}&key=${api_key}&maxResults=40`;

      axios
        .get(url)
        .then((res) => {
          setBookData(res.data.items);
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <header className="w-full max-w-5xl flex justify-between gap-4">
      <div className="flex flex-col relative">
        <h1 className="font-bio text-large text-gradient">Bookworm</h1>
        <small className="absolute -bottom-2 text-nowrap italic text-gradient">
          A room without books is like a body without a soul.
        </small>
      </div>
      <div className="search flex relative">
        <input
          type="text"
          className="w-md placeholder:text-stone-400 focus:placeholder:text-transparent"
          placeholder="Search books"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearch('')}
          onKeyDown={searchBook}
        />
        {/* <button> */}
        <i className="bx bx-search text-2xl text-stone-500 absolute right-2 top-2 cursor-pointer"></i>
        {/* </button> */}
      </div>
    </header>
  );
};

export default Header;
