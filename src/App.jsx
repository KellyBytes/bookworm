import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';

const App = () => {
  const [bookData, setBookData] = useState([]);

  return (
    <>
      <Header setBookData={setBookData} />
      <Card bookData={bookData} />
      <Footer />
    </>
  );
};

export default App;
