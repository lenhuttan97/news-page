function LatestNewsSidebar() {
  const latestNews = [
    { title: 'Global markets in flux after central bank announcement.', time: '15m ago', source: 'The Chronicle' },
    { title: 'Breakthrough in fusion energy research confirmed by scientists.', time: '15m ago', source: 'The Chronicle' },
    { title: 'Historic peace accord signed between neighboring nations.', time: '15m ago', source: 'The Chronicle' },
    { title: 'New study reveals surprising link between gut health and mental clarity.', time: '15m ago', source: 'The Chronicle' },
    { title: 'Tech giant unveils next-generation AI model.', time: '15m ago', source: 'The Chronicle' },
  ];

  return (
    <div className="lg:col-span-2">
      <h2 className="mb-4 border-b border-border-light dark:border-border-dark pb-2 text-sm font-semibold uppercase tracking-wider text-text-light dark:text-text-dark">
        Latest News
      </h2>
      <div className="flex flex-col space-y-4">
        {latestNews.map((item, index) => (
          <a key={index} href="#" className="group">
            <p className="text-sm font-medium text-text-light dark:text-text-dark group-hover:text-accent transition-colors">
              {item.title}
            </p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
              {item.time} • {item.source}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default LatestNewsSidebar;
