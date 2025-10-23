import { useState } from 'react';
import Modal from './Modal';

const Card = ({ bookData }) => {
  const [show, setShow] = useState(false);
  const [bookItem, setBookItem] = useState(null);

  const handleClick = (book) => {
    setBookItem(book);
    setShow(true);
  };

  return (
    <div className="card-container max-w-4xl grid grid-cols-4 gap-4">
      {bookData && bookData.length > 0 ? (
        <>
          {bookData.map((book) => {
            let thumbnail = book.volumeInfo.imageLinks?.smallThumbnail;
            let amount = book.saleInfo.listPrice?.amount;

            if (!thumbnail || !amount) return null;

            return (
              <div
                className="card bg-(--primary) rounded-2xl p-3 mb-2 shadow-2xl hover:scale-98 hover:opacity-90 duration-200 relative"
                key={book.id}
                onClick={() => handleClick(book)}
              >
                <img
                  src={thumbnail}
                  alt="thumbnail"
                  className="w-full h-54 object-cover rounded-tl-2xl rounded-tr-2xl rounded-br-none rounded-bl-none"
                />
                <div className="bottom flex flex-col">
                  <h4 className="title font-bitter font-medium tracking-wide text-center text-sm mt-2 mb-8">
                    {book.volumeInfo.title}
                  </h4>
                  <p className="amount absolute bottom-3 left-3 right-3 bg-(--secondary) text-stone-200 text-center text-xs font-bold p-1">
                    {`$${amount}`}
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
        </>
      ) : (
        <p>No books found</p>
      )}
    </div>
  );
};

export default Card;
