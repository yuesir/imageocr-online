import { ReactNode } from 'react'

type MDXComponents = {
  [key: string]: React.ComponentType<any>
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }: { children: ReactNode }) => (
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        {children}
      </h1>
    ),
    h2: ({ children }: { children: ReactNode }) => (
      <h2 className="text-3xl font-semibold mb-4 mt-8 text-gray-900 dark:text-white">
        {children}
      </h2>
    ),
    h3: ({ children }: { children: ReactNode }) => (
      <h3 className="text-2xl font-semibold mb-3 mt-6 text-gray-900 dark:text-white">
        {children}
      </h3>
    ),
    h4: ({ children }: { children: ReactNode }) => (
      <h4 className="text-xl font-semibold mb-2 mt-4 text-gray-900 dark:text-white">
        {children}
      </h4>
    ),
    p: ({ children }: { children: ReactNode }) => (
      <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children }: { children: ReactNode }) => (
      <ul className="mb-4 pl-6 list-disc text-gray-700 dark:text-gray-300">
        {children}
      </ul>
    ),
    ol: ({ children }: { children: ReactNode }) => (
      <ol className="mb-4 pl-6 list-decimal text-gray-700 dark:text-gray-300">
        {children}
      </ol>
    ),
    li: ({ children }: { children: ReactNode }) => (
      <li className="mb-1">{children}</li>
    ),
    blockquote: ({ children }: { children: ReactNode }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-gray-50 dark:bg-gray-800 italic text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    ),
    code: ({ children }: { children: ReactNode }) => (
      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-red-600 dark:text-red-400">
        {children}
      </code>
    ),
    pre: ({ children }: { children: ReactNode }) => (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
        {children}
      </pre>
    ),
    a: ({ href, children }: { href?: string; children: ReactNode }) => (
      <a
        href={href}
        className="text-blue-600 dark:text-blue-400 hover:underline"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    img: ({ src, alt }: { src?: string; alt?: string }) => (
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-lg mb-4 mx-auto"
      />
    ),
    table: ({ children }: { children: ReactNode }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
          {children}
        </table>
      </div>
    ),
    th: ({ children }: { children: ReactNode }) => (
      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left">
        {children}
      </th>
    ),
    td: ({ children }: { children: ReactNode }) => (
      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
        {children}
      </td>
    ),
    hr: () => (
      <hr className="my-8 border-gray-300 dark:border-gray-600" />
    ),
    ...components,
  }
}