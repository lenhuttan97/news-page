function Hero() {
  return (
    <section className="mb-12 lg:mb-16 animate-pageFadeInUp">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div
          className="w-full bg-cover bg-center bg-no-repeat rounded-lg aspect-[4/3] animate-heroSlideIn"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvHnAWS4FAdl_W6SlFtpPQH-6a07_1sCwUyGFEKpb0PBRF-Y2ygRDa1Kjjqthr_nbwwllgkKRt4KQVQhrWJvHTBC1qknOFNQgQmfomd9oVXvKSWDHi2-BrGDW9uUP95FleZhPLZXWCmxWLvm_bY4Pc--D4767dyvLmX_2AZ8yLKZtUy5YFZ6USj57S9fiQ6RAQks4-7tgUnAemgsSy8WIstMFGZjOFDfPLaLZl5LO0dXnXMxlaBgOC0lntnFKB7_JAz9vndNw0L0s")`
          }}
          alt="Featured news image"
        />
        <div className="flex flex-col items-start justify-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
            Tin nổi bật
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-text-light dark:text-text-dark md:text-5xl lg:text-6xl animate-pageFadeInUp stagger-1">
            A New Era of Exploration Begins as Rover Lands on Distant Planet
          </h1>
          <p className="mt-4 text-lg text-text-muted-light dark:text-text-muted-dark animate-pageFadeInUp stagger-2">
            By Eva Rostova • 2 hours ago • Tafu Hub
          </p>
          <p className="mt-6 text-sm text-text-muted-light dark:text-text-muted-dark animate-pageFadeInUp stagger-3">
            The latest developments in space exploration as NASA reveals new findings from the Mars mission, marking a significant milestone in humanity's understanding of the red planet.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <a href="#" className="btn-primary hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-95">
              Đọc toàn bộ
            </a>
            <a href="#" className="btn-secondary hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-95">
              Chia sẻ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
