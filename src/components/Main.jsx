import Browse from './Browse';
import MyBooks from './MyBooks';

const Main = ({
  bookData,
  searchBook,
  loading,
  showBrowse,
  showWantToRead,
  setShowWantToRead,
  showRead,
  setShowRead,
}) => {
  return (
    <main className="w-full flex justify-start items-center px-4 sm:px-8 mt-0 lg:mt-20">
      {/* <Card bookData={bookData} /> */}
      {showBrowse ? (
        <Browse bookData={bookData} searchBook={searchBook} loading={loading} />
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
