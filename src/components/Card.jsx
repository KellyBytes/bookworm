import { useState } from 'react';
import Modal from './Modal';
import noImg from '../assets/images/no-img.png';

const Card = ({ bookData, showWantToRead, setShowBottomGrid }) => {
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
          <div className="flex justify-between gap-x-4 mt-8">
            <h2 className="font-bold mb-2">
              {showWantToRead ? 'Want to Read' : 'Read'}
            </h2>
            <button
              className="text-(--text-muted)"
              onClick={() => setShowBottomGrid(false)}
            >
              <i className="bx bx-chevrons-up text-(--text-muted) text-xl translate-y-1" />{' '}
              Back to My Books
            </button>
          </div>
          <div className="card-container grid grid-cols-4 gap-4">
            {bookData.map((book) => {
              let thumbnail = book.item.imageLinks?.thumbnail;
              let rating = book.item.averageRating;
              let printType = book.item.printType;

              if (!thumbnail) thumbnail = noImg;

              return (
                <div
                  className="card bg-(--bg-top) border border-(--border-muted) rounded p-3 mb-2 shadow-lg hover:scale-95 hover:opacity-80 duration-200 relative"
                  key={book.id}
                  onClick={() => handleClick(book)}
                >
                  <img
                    src={thumbnail}
                    alt="thumbnail"
                    className="w-full h-42 object-cover border border-(--border-base) rounded-tl rounded-tr rounded-br-none rounded-bl-none"
                  />
                  <div className="bottom flex flex-col">
                    <h4 className="title font-bitter font-medium tracking-wide text-center text-sm line-clamp-2 mt-2 mb-8">
                      {book.item.title}
                    </h4>
                    <p className="rating absolute bottom-3 left-3 right-3 bg-(--primary)/80 text-stone-200 text-center text-xs font-bold p-1">
                      {`${printType}${rating ? ' ⭐' + rating : ''}`}
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
        </>
      ) : (
        <p className="text-sm opacity-70 italic">No books yet…</p>
      )}
    </>
  );
};

export default Card;
