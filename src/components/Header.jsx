import { useState } from 'react';

const Header = ({
  showBrowse,
  setShowBrowse,
  setBookData,
  searchBook,
  setShowWantToRead,
  setShowRead,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [search, setSearch] = useState('');

  const handleClickMyBooks = () => {
    setShowBrowse(false);
    setShowWantToRead(false);
    setShowRead(false);
  };

  const handleClickBrowse = () => {
    setShowBrowse(true);
    setBookData([]);
  };

  const handleChange = (e) => {
    setInputVal(e.target.value);
    setSearch(inputVal);
  };

  return (
    <header className="w-full lg:max-w-4xl xl:max-w-5xl flex justify-between items-stretch gap-x-4">
      <div className="flex flex-col py-4 relative">
        <h1 className="font-bio text-large text-gradient">Bookworm</h1>
      </div>
      <nav className="flex">
        <button
          className={`browse px-6 hover:bg-(--secondary)/70 hover:text-(--color-highlight) transition duration-300 ${
            !showBrowse
              ? 'text-(--secondary) font-semibold underline underline-offset-4 decoration-2'
              : 'text-(--text-top)'
          }`}
          onClick={handleClickMyBooks}
        >
          My Books
        </button>
        <button
          className={`browse px-6 hover:bg-(--secondary)/70 hover:text-(--color-highlight) transition duration-300 ${
            showBrowse
              ? 'text-(--secondary) font-semibold underline underline-offset-4 decoration-2'
              : 'text-(--text-top)'
          }`}
          onClick={handleClickBrowse}
        >
          Browse
        </button>
      </nav>
      <div className="search flex relative">
        <input
          type="text"
          className="w-sm h-10 self-center placeholder:text-(--color-muted) focus:placeholder:text-transparent"
          placeholder="Search books"
          value={inputVal}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchBook(search);
              setInputVal('');
            }
          }}
        />
        <button
          onClick={() => {
            searchBook(search);
            setInputVal('');
          }}
        >
          <i className="bx bx-search text-2xl text-stone-500 absolute right-2 top-6 cursor-pointer"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
