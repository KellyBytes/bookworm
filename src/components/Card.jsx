import { useState } from 'react';
import Modal from './Modal';
import noImg from '../assets/images/no-img.png';

const Card = ({ bookData, showWantToRead, setShowBottomGrid, setMyBooks }) => {
  const [show, setShow] = useState(false);
  const [bookItem, setBookItem] = useState(null);

  const handleClick = (book) => {
    setBookItem(book);
    setShow(true);
  };

  return (
    <>
      {bookData && bookData.length > 0 ? (
        <>
          <h2 className="font-bold text-(--color-top) mt-8 mb-2">
            {showWantToRead ? 'Want to Read' : 'Read'}
          </h2>
          <div className="card-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bookData.map((book) => {
              let thumbnail = book.item.imageLinks?.thumbnail;
              let rating = book.item.averageRating;
              let myRating = book.rating;
              let isbn =
                book.item.industryIdentifiers?.find(
                  (id) => id.type === 'ISBN_13'
                )?.identifier ||
                book.item.industryIdentifiers?.[0]?.identifier ||
                'No ISBN';

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
                      {book.item.title}
                    </h4>
                    <p className="rating absolute bottom-3 left-3 right-3 bg-(--accent)/80 text-(--color-highlight) text-[0.625rem] sm:text-xs font-bold text-center whitespace-nowrap text-ellipsis overflow-hidden p-1">
                      {`${
                        myRating
                          ? 'My Rating ⭐' + myRating
                          : rating
                          ? 'Ave Rating ⭐' + rating
                          : 'ISBN: ' + isbn
                      }`}
                    </p>
                  </div>
                </div>
              );
            })}

            <Modal
              show={show}
              bookItem={bookItem}
              onClose={() => {
                setShow(false);
                const updated =
                  JSON.parse(localStorage.getItem('myBooks')) || [];
                setMyBooks(updated);
              }}
            />
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-center opacity-70 italic my-12 md:my-24">
            No books yet…
          </p>
        </>
      )}
      <button
        className="text-(--color-muted) mt-4"
        onClick={() => setShowBottomGrid(false)}
      >
        <i className="bx bx-chevrons-up text-(--color-muted) text-xl" />
        Back to My Books
      </button>
    </>
  );
};

export default Card;
