import { useState, useEffect, useRef } from 'react';

const Modal = ({ show, bookItem, onClose }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [message, setMessage] = useState('');
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
  let thumbnail = item.imageLinks?.smallThumbnail;

  const handleOptionClick = (status) => {
    const storedBooks = JSON.parse(localStorage.getItem('myBooks') || '[]');

    if (status === 'Remove') {
      const updated = storedBooks.filter((b) => b.id !== bookItem.id);
      localStorage.setItem('myBooks', JSON.stringify(updated));
      setMessage('Book Removed!');
    } else {
      const newBook = { id: bookItem.id, status, item };
      const existing = storedBooks.find((b) => b.id === bookItem.id);

      let updated;
      if (existing) {
        updated = storedBooks.map((b) => (b.id === bookItem.id ? newBook : b));
      } else {
        updated = [newBook, ...storedBooks];
      }
      localStorage.setItem('myBooks', JSON.stringify(updated));
      setMessage('Status Changed!');
    }

    setShowMenu(false);
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <>
      <div
        className="overlay min-h-100vh w-full fixed inset-0 z-[9999] bg-linear-to-br from-[rgba(0,0,0,0.5)] to-[rgba(0,0,0,0.8)] flex justify-center items-center"
        onClick={onClose}
      >
        <div
          className="overlay-inner bg-stone-200 w-xl h-11/12 p-6 rounded-xl text-xl overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none' [scrollbar-width:'none'] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="close absolute top-4 right-4 outline-none border-none text-lg bg-transparent"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
          <div className="inner-container w-lg flex justify-center mt-8 gap-x-6">
            <img
              src={thumbnail}
              alt="thumbnail"
              className="w-36 h-52 object-cover"
            />
            <div className="info">
              <h1 className="font-bitter tracking-wide">{item.title}</h1>
              <h3 className="mt-3 font-serrat font-semibold text-(--text-muted)">
                {item.authors.map((author, index) => (
                  <span key={`author-${index}`}>
                    {author}
                    {index < item.authors.length - 1 && ', '}
                  </span>
                ))}
              </h3>
              <h4 className="font-serrat text-sm text-stone-700">
                {item.publisher} <small>{item.publishedDate}</small>
              </h4>
              <div className="buttons flex justify-center mt-4 gap-x-4 relative">
                <a href={item.previewLink} target="_blank" rel="noreferrer">
                  <button
                    className="w-24 rounded-sm mt-4 py-1.5 px-2 bg-blue-600 text-blue-50 text-sm font-semibold hover:scale-98 hover:opacity-90 active:translate-y-0.5 duration-200"
                    onClick={onClose}
                  >
                    More
                  </button>
                </a>

                <div className="relative" ref={menuRef}>
                  <button
                    className="w-48 rounded-sm mt-4 py-1.5 px-2 bg-blue-200 text-(--text-base) text-sm font-semibold hover:scale-98 hover:opacity-90 active:translate-y-0.5 duration-200"
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
                          onClick={() => handleOptionClick(option)}
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
              </div>
            </div>
          </div>

          <p className="description mt-8 text-pretty text-sm">
            {item.description}
          </p>
        </div>
      </div>
    </>
  );
};

export default Modal;
