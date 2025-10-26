const Footer = () => {
  return (
    <footer className="w-full flex flex-col items-center mt-4 mb-8">
      <small className="text-(--color-muted) mb-1">Created by</small>
      <a
        className="flex items-center gap-1 p-1 pr-2 bg-(--bg-top) text-(--color-top) rounded-4xl border border-transparent shadow-md hover:border-(--border-base) hover:shadow-[0_0_0_0_var(--color-muted)] hover:scale-[0.98] hover:opacity-80 transition duration-200"
        alt="pfp"
        href="https://github.com/KellyBytes"
        target="_blank"
      >
        <img
          src="https://avatars.githubusercontent.com/u/203674919?u=436e3115e15e3b792898a3f09017270e125c4794&v=4"
          className="max-w-[30px] aspect-square rounded-full"
        />
        <p>@KellyBytes</p>
        <i className="fa-brands fa-github"></i>
      </a>
    </footer>
  );
};

export default Footer;
