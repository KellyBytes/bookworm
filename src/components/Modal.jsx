import { useState, useEffect, useRef } from 'react';

const Modal = ({ show, bookItem, onClose }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [message, setMessage] = useState('');
  const [dateModalStatus, setDateModalStatus] = useState(null); // 'Read' or 'Currently Reading'
  const today = new Date().toLocaleDateString('en-CA');
  const [selectedDate, setSelectedDate] = useState(today);
  const menuRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [show]);

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

  const handleOptionClick = (status, customDate) => {
    const storedBooks = JSON.parse(localStorage.getItem('myBooks') || '[]');
    const date = customDate || today;

    if (status === 'Remove') {
      const updated = storedBooks.filter((b) => b.id !== bookItem.id);
      localStorage.setItem('myBooks', JSON.stringify(updated));
      setMessage('Book Removed!');
    } else {
      const newBook = {
        id: bookItem.id,
        status,
        date: status === 'Want to Read' ? '' : date,
        item,
      };

      const updated = storedBooks
        .filter((b) => b.id !== bookItem.id)
        .concat(newBook);

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
          className="overlay-inner bg-(--bg-top) w-xl h-11/12 p-10 rounded-xl text-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="close absolute top-4 right-4 outline-none border-none text-lg bg-transparent"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>

          <div className="inner-scroll h-full overflow-y-auto no-scrollbar">
            <div className="inner-container w-lg flex justify-center gap-x-6">
              <img
                src={thumbnail}
                alt="thumbnail"
                className="w-40 h-56 object-cover rounded"
              />
              <div className="info">
                <h1 className="font-bitter tracking-wide text-(--color-top)">
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
                <div className="buttons flex justify-center mt-4 gap-x-4 relative">
                  <a href={item.previewLink} target="_blank" rel="noreferrer">
                    <button
                      className="w-24 rounded-sm mt-4 py-1.5 px-2 bg-(--accent) text-blue-50 text-sm font-semibold hover:scale-[0.98] hover:opacity-90 active:translate-y-0.5 duration-200"
                      onClick={onClose}
                    >
                      More
                    </button>
                  </a>

                  <div className="relative" ref={menuRef}>
                    <button
                      className="w-48 rounded-sm mt-4 py-1.5 px-2 bg-(--accent-muted) text-(--color-base) text-sm font-semibold hover:scale-[0.98] hover:opacity-90 active:translate-y-0.5 duration-200"
                      onClick={() => setShowMenu((prev) => !prev)}
                    >
                      Add to My Books
                    </button>

                    {showMenu && (
                      <div className="absolute top-full left-0 mt-2 w-full bg-white border border-stone-300 rounded-md shadow-md z-50">
                        {[
                          'Want to Read',
                          'Currently Reading',
                          'Read',
                          'Remove',
                        ].map((option) => (
                          <button
                            key={option}
                            className="block w-full text-left px-4 py-2 hover:bg-stone-100 text-sm"
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
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
                      <div className="bg-(--bg-top) p-4 rounded-md shadow-lg text-center">
                        <p className="mb-2 font-semibold">Select Date</p>
                        <input
                          type="date"
                          value={selectedDate}
                          className="border px-2-py-1"
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />

                        <div className="flex justify-center gap-2 mt-3">
                          <button
                            className="bg-(--accent)/90 text-(--color-highlight) px-3 py-1 rounded"
                            onClick={() => {
                              handleOptionClick(dateModalStatus, selectedDate);
                              setDateModalStatus(null);
                            }}
                          >
                            Save
                          </button>

                          <button
                            className="bg-(--bg-bottom) px-3 py-1 rounded"
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
