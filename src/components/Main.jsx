import Browse from './Browse';
import MyBooks from './MyBooks';

const Main = ({
  bookData,
  searchBook,
  showBrowse,
  showWantToRead,
  setShowWantToRead,
  showRead,
  setShowRead,
}) => {
  return (
    <main className="w-full flex justify-start items-center">
      {/* <Card bookData={bookData} /> */}
      {showBrowse ? (
        <Browse bookData={bookData} searchBook={searchBook} />
      ) : (
        <MyBooks
          showWantToRead={showWantToRead}
          setShowWantToRead={setShowWantToRead}
          showRead={showRead}
          setShowRead={setShowRead}
        />
      )}
    </main>
  );
};

export default Main;
