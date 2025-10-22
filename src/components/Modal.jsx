import React from 'react';

const Modal = ({ show, bookItem, onClose }) => {
  if (!show) return;

  let item = bookItem.volumeInfo;
  let thumbnail = item.imageLinks?.smallThumbnail;

  return (
    <>
      <div className="overlay min-h-100vh w-full fixed left-0 top-0 bottom-0 right-0 bg-linear-to-br from-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.3)] flex justify-center items-center">
        <div className="overlay-inner bg-stone-200 w-xl h-11/12 p-6 rounded-xl text-xl overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none' [scrollbar-width:'none'] relative">
          <button
            className="close absolute top-4 right-4 outline-none border-none text-lg bg-transparent"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
          <div className="inner-container mt-8 flex justify-between">
            <img
              src={thumbnail}
              alt="thumbnail"
              className="mr-6 w-36 h-52 object-cover"
            />
            <div className="info">
              <h1 className="font-bitter tracking-wide">{item.title}</h1>
              <h3 className="mt-3 font-comfortaa font-light text-stone-600">
                {item.authors}
              </h3>
              <h4 className="font-comfortaa text-sm text-stone-700">
                {item.publisher} <small>{item.publishedDate}</small>
              </h4>
              <br />
              <a href={item.previewLink} target="_blank">
                <button
                  className="w-24 rounded-sm py-1.5 px-2 bg-amber-900 text-amber-50 font-semibold hover:scale-98 hover:opacity-90 active:translate-y-0.5 duration-200"
                  onClick={onClose}
                >
                  More
                </button>
              </a>
            </div>
          </div>
          <h4 className="description mt-8 text-pretty text-sm">
            {item.description}
          </h4>
        </div>
      </div>
    </>
  );
};

export default Modal;
