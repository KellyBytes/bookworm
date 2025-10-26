import { useState, useEffect, useRef } from 'react';
import Card from './Card';
import Modal from './Modal';

const MyBooks = ({
  showWantToRead,
  showRead,
  setShowWantToRead,
  setShowRead,
}) => {
  const [myBooks, setMyBooks] = useState([]);
  const [show, setShow] = useState(false);
  const [bookItem, setBookItem] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const itemRefs = useRef([]);
  const isClickRef = useRef(false);

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

  // Move to the left by clicking the dot
  const scrollToItem = (index) => {
    isClickRef.current = true;
    const container = scrollRef.current;
    const item = itemRefs.current[index];

    if (container && item) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      const paddingLeft = 16;

      let left =
        container.scrollLeft +
        (itemRect.left - containerRect.left) -
        paddingLeft;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (left > maxScrollLeft) left = maxScrollLeft;
      if (left < 0) left = 0;

      container.scrollTo({
        left,
        behavior: 'smooth',
      });
      setActiveIndex(index);

      setTimeout(() => {
        isClickRef.current = false;
      }, 600);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      if (isClickRef.current) return;

      const scrollLeft = container.scrollLeft;

      // Search the item displayed at the left end
      let closestIndex = 0;
      let minDiff = Infinity;

      itemRefs.current.forEach((item, idx) => {
        if (!item) return;

        const diff = Math.abs(item.offsetLeft - scrollLeft);
        if (diff < minDiff && item.offsetLeft >= scrollLeft - 5) {
          minDiff = diff;
          closestIndex = idx;
        }
      });

      setActiveIndex(closestIndex);
    };

    container.addEventListener('scroll', onScroll);

    return () => container.removeEventListener('scroll', onScroll);
  }, [currentlyReading]);

  return (
    <>
      {!showWantToRead && !showRead ? (
        <div className="my-books-container w-full max-w-4xl mx-auto my-8">
          <section className="currently-reading-section mb-12">
            <h2 className="font-bold mb-2">Currently Reading</h2>
            {currentlyReading.length > 0 ? (
              <>
                {/* Scroll area */}
                <div
                  ref={scrollRef}
                  className="flex gap-4 p-4 bg-(--bg-bottom) overflow-x-auto no-scrollbar scroll-smooth"
                >
                  {currentlyReading.map((book, index) => (
                    <div
                      key={book.id}
                      ref={(el) => {
                        if (el) itemRefs.current[index] = el;
                      }}
                      className="w-40 bg-(--bg-top) rounded shadow p-2 shrink-0 cursor-pointer hover:opacity-80 hover:scale-95 duration-200 scroll-snap-center"
                      onClick={() => {
                        setBookItem(book);
                        setShow(true);
                      }}
                    >
                      {/* book.item = volumeInfo */}
                      <img
                        src={book.item.imageLinks?.thumbnail}
                        alt={book.item.title}
                        className="w-full h-40 object-cover rounded border border-(--border-muted)"
                      />
                      <p className="font-bitter font-semibold text-sm mt-2 line-clamp-2 text-center">
                        {book.item.title}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Dot navigation */}
                <div className="flex justify-center gap-2">
                  {currentlyReading.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        activeIndex === index
                          ? 'bg-(--secondary)'
                          : 'bg-gray-400'
                      }`}
                      onClick={() => scrollToItem(index)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm opacity-70 italic">No books yet…</p>
            )}
          </section>

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
            <div
              className="want-to-read-section bg-(--bg-top) border border-(--border-base) rounded p-4 flex flex-col items-center cursor-pointer"
              onClick={() => setShowWantToRead(true)}
            >
              <h3 className="font-semibold mb-2">Want to Read</h3>
              {latestWantToRead ? (
                <div className="flex items-center gap-8">
                  <img
                    src={latestWantToRead.item.imageLinks?.smallThumbnail}
                    alt=""
                    className="w-20 h-28 rounded border border-(--border-muted) shadow"
                  />
                  <p className="text-sm">{wantToRead.length} books</p>
                </div>
              ) : (
                <p className="mt-10 text-sm opacity-70 italic">None</p>
              )}
            </div>

            <div
              className="read-section bg-(--bg-top) border border-(--border-base) rounded p-4 flex flex-col items-center cursor-pointer"
              onClick={() => setShowRead(true)}
            >
              <h3 className="font-semibold mb-2">Read</h3>
              {latestRead ? (
                <div className="flex items-center gap-8">
                  <img
                    src={latestRead.item.imageLinks?.smallThumbnail}
                    alt=""
                    className="w-20 h-28 rounded border border-(--border-muted) shadow"
                  />
                  <p className="text-sm">{read.length} books</p>
                </div>
              ) : (
                <p className="mt-10 text-sm opacity-70 italic">None</p>
              )}
            </div>
          </div>
        </div>
      ) : showWantToRead ? (
        <section className="want-to-read-section max-w-4xl mb-12">
          <Card
            bookData={wantToRead}
            showWantToRead={showWantToRead}
            setShowBottomGrid={setShowWantToRead}
            setMyBooks={setMyBooks}
          />
        </section>
      ) : (
        <section className="read-section max-w-4xl mb-12">
          <Card
            bookData={read}
            showBottomGrid={showRead}
            setShowBottomGrid={setShowRead}
            setMyBooks={setMyBooks}
          />
        </section>
      )}
    </>
  );
};

export default MyBooks;
