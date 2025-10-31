import { useState, useEffect, useRef } from 'react';
import noImg from '../assets/images/no-img.png';

const Modal = ({ show, bookItem, onClose }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [message, setMessage] = useState('');
  const [dateModalStatus, setDateModalStatus] = useState(null); // 'Read' or 'Currently Reading'
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const today = new Date().toLocaleDateString('en-CA');
  const [selectedStartDate, setSelectedStartDate] = useState(today);
  const [selectedDueDate, setSelectedDueDate] = useState('');
  const [selectedFinishedDate, setSelectedFinishedDate] = useState(today);
  const menuRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [show]);

  useEffect(() => {
    if (!bookItem) return;
    const storedBooks = JSON.parse(localStorage.getItem('myBooks') || []);
    const existing = storedBooks.find((b) => b.id === bookItem.id);
    if (existing) {
      setRating(existing.rating || 0);
      setNotes(existing.notes || '');
    } else {
      setRating(0);
      setNotes('');
    }
  }, [bookItem]);

  const saveToLocalStorage = (newRating = rating, newNotes = notes) => {
    const storedBooks = JSON.parse(localStorage.getItem('myBooks') || []);
    const target = storedBooks.find((b) => b.id === bookItem.id);
    if (target) {
      target.rating = newRating;
      target.notes = newNotes;
      localStorage.setItem('myBooks', JSON.stringify(storedBooks));
    }
  };

  const handleRatingClick = (num) => {
    setRating(num);
    saveToLocalStorage(num, notes);
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    saveToLocalStorage(rating, newNotes);
  };

  const renderMyStars = (ratingValue) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        onClick={() => handleRatingClick(i + 1)}
        className={`cursor-pointer text-2xl transition-transform duration-150 ${
          i < ratingValue ? 'text-yellow-400' : 'text-gray-400'
        } hover:scale-110`}
      >
        ★
      </span>
    ));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  if (!show || !bookItem) return null;

  let item = bookItem.volumeInfo || bookItem.item;
  let thumbnail = item.imageLinks?.thumbnail;

  const handleOptionClick = (status, dateObj) => {
    const storedBooks = JSON.parse(localStorage.getItem('myBooks') || '[]');
    const today = new Date().toLocaleDateString('en-CA');

    if (status === 'Remove') {
      const updated = storedBooks.filter((b) => b.id !== bookItem.id);
      localStorage.setItem('myBooks', JSON.stringify(updated));
      setMessage('Book Removed!');
    } else {
      let date = '';

      if (status === 'Currently Reading') {
        date = {
          start: dateObj?.start || today,
          due: dateObj?.due || '',
        };
      } else if (status === 'Read') {
        date = { finished: dateObj?.finished || today };
      } else if (status === 'Want to Read') {
        date = '';
      } else {
        date = dateObj || today;
      }

      const newBook = {
        id: bookItem.id,
        status,
        date,
        item,
        finished: 0,
      };

      const updated = [
        newBook,
        ...storedBooks.filter((b) => b.id !== bookItem.id),
      ];

      localStorage.setItem('myBooks', JSON.stringify(updated));
      setMessage('Status Changed!');
    }

    setShowMenu(false);
    setTimeout(() => setMessage(''), 2000);
  };

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;

    for (let i = 0; i < full; i++) {
      stars.push(<span key={`full-${i}`}>★</span>);
    }
    if (half) {
      stars.push(<span key="half">☆</span>); // 半分風
    }
    while (stars.length < 5) {
      stars.push(<span key={`empty-${stars.length}`}>✩</span>);
    }
    return stars;
  };

  return (
    <>
      <div
        className="overlay min-h-100vh w-full fixed inset-0 z-[9999] bg-linear-to-br from-[rgba(0,0,0,0.7)] to-[rgba(0,0,0,0.8)] flex justify-center items-center"
        onClick={onClose}
      >
        <div
          className="overlay-inner bg-(--bg-top) w-11/12 sm:w-xl h-4/5 lg:h-11/12 p-6 pr-8 lg:p-10 rounded-xl text-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="close absolute top-4 right-4 outline-none border-none text-lg bg-transparent"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>

          <div className="inner-scroll h-full overflow-y-auto no-scrollbar">
            <div className="inner-container flex justify-center gap-x-6">
              <img
                src={thumbnail || noImg}
                alt="thumbnail"
                className="h-0 w-0 sm:w-40 sm:h-56 object-cover rounded"
              />
              <div className="info">
                <h1 className="font-merriweather tracking-wide text-(--color-top)">
                  {item.title}
                </h1>
                <h3 className="mt-3 font-serrat font-semibold text-(--color-muted)">
                  {item.authors.map((author, index) => (
                    <span key={`author-${index}`}>
                      {author}
                      {index < item.authors.length - 1 && ', '}
                    </span>
                  ))}
                </h3>
                <h4 className="font-serrat text-sm text-(--color-muted)">
                  {`${item.publisher}; ${item.publishedDate}; p. ${item.pageCount}`}
                </h4>
                {item.averageRating && (
                  <div className="flex items-center gap-2 mt-2 text-yellow-500 text-lg">
                    {renderStars(item.averageRating)}
                  </div>
                )}
                <div className="buttons flex justify-center mt-4 gap-x-2 sm:gap-x-4 relative">
                  <a href={item.previewLink} target="_blank" rel="noreferrer">
                    <button
                      className="w-18 sm:w-24 rounded-sm mt-4 py-1.5 px-2 bg-(--accent) text-neutral-50 text-sm font-semibold hover:scale-[0.98] hover:opacity-90 active:translate-y-0.5 duration-200"
                      onClick={onClose}
                    >
                      More
                    </button>
                  </a>

                  <div className="relative" ref={menuRef}>
                    <button
                      className="w-36 sm:w-48 rounded-sm mt-4 py-1.5 px-2 bg-(--accent-muted) text-(--color-base) text-sm font-semibold hover:scale-[0.98] hover:opacity-90 active:translate-y-0.5 duration-200"
                      onClick={() => setShowMenu((prev) => !prev)}
                    >
                      My Book Status
                    </button>

                    {showMenu && (
                      <div className="absolute top-full left-0 mt-2 w-full bg-(--bg-base) border border-(--border-base) rounded-md shadow-md z-50">
                        {[
                          'Want to Read',
                          'Currently Reading',
                          'Read',
                          'Remove',
                        ].map((option) => (
                          <button
                            key={option}
                            className="block w-full text-left px-2 sm:px-4 py-2 hover:bg-(--bg-top) text-sm"
                            onClick={() => {
                              if (
                                option === 'Currently Reading' ||
                                option === 'Read'
                              ) {
                                setDateModalStatus(option);
                              } else {
                                handleOptionClick(option);
                              }
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {message && (
                    <p className="text-center mt-3 text-sm font-semibold text-green-700 animate-fade-in absolute -bottom-6 right-12 z-50">
                      {message}
                    </p>
                  )}

                  {dateModalStatus && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
                      <div className="bg-(--bg-top) p-4 rounded-md shadow-lg text-center">
                        <p className="mb-2 font-semibold text-lg">
                          {dateModalStatus === 'Currently Reading'
                            ? 'Select Dates'
                            : 'Select Date'}
                        </p>

                        {dateModalStatus === 'Currently Reading' ? (
                          <>
                            {/* Start Date */}
                            <label className="flex items-center mb-2 text-base">
                              <span className="inline-block w-28 text-left">
                                Started on:
                              </span>
                              <input
                                type="date"
                                value={selectedStartDate}
                                onChange={(e) =>
                                  setSelectedStartDate(e.target.value)
                                }
                                className="border px-2 py-1 ml-2"
                              />
                            </label>
                            {/* Due Date */}
                            <label className="flex items-center mb-2 text-base">
                              <span className="inline-block w-28 text-left">
                                Due (optional):
                              </span>
                              <input
                                type="date"
                                value={selectedDueDate}
                                onChange={(e) =>
                                  setSelectedDueDate(e.target.value)
                                }
                                className="border px-2 py-1 ml-2"
                              />
                            </label>
                          </>
                        ) : (
                          // For "Read"
                          <label className="block mb-2 text-base">
                            Finished on:
                            <input
                              type="date"
                              value={selectedFinishedDate}
                              onChange={(e) =>
                                setSelectedFinishedDate(e.target.value)
                              }
                              className="border px-2 py-1 ml-2"
                            />
                          </label>
                        )}

                        <div className="flex justify-center gap-2 mt-3">
                          <button
                            className="bg-(--accent)/90 text-(--color-highlight) text-base px-3 py-1 rounded"
                            onClick={() => {
                              if (dateModalStatus === 'Currently Reading') {
                                handleOptionClick(dateModalStatus, {
                                  start: selectedStartDate,
                                  due: selectedDueDate || '',
                                });
                              } else {
                                handleOptionClick(dateModalStatus, {
                                  finished: selectedFinishedDate,
                                });
                              }
                              setDateModalStatus(null);
                            }}
                          >
                            Save
                          </button>

                          <button
                            className="bg-(--bg-bottom) text-base px-3 py-1 rounded"
                            onClick={() => setDateModalStatus(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(bookItem.status === 'Currently Reading' ||
              bookItem.status === 'Read') && (
              <div className="review-section flex flex-col gap-y-4 my-8 p-4 border-t border-b border-(--border-base)">
                <div className="my-rating">
                  <p className="text-base font-semibold mb-1">My Rating</p>
                  <div className="flex items-center gap-1">
                    {renderMyStars(rating)}
                  </div>
                </div>

                <div className="notes">
                  <p className="text-base font-semibold mb-2">Notes</p>
                  <textarea
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Write your thoughts here..."
                    className="w-full min-h-24 p-2 text-sm border rounded bt-(--bg-base) focus:outline-none focus:ring-1 focus:ring-(--accent) focus:placeholder:text-transparent"
                  />
                </div>
              </div>
            )}

            <p className="description mt-8 text-pretty text-sm">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
