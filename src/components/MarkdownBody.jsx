import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Markdown uses the same palette as the dialog; images stay inside its content width.
const markdownComponents = {
  h1: ({ node, ...props }) => <h2 className="mb-3 mt-6 font-serif text-xl font-bold first:mt-0 text-text-light dark:text-text-dark" {...props} />,
  h2: ({ node, ...props }) => <h3 className="mb-3 mt-6 font-serif text-lg font-bold first:mt-0 text-text-light dark:text-text-dark" {...props} />,
  h3: ({ node, ...props }) => <h4 className="mb-2 mt-5 text-base font-semibold first:mt-0 text-text-light dark:text-text-dark" {...props} />,
  h4: ({ node, ...props }) => <h5 className="mb-2 mt-4 text-sm font-semibold first:mt-0 text-text-light dark:text-text-dark" {...props} />,
  h5: ({ node, ...props }) => <h6 className="mb-2 mt-3 text-sm font-medium first:mt-0 text-text-light dark:text-text-dark" {...props} />,
  h6: ({ node, ...props }) => <span className="mb-2 mt-3 text-sm text-text-muted-light dark:text-text-muted-dark" {...props} />,
  p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
  a: ({ node, ...props }) => {
    const href = (node && node.url) || ''
    return (
      <a
        className="break-words text-primary underline underline-offset-2 hover:text-primary/80"
        target={href.startsWith('#') ? '_self' : '_blank'}
        rel="noopener noreferrer"
        {...props}
      />
    )
  },
  img: ({ node, alt, ...props }) => (
    <img className="mx-auto my-4 block h-auto max-w-full rounded-lg" alt={alt || ''} loading="lazy" {...props} />
  ),
  ul: ({ node, ...props }) => <ul className="mb-4 list-disc space-y-1 pl-6" {...props} />,
  ol: ({ node, ...props }) => <ol className="mb-4 list-decimal space-y-1 pl-6" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="mb-4 border-l-4 border-accent/40 pl-4 italic text-text-muted-light dark:text-text-muted-dark" {...props} />
  ),
  pre: ({ node, ...props }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-100 p-4 text-sm dark:bg-white/10 [&_code]:bg-transparent [&_code]:p-0" {...props} />
  ),
  code: ({ node, ...props }) => (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.9em] dark:bg-white/10" {...props} />
  ),
  table: ({ node, ...props }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: ({ node, ...props }) => <th className="border border-border-light px-3 py-2 text-left dark:border-border-dark" {...props} />,
  td: ({ node, ...props }) => <td className="border border-border-light px-3 py-2 dark:border-border-dark" {...props} />,
  hr: ({ node, ...props }) => <hr className="my-6 border-border-light dark:border-border-dark" {...props} />,
}

export default function MarkdownBody({ text }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {text}
    </ReactMarkdown>
  )
}
