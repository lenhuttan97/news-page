function FeaturedArticles({ articles }) {
  return (
    <div className="lg:col-span-7 border-l border-r border-border-light dark:border-border-dark px-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {articles.map((article, index) => (
          <a key={index} href="#" className="group flex flex-col gap-3">
            <div
              className="w-full bg-cover bg-center bg-no-repeat aspect-video rounded-lg"
              style={{ backgroundImage: `url("${article.image}")` }}
              alt={article.title}
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                {article.category}
              </p>
              <p className="mt-1 text-lg font-semibold leading-tight text-text-light dark:text-text-dark group-hover:text-accent transition-colors">
                {article.title}
              </p>
              <p className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                By {article.author} • {article.time} ago • The Chronicle
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default FeaturedArticles;
