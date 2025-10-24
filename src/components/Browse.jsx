import { useState } from 'react';
import Modal from './Modal';
import noImg from '../assets/images/no-img.png';

const Browse = ({ bookData, searchBook }) => {
  const [show, setShow] = useState(false);
  const [bookItem, setBookItem] = useState(null);

  const categories = [
    'Biography',
    'Business',
    'Classics',
    'Computing',
    'Fantasy',
    'Fiction',
    'History',
    'Literature',
    'Mystery',
    'Philosophy',
    'Political Science',
    'Religion',
    'Romance',
    'Science Fiction',
    'Self-Help',
    'Science',
    'Travel',
  ];

  const handleClick = (book) => {
    setBookItem(book);
    setShow(true);
  };

  return (
    <>
      {bookData && bookData.length > 0 ? (
        <div className="card-container max-w-4xl grid grid-cols-4 gap-4 mt-8">
          {bookData.map((book) => {
            let thumbnail = book.volumeInfo.imageLinks?.smallThumbnail;
            let amount = book.saleInfo.listPrice?.amount
              ? '$' + book.saleInfo.listPrice?.amount
              : 'Price u/a';
            let printType = book.volumeInfo.printType;

            if (!thumbnail) thumbnail = noImg;

            return (
              <div
                className="card bg-(--bg-top) border border-(--border-muted) rounded p-3 mb-2 shadow-lg hover:scale-98 hover:opacity-80 duration-200 relative"
                key={book.id}
                onClick={() => handleClick(book)}
              >
                <img
                  src={thumbnail}
                  alt="thumbnail"
                  className="w-full h-54 object-cover rounded-tl rounded-tr rounded-br-none rounded-bl-none"
                />
                <div className="bottom flex flex-col">
                  <h4 className="title font-bitter font-medium tracking-wide text-center text-sm mt-2 mb-8">
                    {book.volumeInfo.title}
                  </h4>
                  <p className="amount absolute bottom-3 left-3 right-3 bg-(--primary)/80 text-stone-200 text-center text-xs font-bold p-1">
                    {`${printType} - ${amount}`}
                  </p>
                </div>
              </div>
            );
          })}

          <Modal
            show={show}
            bookItem={bookItem}
            onClose={() => setShow(false)}
          />
        </div>
      ) : (
        <>
          <h2 className="italic text-center text-gradient">
            A room without books is like
            <br /> a body without a soul.
          </h2>
          <div className="w-1/2 flex justify-center flex-wrap gap-3 mt-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => searchBook(`subject:${category}`)}
                className="px-3 py-1 rounded shadow-sm bg-(--bg-bottom) hover:scale-98 hover:opacity-80 transition-opacity transition-scale duration-200 active:translate-y-2"
              >
                {category}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Browse;
