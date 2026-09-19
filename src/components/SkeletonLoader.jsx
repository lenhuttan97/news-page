import React from 'react'

export default function SkeletonLoader() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="h-20 border-b border-border-light dark:border-border-dark" />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Skeleton */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 mb-12 lg:mb-16">
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-lg aspect-video"></div>
          <div className="flex flex-col space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
          </div>
        </div>
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-9 space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-6">
                <div className="h-32 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg flex-shrink-0"></div>
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
