import { useState, useEffect, useRef } from 'react';
import Card from './Card';
import Modal from './Modal';
import noImg from '../assets/images/no-img.png';
import BookCard from './BookCard';

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
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [finishedPages, setFinishedPages] = useState(0);
  const [selectedBookId, setSelectedBookId] = useState(null);

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
  const latestThreeWantToRead = wantToRead.slice(0, 3).reverse();
  const latestThreeRead = read.slice(0, 3).reverse();

  const today = new Date().toLocaleDateString('en-CA');

  const totalDays = (start, due) => {
    if (!due) return null;

    const startDate = new Date(start);
    const dueDate = new Date(due);

    const diffTime = dueDate - startDate + 1000 * 60 * 60 * 24; // milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const remainingDays = (due) => {
    if (!due) return null;

    const dueDate = new Date(due);
    const todayDate = new Date(today);

    const diffTime = dueDate - todayDate + 1000 * 60 * 60 * 24; // milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const updateBookProgress = (id, finished) => {
    const updatedBooks = myBooks.map((b) =>
      b.id === id ? { ...b, finished } : b
    );
    setMyBooks(updatedBooks);
    localStorage.setItem('myBooks', JSON.stringify(updatedBooks));
  };

  const pagesToReadToday = (finished, total, remainingDays) => {
    if (!remainingDays) remainingDays = 1;
    if (!finished) finished = 0;

    return Math.ceil((total - finished) / remainingDays);
  };

  const handleSave = () => {
    // if (finishedPages.trim() === '') return;
    if (!selectedBookId) return;

    updateBookProgress(selectedBookId, Number(finishedPages));
    setShowProgressModal(false);
    setFinishedPages('');
    setSelectedBookId(null);
  };

  // Move to the left by clicking the dot
  const scrollToItem = (index) => {
    isClickRef.current = true;
    const container = scrollRef.current;
    const item = itemRefs.current[index];

    if (container && item) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      // const paddingLeft = 16;
      const paddingLeft = 32;

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
        <div className="my-books-container w-full max-w-[clamp(19rem,1.353rem+94.118vw,39rem)] sm:max-w-3xl lg:max-w-4xl mx-auto my-8">
          <section className="currently-reading-section mb-12">
            <h2 className="font-bold text-(--color-top) mb-2">
              Currently Reading
            </h2>
            {currentlyReading.length > 0 ? (
              <>
                {/* Scroll area */}
                <div
                  ref={scrollRef}
                  className="flex gap-4 p-4 bg-(--bg-bottom) border border-(--border-base) rounded overflow-x-auto no-scrollbar scroll-smooth"
                >
                  {currentlyReading.map((book, index) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      index={index}
                      itemRefs={itemRefs}
                      setBookItem={setBookItem}
                      setShow={setShow}
                      setShowProgressModal={setShowProgressModal}
                      setSelectedBookId={setSelectedBookId}
                      setFinishedPages={setFinishedPages}
                      setMyBooks={setMyBooks}
                      pagesToReadToday={pagesToReadToday}
                      remainingDays={remainingDays}
                      totalDays={totalDays}
                      showProgressModal={showProgressModal}
                      bookItem={bookItem}
                      handleSave={handleSave}
                    />
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
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div
              className="want-to-read-section bg-(--bg-top) border border-(--border-base) rounded p-6 flex flex-col items-center hover:opacity-80 hover:scale-[0.98] duration-200 cursor-pointer"
              onClick={() => setShowWantToRead(true)}
            >
              <h3 className="font-semibold text-center text-(--color-top) pb-8">
                Want to Read
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-y-4 gap-x-8">
                <div className="relative w-20 h-28">
                  {wantToRead.length > 0 ? (
                    latestThreeWantToRead.map((book, index) => (
                      <img
                        key={book.id}
                        src={book.item.imageLinks?.smallThumbnail || noImg}
                        alt="thumbnail"
                        className="w-20 h-28 rounded border border-(--border-base) shadow absolute"
                        style={{
                          transform: `translate(${index * -5}px, ${
                            index * -5
                          }px)`,
                          zIndex: index * 1,
                        }}
                      />
                    ))
                  ) : (
                    <img
                      src={noImg}
                      alt="no books"
                      className="w-20 h-28 rounded border border-(--border-base) shadow absolute"
                    />
                  )}
                </div>
                <p className="text-sm">
                  {wantToRead.length}{' '}
                  {wantToRead.length === 1 ? 'book' : 'books'}
                </p>
              </div>
            </div>

            <div
              className="read-section bg-(--bg-top) border border-(--border-base) rounded p-6 flex flex-col items-center hover:opacity-80 hover:scale-[0.98] duration-200 cursor-pointer"
              onClick={() => setShowRead(true)}
            >
              <h3 className="font-semibold text-center text-(--color-top) pb-8">
                Read
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-y-4 gap-x-8">
                <div className="relative w-20 h-28">
                  {latestThreeRead.length > 0 ? (
                    latestThreeRead.map((book, index) => (
                      <img
                        key={book.id}
                        src={book.item.imageLinks?.smallThumbnail || noImg}
                        alt="thumbnail"
                        className="w-20 h-28 rounded border border-(--border-base) shadow absolute"
                        style={{
                          transform: `translate(${index * -5}px, ${
                            index * -5
                          }px)`,
                          zIndex: index * 1,
                        }}
                      />
                    ))
                  ) : (
                    <img
                      src={noImg}
                      alt="no books"
                      className="w-20 h-28 rounded border border-(--border-base) shadow absolute"
                    />
                  )}
                </div>
                <p className="text-sm">
                  {read.length} {read.length === 1 ? 'book' : 'books'}
                </p>
              </div>
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
