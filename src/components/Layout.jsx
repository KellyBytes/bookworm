import { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

const Layout = (props) => {
  const { children } = props;
  const [search, setSearch] = useState('');
  const [bookData, setBookData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const searchBook = (e) => {
    if (e.key === 'Enter') {
      const api_key = import.meta.env.GBOOKS_API_KEY;
      let url = `https://www.googleapis.com/books/v1/volumes?q=${search}&key=${api_key}&maxResults=40`;

      axios
        .get(url)
        .then((res) => setBookData(res.data.items))
        .catch((err) => console.log(err));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const header = (
    <header>
      <h1>
        A room without books is like
        <br /> a body without a soul.
      </h1>
      <h2>Find Your Book</h2>
      <div className="search">
        <input
          type="text"
          placeholder="Enter your book name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={searchBook}
        />
        <button>
          <i className="bx bx-search"></i>
        </button>
      </div>
    </header>
  );

  const footer = (
    <footer>
      <p>
        <span className="text-gradient">Bookworm</span>
        <br />
        <div className="credit">
          Created by <a href="https://github.com/KellyBytes">KellyBytes</a>.
          Check out the project on{' '}
          <a target="_blank" href="https://github.com/KellyBytes/bookworm">
            GitHub
          </a>
          !
        </div>
      </p>
    </footer>
  );

  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
};

export default Layout;
