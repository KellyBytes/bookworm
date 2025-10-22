const Footer = () => {
  return (
    <footer className="flex flex-col gap-1 items-center text-(--text-muted)">
      <small>Created by</small>
      <a
        className="flex items-center gap-1 p-1 pr-2   bg-(--bg-top) text-(--text-muted) rounded-4xl border border-transparent shadow-(--shadow) hover:border-(--border-muted) hover:shadow-[0_0_0_0_var(--border-muted)] hover:translate-x-[2px] translate-y-[2px] transition-transform duration-200"
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
