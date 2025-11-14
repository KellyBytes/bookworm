import { useState, useEffect } from 'react';
import noImg from '../assets/images/no-img.png';

const BookCard = ({
  book,
  index,
  itemRefs,
  setBookItem,
  setShow,
  setShowProgressModal,
  setSelectedBookId,
  finishedPages,
  setFinishedPages,
  setMyBooks,
  pagesToReadToday,
  remainingDays,
  totalDays,
  showProgressModal,
  bookItem,
  handleSave,
  manualPageCount,
  setManualPageCount,
  onUpdateDueDate,
}) => {
  const [mobilePage, setMobilePage] = useState(0); // 0: progress bar, 1: days circle
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isEditingDue, setIsEditingDue] = useState(false);
  const [newDueDate, setNewDueDate] = useState(book?.date?.due);

  const handleDateChange = (e) => {
    const updated = e.target.value;
    setNewDueDate(updated);
    onUpdateDueDate(book.id, updated);
    setIsEditingDue(false);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-72 flex flex-col sm:flex-row gap-2 p-4 bg-(--bg-base) rounded shadow-md relative">
      {/* Left: image, title, progress bar */}
      <div className="flex flex-col align-items">
        {(!isMobile || mobilePage === 0) && (
          <>
            <div
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
                src={book.item?.imageLinks?.thumbnail || noImg}
                alt={book.item.title}
                className="w-full h-40 object-cover rounded border border-(--border-base)"
              />
              <p className="w-full h-6 font-merriweather font-semibold text-xs sm:text-sm text-center whitespace-nowrap text-ellipsis overflow-hidden leading-snug px-1 mt-2">
                {book.item.title}
              </p>
            </div>

            {/* Progress bar section */}
            <div
              className="progress-percentage flex flex-col items-center mt-2 hover:opacity-80 hover:scale-[0.98] cursor-pointer group"
              onClick={() => {
                setSelectedBookId(book.id);
                setBookItem(book);
                // setFinishedPages(book.finished || 0)
                // setManualPageCount(book.total || '')
                setShowProgressModal(true);
              }}
            >
              {/* Progress bar */}
              <div className="w-full h-2 bg-(--bg-muted) rounded-full overflow-hidden">
                <div
                  className="h-full bg-(--accent) group-hover:bg-(--secondary) rounded-full duration-200"
                  style={{
                    width: `${
                      (book.finished /
                        (book.total || book.item.pageCount || 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="text-center">
                <small>
                  <i className="bx bx-book-open align-middle mr-1 text-(--accent) group-hover:text-(--secondary) duration-200"></i>
                  Page {book.finished} of{' '}
                  {book.total || book.item.pageCount || '?'}
                </small>
              </div>
            </div>
          </>
        )}
      </div>

      {showProgressModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-(--bg-top) rounded-lg w-64 flex flex-col items-center p-4 shadow-md">
            <h3 className="font-semibold mb-4">Update Progress</h3>

            {(!bookItem.item.pageCount || bookItem.item.pageCount === 0) &&
              !bookItem.total && (
                <label className="w-full text-center text-nowrap text-base mb-4">
                  Total pages
                  <input
                    type="number"
                    min="1"
                    value={manualPageCount || ''}
                    onChange={(e) => setManualPageCount(Number(e.target.value))}
                    className="w-28 border border-(--border-base) rounded p-2 ml-2 text-left placeholder:text-(--color-muted) focus:placeholder:text-transparent"
                    placeholder="Total No."
                  />
                </label>
              )}

            <label className="w-full inline-block text-center text-base">
              Page
              <input
                type="number"
                min="0"
                max={
                  bookItem.item.pageCount && bookItem.item.pageCount > 0
                    ? bookItem.item.pageCount
                    : bookItem.total || 0
                }
                value={finishedPages}
                onChange={(e) => setFinishedPages(e.target.value)}
                className="w-20 border border-(--border-base) rounded p-2 mx-2 mb-4 text-left placeholder:text-(--color-muted) focus:placeholder:text-transparent"
                placeholder={bookItem.finished || 'No.'}
              />
              of{' '}
              {bookItem.item.pageCount && bookItem.item.pageCount > 0
                ? bookItem.item.pageCount
                : bookItem.total || '?'}
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

      {book?.date?.due && (!isMobile || mobilePage === 1) && (
        <div className="progress w-32 flex flex-col justify-center items-center gap-y-4">
          <div className="pages-to-read w-24 flex flex-col items-center px-4">
            <small className="text-center font-semibold">
              <i className="bx bx-target align-middle mr-0.5 text-(--accent)"></i>
              Today
            </small>
            <h1 className="font-semibold mt-2">
              {pagesToReadToday(
                book.finished || 0,
                book.total || book.item.pageCount,
                remainingDays(book?.date?.due)
              )}
            </h1>
            <small className="text-center mb-2">pages</small>
          </div>

          <div className="progress-days flex flex-col">
            <div className="days-circle relative w-20 h-20">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                {(() => {
                  const total = totalDays(book?.date?.start, book?.date?.due);
                  const remaining = remainingDays(book?.date?.due);
                  const anglePerSegment = 360 / total;
                  const gap = 15; // degrees for divisions
                  const radius = 15.9155;
                  // Starting from top, clockwise
                  const polarToCartesian = (cx, cy, r, angle) => {
                    const rad = (angle - 0) * (Math.PI / 180);
                    return {
                      x: cx + r * Math.cos(rad),
                      y: cy + r * Math.sin(rad),
                    };
                  };
                  const describeArc = (cx, cy, r, startAngle, endAngle) => {
                    const start = polarToCartesian(cx, cy, r, startAngle);
                    const end = polarToCartesian(cx, cy, r, endAngle);
                    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
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
                  return Array.from({ length: total }).map((_, i) => {
                    // Starting from top, clockwise
                    const startAngle = 270 + i * anglePerSegment + gap / 2;
                    const endAngle = 270 + (i + 1) * anglePerSegment - gap / 2;
                    const isRemaining = i < remaining; // green for remaining
                    return (
                      <path
                        key={i}
                        d={describeArc(18, 18, radius, startAngle, endAngle)}
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
                  });
                })()}
              </svg>
              {/* Center text */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
                onClick={() => setIsEditingDue(true)}
              >
                {isEditingDue ? (
                  <label className="bg-(--bg-top) rounded border border-(--border-base) p-4 text-center z-50">
                    Update Due
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={handleDateChange}
                      onBlur={() => setIsEditingDue(false)}
                      autoFocus
                      className="text-sm border border-(--border-base) rounded mt-1 px-1 text-center"
                    />
                  </label>
                ) : (
                  <>
                    <span
                      className={`text-lg font-semibold leading-4 ${
                        remainingDays(book?.date?.due) <= 0 && 'text-rose-600'
                      }`}
                    >
                      {remainingDays(book?.date?.due)}
                    </span>
                    <span
                      className={`text-[0.7rem] text-(--color-muted) ${
                        remainingDays(book?.date?.due) <= 0 && 'text-rose-600'
                      }`}
                    >
                      days left
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="text-center leading-4 mt-2">
              <small className="text-(--color-muted)">Started on </small>
              <br />
              <small>{book?.date?.start}</small>
            </div>
          </div>
        </div>
      )}

      {/* Only mobile: Dot navigation */}
      {isMobile && book?.date?.due && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex justify-center mt-2">
          {[0, 1].map((page) => (
            <button
              key={page}
              className={`relative w-20 px-6 py-1 rounded-b-xl text-sm transition-all duration-200
                ${
                  mobilePage === page
                    ? 'text-(--accent) shadow-lg'
                    : 'bg-(--bg-muted)/50 text-(--color-base) opacity-70'
                }`}
              onClick={() => setMobilePage(page)}
            >
              {page === 0 ? (
                <i className="bx bx-info-circle text-base" />
              ) : (
                <i className="bx bx-calendar-detail text-base" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookCard;
