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
          <div className="card-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bookData.map((book) => {
              let thumbnail = book.item.imageLinks?.thumbnail;
              let rating = book.item.averageRating;
              let printType = book.item.printType;

              if (!thumbnail) thumbnail = noImg;

              return (
                <div
                  className="card w-52 bg-(--bg-top) border border-(--border-base) rounded p-3 mb-2 shadow-lg hover:scale-[0.98] hover:opacity-80 duration-200 relative"
                  key={book.id}
                  onClick={() => handleClick(book)}
                >
                  <img
                    src={thumbnail}
                    alt="thumbnail"
                    className="w-full h-54 object-cover border border-(--border-base) rounded-tl rounded-tr rounded-br-none rounded-bl-none"
                  />
                  <div className="bottom flex flex-col">
                    <h4 className="title font-merriweather font-medium tracking-wide text-center text-sm line-clamp-2 mt-2 mb-8">
                      {book.item.title}
                    </h4>
                    <p className="rating absolute bottom-3 left-3 right-3 bg-(--accent)/80 text-stone-200 text-center text-xs font-bold p-1">
                      {`${printType}${rating ? '  ⭐' + rating : ''}`}
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
        className="text-(--color-muted)"
        onClick={() => setShowBottomGrid(false)}
      >
        <i className="bx bx-chevrons-up text-(--color-muted) text-xl" />
        Back to My Books
      </button>
    </>
  );
};

export default Card;
