import React from 'react'

function ArticleDetailPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="flex h-full grow flex-col">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <article className="prose prose-lg max-w-none">
            <header className="mb-16 text-center">
              <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-text-light dark:text-text-dark mb-8">
                How AI is Revolutionizing the Future of Healthcare in 2024
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-text-muted-light dark:text-text-muted-dark">
                <span>By Dr. Sarah Chen</span>
                <span>•</span>
                <span>March 15, 2024</span>
                <span>•</span>
                <span>Healthcare</span>
                <span>•</span>
                <span>12 min read</span>
              </div>
            </header>
            
            <figure className="mb-12">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvHnAWS4FAdl_W6SlFtpPQH-6a07_1sCwUyGFEKpb0PBRF-Y2ygRDa1Kjjqthr_nbwwllgkKRt4KQVQhrWJvHTBC1qknOFNQgQmfomd9oVXvKSWDHi2-BrGDW9uUP95FleZhPLZXWCmxWLvm_bY4Pc--D4767dyvLmX_2AZ8yLKZtUy5YFZ6USj57S9fiQ6RAQks4-7tgUnAemgsSy8WIstMFGZjOFDfPLaLZl5LO0dXnXMxlaBgOC0lntnFKB7_JAz9vndNw0L0s" 
                alt="AI healthcare technology"
                className="rounded-xl border border-border-light dark:border-border-dark"
              />
              <figcaption className="mt-4 text-xs text-text-muted-light dark:text-text-muted-dark text-center">
                AI-powered diagnostic tools are transforming patient care and medical research
              </figcaption>
            </figure>
            
            <section className="mb-12">
              <p className="mb-6 leading-relaxed">
                Artificial intelligence is no longer a futuristic concept in healthcare—it's here, and it's transforming every aspect of patient care, from diagnosis and treatment to drug discovery and hospital management. As we move through 2024, AI technologies are becoming increasingly sophisticated, offering unprecedented opportunities to improve health outcomes while reducing costs.
              </p>
              
              <p className="mb-6 leading-relaxed">
                One of the most significant impacts of AI in healthcare is in medical imaging analysis. Deep learning algorithms can now detect abnormalities in X-rays, MRIs, and CT scans with accuracy that rivals or even surpasses human radiologists. These systems can process thousands of images in a fraction of the time it would take a human expert, allowing for faster diagnoses and earlier intervention.
              </p>
              
              <blockquote className="border-l-4 border-primary pl-6 italic mb-6">
                <p className="text-lg leading-relaxed">
                  "AI is not replacing doctors—it's empowering them to make better decisions faster, ultimately improving patient care."
                </p>
              </blockquote>
              
              <p className="mb-6 leading-relaxed">
                Another area where AI is making significant strides is in personalized medicine. By analyzing vast amounts of patient data—including genetic information, lifestyle factors, and treatment responses—AI algorithms can help doctors tailor treatments to individual patients with remarkable precision. This approach, known as precision medicine, is particularly valuable in oncology, where treatments can be customized based on the specific genetic profile of a tumor.
              </p>
              
              <h2 className="font-serif text-3xl font-bold tracking-tight text-text-light dark:text-text-dark mb-4 mt-8">
                The Rise of AI-Powered Drug Discovery
              </h2>
              
              <p className="mb-6 leading-relaxed">
                Perhaps one of the most exciting applications of AI in healthcare is in drug discovery. Traditional drug development is a lengthy and expensive process, often taking over a decade and costing billions of dollars to bring a single drug to market. AI is dramatically accelerating this process by predicting how different chemical compounds will interact with biological targets, significantly reducing the time and cost required to identify promising drug candidates.
              </p>
              
              <p className="mb-6 leading-relaxed">
                Companies like DeepMind and Insilico Medicine are already using AI to discover new drug candidates for diseases ranging from cancer to Alzheimer's. In some cases, what would have taken years of laboratory work can now be accomplished in months using AI-powered simulations and predictions.
              </p>
            </section>
            
            <section className="mb-12 border-t border-border-light dark:border-border-dark pt-12">
              <h2 className="font-serif text-2xl font-bold tracking-tight text-text-light dark:text-text-dark mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="card">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 bg-cover bg-center bg-no-repeat rounded-lg"
                         style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvHnAWS4FAdl_W6SlFtpPQH-6a07_1sCwUyGFEKpb0PBRF-Y2ygRDa1Kjjqthr_nbwwllgkKRt4KQVQhrWJvHTBC1qknOFNQgQmfomd9oVXvKSWDHi2-BrGDW9uUP95FleZhPLZXWCmxWLvm_bY4Pc--D4767dyvLmX_2AZ8yLKZtUy5YFZ6USj57S9fiQ6RAQks4-7tgUnAemgsSy8WIstMFGZjOFDfPLaLZl5LO0dXnXMxlaBgOC0lntnFKB7_JAz9vndNw0L0s")` }}></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-light dark:text-text-dark mb-2">The Future of Telemedicine: Virtual Care Beyond the Pandemic</h3>
                      <p className="text-text-muted-light dark:text-text-muted-dark mb-2">By Michael Rodriguez • 2 days ago</p>
                      <a href="#" className="text-accent hover:text-accent/80">Read more →</a>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 bg-cover bg-center bg-no-repeat rounded-lg"
                         style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvHnAWS4FAdl_W6SlFtpPQH-6a07_1sCwUyGFEKpb0PBRF-Y2ygRDa1Kjjqthr_nbwwllgkKRt4KQVQhrWJvHTBC1qknOFNQgQmfomd9oVXvKSWDHi2-BrGDW9uUP95FleZhPLZXWCmxWLvm_bY4Pc--D4767dyvLmX_2AZ8yLKZtUy5YFZ6USj57S9fiQ6RAQks4-7tgUnAemgsSy8WIstMFGZjOFDfPLaLZl5LO0dXnXMxlaBgOC0lntnFKB7_JAz9vndNw0L0s")` }}></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-light dark:text-text-dark mb-2">Wearable Health Tech: Monitoring Your Wellbeing in Real-Time</h3>
                      <p className="text-text-muted-light dark:text-text-muted-dark mb-2">By Amanda Foster • 1 day ago</p>
                      <a href="#" className="text-accent hover:text-accent/80">Read more →</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </article>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default ArticleDetailPage;
