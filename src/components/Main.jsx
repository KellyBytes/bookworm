import { useState } from 'react';
import Card from './Card';
import Browse from './Browse';
import MyBooks from './MyBooks';

const Main = ({ bookData, searchBook, showBrowse }) => {
  return (
    <main className="w-full flex justify-center items-center">
      {/* <Card bookData={bookData} /> */}
      {showBrowse ? (
        <Browse bookData={bookData} searchBook={searchBook} />
      ) : (
        <MyBooks />
      )}
    </main>
  );
};

export default Main;
