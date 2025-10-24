import { useState, useEffect } from 'react';
import Modal from './Modal';

const MyBooks = () => {
  const [myBooks, setMyBooks] = useState([]);
  const [show, setShow] = useState(false);
  const [bookItem, setBookItem] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('myBooks')) || [];
    setMyBooks(stored);
  }, []);

  const currentlyReading = myBooks.filter(
    (b) => b.status === 'Currently Reading'
  );
  const wantToRead = myBooks.filter((b) => b.status === 'Want to Read');
  const read = myBooks.filter((b) => b.status === 'Read');

  const latestWantToRead = wantToRead.at(-1);
  const latestRead = read.at(-1);

  return (
    <div className="my-books-container w-full max-w-3xl mx-auto mt-8">
      {/* Currently Reading */}
      <div className="mb-8">
        <h2 className="font-bold mb-2">Currently Reading</h2>
        {currentlyReading.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto p-4 bg-(--bg-bottom)">
            {currentlyReading.map((item) => (
              <div
                key={item.id}
                className="w-40 bg-(--bg-top) rounded shadow p-2 shrink-0 cursor-pointer hover:opacity-80 hover:scale-98 duration-200"
                onClick={() => {
                  setBookItem(item);
                  setShow(true);
                }}
              >
                <img
                  src={item.item.imageLinks?.smallThumbnail}
                  alt={item.item.title}
                  className="w-full h-40 object-cover rounded"
                />
                <p className="font-bitter font-semibold text-sm mt-2 line-clamp-2 text-center">
                  {item.item.title}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm opacity-70 italic">No books yet…</p>
        )}
      </div>

      <Modal
        show={show}
        bookItem={bookItem}
        onClose={() => {
          setShow(false);
          const updated = JSON.parse(localStorage.getItem('myBooks')) || [];
          setMyBooks(updated);
        }}
      />

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Want to Read */}
        <div className="bg-(--bg-top border rounded p-4 flex flex-col items-center">
          <h3 className="font-semibold">Want to Read</h3>
          {latestWantToRead ? (
            <>
              <img
                src={latestWantToRead.item.imageLinks?.smallThumbnail}
                alt=""
                className="w-20 h-28 mt-2 rounded shadow"
              />
              <p className="text-sm mt-2">{wantToRead.length} books</p>
            </>
          ) : (
            <p className="text-sm opacity-70 italic">None</p>
          )}
        </div>

        {/* Read */}
        <div className="bg-(--bg-top border rounded p-4 flex flex-col items-center">
          <h3 className="font-semibold">Read</h3>
          {latestRead ? (
            <>
              <img
                src={latestRead.item.imageLinks?.smallThumbnail}
                alt=""
                className="w-20 h-28 mt-2 rounded shadow"
              />
              <p className="text-sm mt-2">{read.length} books</p>
            </>
          ) : (
            <p className="text-sm opacity-70 italic">None</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBooks;
