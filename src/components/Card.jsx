import React from 'react';

const Card = ({ bookData }) => {
  return (
    <div>
      {bookData && bookData.length > 0 ? (
        bookData.map((book) => (
          <div key={book.id}>
            <h3>{book.volumeInfo.title}</h3>
          </div>
        ))
      ) : (
        <p>No books found</p>
      )}{' '}
    </div>
  );
};

export default Card;
