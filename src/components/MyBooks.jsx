import { useState, useEffect, useRef } from 'react';
import Card from './Card';
import Modal from './Modal';
import noImg from '../assets/images/no-img.png';

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
                  className="flex gap-4 p-4 bg-(--bg-bottom) overflow-x-auto no-scrollbar scroll-smooth"
                >
                  {currentlyReading.map((book, index) => (
                    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-(--bg-base) rounded shadow-md">
                      <div
                        key={book.id}
                        ref={(el) => {
                          if (el) itemRefs.current[index] = el;
                        }}
                        className="w-32 shrink-0 hover:opacity-80 hover:scale-[0.98] duration-200 scroll-snap-center cursor-pointer"
                        onClick={() => {
                          setBookItem(book);
                          setShow(true);
                        }}
                      >
                        {/* book.item = volumeInfo */}
                        <img
                          src={book.item.imageLinks?.thumbnail}
                          alt={book.item.title}
                          className="w-full h-40 object-cover rounded border border-(--border-base)"
                        />
                        <p className="font-merriweather font-semibold text-sm mt-2 line-clamp-2 text-center h-11 flex items-center justify-center leading-snug">
                          {book.item.title}
                        </p>
                      </div>

                      {book.date.due && (
                        <div className="progress flex justify-center items-center gap-x-4">
                          <div className="pages-to-read w-24 flex flex-col items-center gap-y-2 px-4">
                            <h1 className="font-semibold mt-4">
                              {pagesToReadToday(
                                book.finished || 0,
                                book.item.pageCount,
                                remainingDays(book.date.due)
                              )}
                            </h1>
                            <small className="text-center mb-2">
                              pages for today
                            </small>
                            <button
                              className="bg-(--accent) text-(--color-highlight) text-sm uppercase border border-(--border-base) rounded shadow py-2 px-3 hover:opacity-80 hover:scale-[0.98] duration-200"
                              onClick={() => {
                                setSelectedBookId(book.id);
                                setShowProgressModal(true);
                              }}
                            >
                              Update
                            </button>
                          </div>

                          {showProgressModal && (
                            <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                              <div className="bg-(--bg-base) rounded-lg p-6 w-64 flex flex-col items-center shadow-md">
                                <h3 className="font-semibold mb-4">
                                  Update Progress
                                </h3>
                                <label className="w-full inline-block text-center">
                                  Page
                                  <input
                                    type="number"
                                    min="0"
                                    max={book.item.pageCount}
                                    value={finishedPages}
                                    onChange={(e) =>
                                      setFinishedPages(e.target.value)
                                    }
                                    className="w-20 border border-(--border-base) rounded p-2 text-center mx-2 mb-4"
                                    placeholder="#"
                                  />
                                  of {book.item.pageCount}
                                </label>
                                <div className="flex gap-4">
                                  <button
                                    className="bg-(--accent)/90 text-(--color-highlight) px-4 py-2 rounded hover:opacity-80 hover:scale-[0.98] duration-200"
                                    onClick={handleSave}
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="bg-(--bg-bottom) px-4 py-2 rounded hover:opacity-80 hover:scale-[0.98] duration-200"
                                    onClick={() => setShowProgressModal(false)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="progress-percentage flex flex-col">
                            <div className="pages-circle relative w-24 h-24">
                              <svg
                                className="w-full h-full"
                                viewBox="0 0 36 36"
                              >
                                {/* Background circle */}
                                <path
                                  className="text-(--bg-muted)"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  fill="none"
                                  d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                {/* Progress circle */}
                                <path
                                  // className="text-green-500"
                                  className="text-(--accent)"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeDasharray={`${
                                    (book.finished / book.item.pageCount) * 100
                                  }, 100`}
                                  strokeLinecap="round"
                                  fill="none"
                                  d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                              </svg>
                              {/* Center text */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-md font-semibold">
                                  {`${Math.ceil(
                                    (book.finished / book.item.pageCount) * 100
                                  )}%`}
                                </span>
                                <span className="text-[0.625rem] text-(--color-muted)">
                                  Read
                                </span>
                              </div>
                            </div>
                            <div className="text-center mt-2">
                              <small>Page {book.finished}</small>
                              <br />
                              <small>of {book.item.pageCount}</small>
                            </div>
                          </div>

                          <div className="progress-days flex flex-col">
                            <div className="days-circle relative w-24 h-24">
                              <svg
                                className="w-full h-full"
                                viewBox="0 0 36 36"
                              >
                                {(() => {
                                  const total = totalDays(
                                    book.date.start,
                                    book.date.due
                                  );
                                  const remaining = remainingDays(
                                    book.date.due
                                  );
                                  const anglePerSegment = 360 / total;
                                  const gap = 15; // degrees for divisions
                                  const radius = 15.9155;
                                  // Starting from top, clockwise
                                  const polarToCartesian = (
                                    cx,
                                    cy,
                                    r,
                                    angle
                                  ) => {
                                    const rad = (angle - 0) * (Math.PI / 180);
                                    return {
                                      x: cx + r * Math.cos(rad),
                                      y: cy + r * Math.sin(rad),
                                    };
                                  };
                                  const describeArc = (
                                    cx,
                                    cy,
                                    r,
                                    startAngle,
                                    endAngle
                                  ) => {
                                    const start = polarToCartesian(
                                      cx,
                                      cy,
                                      r,
                                      startAngle
                                    );
                                    const end = polarToCartesian(
                                      cx,
                                      cy,
                                      r,
                                      endAngle
                                    );
                                    const largeArcFlag =
                                      endAngle - startAngle <= 180 ? 0 : 1;
                                    return [
                                      'M',
                                      start.x,
                                      start.y,
                                      'A',
                                      r,
                                      r,
                                      0,
                                      largeArcFlag,
                                      1,
                                      end.x,
                                      end.y,
                                    ].join(' ');
                                  };
                                  return Array.from({ length: total }).map(
                                    (_, i) => {
                                      // Starting from top, clockwise
                                      const startAngle =
                                        270 + i * anglePerSegment + gap / 2;
                                      const endAngle =
                                        270 +
                                        (i + 1) * anglePerSegment -
                                        gap / 2;
                                      const isRemaining = i < remaining; // green for remaining
                                      return (
                                        <path
                                          key={i}
                                          d={describeArc(
                                            18,
                                            18,
                                            radius,
                                            startAngle,
                                            endAngle
                                          )}
                                          stroke={
                                            isRemaining
                                              ? // ? '#22c55e'
                                                'var(--accent)'
                                              : 'var(--bg-muted)'
                                          }
                                          strokeWidth="3"
                                          fill="none"
                                          strokeLinecap="round"
                                        />
                                      );
                                    }
                                  );
                                })()}
                              </svg>
                              {/* Center text */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-md font-semibold">
                                  {remainingDays(book.date.due)}
                                </span>
                                <span className="text-[0.625rem] text-(--color-muted)">
                                  days left
                                </span>
                              </div>
                            </div>
                            <div className="text-center mt-2">
                              <small>Started on </small>
                              <br />
                              <small>{book.date.start}</small>
                            </div>
                          </div>
                        </div>
                      )}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="want-to-read-section bg-(--bg-top) border border-(--border-base) rounded p-6 flex flex-col items-center hover:opacity-80 hover:scale-[0.98] duration-200 cursor-pointer"
              onClick={() => setShowWantToRead(true)}
            >
              <h3 className="font-semibold text-(--color-top) pb-8">
                Want to Read
              </h3>
              <div className="flex items-center gap-8">
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
              <h3 className="font-semibold text-(--color-top) pb-8">Read</h3>
              <div className="flex items-center gap-8">
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
