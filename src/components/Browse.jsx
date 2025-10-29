import { useState } from 'react';
import Modal from './Modal';
import noImg from '../assets/images/no-img.png';

const Browse = ({ bookData, searchBook, loading }) => {
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
      {loading ? (
        <div className="fixed inset-0 bg-(bg-top)/70 backdrop-blur-sm flex flex-col justify-center items-center z-50">
          <div className="w-12 h-12 border-4 border(--accent) border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-(--color-muted)">
            Loading...
          </p>
        </div>
      ) : bookData && bookData.length > 0 ? (
        <div className="card-container max-w-4xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mt-8">
          {bookData.map((book) => {
            let thumbnail = book.volumeInfo.imageLinks?.thumbnail;
            let amount = book.saleInfo.listPrice?.amount;
            let rating = book.volumeInfo.averageRating;
            let isbn =
              book.volumeInfo.industryIdentifiers?.find(
                (id) => id.type === 'ISBN_13'
              )?.identifier ||
              book.volumeInfo.industryIdentifiers?.[0]?.identifier ||
              'No ISBN';
            let printType = book.volumeInfo.printType;

            if (!thumbnail) thumbnail = noImg;

            return (
              <div
                className="card w-34 sm:w-52 bg-(--bg-top) border border-(--border-base) rounded p-2 sm:p-3 mb-2 shadow-lg hover:scale-[0.98] hover:opacity-80 duration-200 relative"
                key={book.id}
                onClick={() => handleClick(book)}
              >
                <img
                  src={thumbnail}
                  alt="thumbnail"
                  className="w-full h-36 sm:h-54 object-cover border border-(--border-base) rounded-tl rounded-tr rounded-br-none rounded-bl-none"
                />
                <div className="bottom flex flex-col">
                  <h4 className="title w-full h-6 font-merriweather font-semibold text-xs sm:text-sm text-center whitespace-nowrap text-ellipsis overflow-hidden leading-snug px-1 mt-2 mb-6">
                    {book.volumeInfo.title}
                  </h4>
                  <p className="absolute bottom-3 left-3 right-3 bg-(--accent)/80 text-(--color-highlight) text-[0.625rem] sm:text-xs font-bold text-center whitespace-nowrap text-ellipsis overflow-hidden p-1">
                    {`${
                      rating
                        ? 'Ave Rating ⭐' + rating
                        : amount
                        ? '$' + amount
                        : isbn
                        ? 'ISBN: ' + isbn
                        : printType
                    }`}
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
          <h2 className="hidden md:block mt-32 italic text-center text-gradient">
            A room without books is like
            <br /> a body without a soul.
          </h2>
          <div className="w-11/12 md:w-1/2 flex justify-center flex-wrap gap-3 mt-10 mb-8 md:mt-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => searchBook(`subject:${category}`)}
                className="px-3 py-1 rounded shadow-sm bg-(--bg-bottom) dark:bg-(--bg-top) dark:border dark:border-(--border-base) hover:scale-[0.98] hover:opacity-80 transition duration-200 active:translate-y-1"
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
