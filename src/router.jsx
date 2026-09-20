import { createBrowserRouter } from 'react-router-dom'
import PageLayout from './layout/PageLayout'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ErrorPage from './components/ErrorPage'
import ErrorBoundary from './components/ErrorBoundary'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <PageLayout>
          <HomePage />
        </PageLayout>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/category/:slug',
    element: (
      <ErrorBoundary>
        <PageLayout>
          <CategoryPage />
        </PageLayout>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
    errorElement: <ErrorPage />,
  },
])