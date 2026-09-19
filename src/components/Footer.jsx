function Footer() {
  return (
    <footer className="border-t border-solid border-border-light dark:border-border-dark py-10 text-center text-text-muted-light dark:text-text-muted-dark">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 transition-colors hover:text-text-light dark:hover:text-text-dark">
            <span className="material-symbols-outlined">f</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 transition-colors hover:text-text-light dark:hover:text-text-dark">
            <span className="material-symbols-outlined">t</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 transition-colors hover:text-text-light dark:hover:text-text-dark">
            <span className="material-symbols-outlined">i</span>
          </div>
          <a href="#" className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark link-underline">About Us</a>
          <a href="#" className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark link-underline">Contact</a>
          <a href="#" className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark link-underline">Privacy Policy</a>
          <a href="#" className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark link-underline">Terms of Service</a>
          <a href="#" className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark link-underline">Careers</a>
        </div>
        <p className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">© 2024 The Chronicle. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
