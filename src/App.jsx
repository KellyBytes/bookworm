import { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

const App = () => {
  const [showBrowse, setShowBrowse] = useState(true);
  const [bookData, setBookData] = useState([]);

  const searchBook = (query) => {
    let formatted = query.trim().replace(/\s+/g, '+');
    const api_key = import.meta.env.VITE_GBOOKS_API_KEY;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${formatted}&key=${api_key}&maxResults=10`;

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
      />
      <Main
        bookData={bookData}
        searchBook={searchBook}
        showBrowse={showBrowse}
      />
      <Footer />
    </>
  );
};

export default App;
