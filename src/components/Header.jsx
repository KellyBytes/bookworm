import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

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
  const { darkMode, toggleDarkMode } = useTheme();

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
    <header className="w-full flex justify-center">
      <div className="full-width-wrapper w-full fixed top-0 left-0 z-50 flex justify-center bg-(--bg-base) border-b border-(--border-base)/50 shadow-sm lg:border-none lg:shadow-none">
        <div className="w-full max-w-[clamp(19rem,1.353rem+94.118vw,39rem)] sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl flex justify-between items-stretch gap-x-2 md:gap-x-4 px-4 md:px-8 ">
          <div className="flex flex-col py-4">
            <h1 className="font-bio text-large text-gradient">Bookworm</h1>
          </div>
          <nav className="hidden lg:flex">
            <button
              className={`browse px-6 hover:bg-(--secondary)/70 hover:text-(--color-highlight) duration-300 ${
                !showBrowse
                  ? 'text-(--secondary) font-semibold underline underline-offset-4 decoration-2'
                  : 'text-(--text-top)'
              }`}
              onClick={handleClickMyBooks}
            >
              My Books
            </button>
            <button
              className={`browse px-6 hover:bg-(--secondary)/70 hover:text-(--color-highlight) duration-300 ${
                showBrowse
                  ? 'text-(--secondary) font-semibold underline underline-offset-4 decoration-2'
                  : 'text-(--text-top)'
              }`}
              onClick={handleClickBrowse}
            >
              Browse
            </button>
          </nav>
          <div className="search flex items-center relative">
            <input
              type="text"
              className="w-[clamp(7.5rem,-10rem+87vw,25rem)] lg:w-xs h-10 self-center rounded-full! placeholder:text-(--color-muted) focus:placeholder:text-transparent"
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
              aria-label="search books"
            >
              <i className="bx bx-search text-xl lg:text-2xl text-stone-500 absolute right-12 top-5 md:top-6 lg:right-19 cursor-pointer"></i>
            </button>

            {/* Toggle Dark Mode for desktop */}
            <button
              onClick={toggleDarkMode}
              aria-label={
                darkMode ? 'Switch to light mode' : 'Switch to dark mode'
              }
              className={`hidden lg:flex items-center justify-between px-2 ml-2 relative w-15 h-8 rounded-full text-(--color-base)
            bg-(--bg-bottom) cursor-pointer`}
            >
              <i className="bx bx-sun text-lg" />
              <i className="bx bx-moon text-lg" />
              <span
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md duration-300
              ${darkMode ? 'translate-x-7' : 'translate-x-0'}`}
              />
            </button>
            {/* Toggle Dark Mode for mobile */}
            <button
              onClick={toggleDarkMode}
              aria-label={
                darkMode ? 'Switch to light mode' : 'Switch to dark mode'
              }
              className={`lg:hidden items-center justify-between p-1 ml-2 w-8 h-8 rounded-full text-(--color-base) bg-(--bg-bottom) border border-(--border-base) cursor-pointer`}
            >
              {darkMode ? (
                <i className="bx bx-sun text-lg translate-y-0.5" />
              ) : (
                <i className="bx bx-moon text-lg translate-y-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <nav className="max-w-[clamp(19rem,1.353rem+94.118vw,39rem)] sm:max-w-3xl h-10 flex flex-row justify-center items-center gap-x-10 mt-20 lg:hidden">
        <button
          className={`browse px-4 py-3 hover:bg-(--secondary)/70 hover:text-(--color-highlight) duration-300 ${
            !showBrowse
              ? 'text-(--secondary) font-semibold underline underline-offset-4 decoration-2'
              : 'text-(--text-top)'
          }`}
          onClick={handleClickMyBooks}
        >
          My Books
        </button>
        <button
          className={`browse px-4 py-3 hover:bg-(--secondary)/70 hover:text-(--color-highlight) duration-300 ${
            showBrowse
              ? 'text-(--secondary) font-semibold underline underline-offset-4 decoration-2'
              : 'text-(--text-top)'
          }`}
          onClick={handleClickBrowse}
        >
          Browse
        </button>
      </nav>
    </header>
  );
};

export default Header;
