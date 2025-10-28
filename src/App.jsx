import { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

const App = () => {
  const [showBrowse, setShowBrowse] = useState(true);
  const [bookData, setBookData] = useState([]);
  const [showWantToRead, setShowWantToRead] = useState(false);
  const [showRead, setShowRead] = useState(false);

  const searchBook = (query) => {
    setShowBrowse(true);
    let formatted = query.trim().replace(/\s+/g, '+');
    const api_key = import.meta.env.VITE_GBOOKS_API_KEY;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${formatted}&key=${api_key}&maxResults-40`;

    axios
      .get(url)
      .then((res) => {
        setBookData(res.data.items);
        console.log(res.data.items);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header
        showBrowse={showBrowse}
        setShowBrowse={setShowBrowse}
        setBookData={setBookData}
        searchBook={searchBook}
        setShowWantToRead={setShowWantToRead}
        setShowRead={setShowRead}
      />
      <Main
        bookData={bookData}
        searchBook={searchBook}
        showBrowse={showBrowse}
        showWantToRead={showWantToRead}
        setShowWantToRead={setShowWantToRead}
        showRead={showRead}
        setShowRead={setShowRead}
      />
      <Footer />
    </>
  );
};

export default App;
