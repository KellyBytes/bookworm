import { useState } from 'react';
import axios from 'axios';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

const App = () => {
  const [showBrowse, setShowBrowse] = useState(true);
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWantToRead, setShowWantToRead] = useState(false);
  const [showRead, setShowRead] = useState(false);
  const [searched, setSearched] = useState(false);

  // Bug Test
  window.addEventListener('error', (e) => {
    alert('⚠️ JS Error: ' + e.message);
  });

  window.addEventListener('unhandledrejection', (e) => {
    alert('⚠️ Promise Rejection: ' + e.reason);
  });

  const searchBook = (query) => {
    setShowBrowse(true);
    setLoading(true);
    setSearched(true);
    let formatted = query.trim().replace(/\s+/g, '+');
    const api_key = import.meta.env.VITE_GBOOKS_API_KEY;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${formatted}&key=${api_key}&maxResults=40`;

    axios
      .get(url)
      .then((res) => {
        setBookData(res.data.items || []);
        console.log(res.data.items);
      })
      .catch((err) => {
        console.log(err);
        setBookData([]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <ThemeProvider>
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
          loading={loading}
          showBrowse={showBrowse}
          showWantToRead={showWantToRead}
          setShowWantToRead={setShowWantToRead}
          showRead={showRead}
          setShowRead={setShowRead}
          searched={searched}
          setSearched={setSearched}
        />
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default App;
