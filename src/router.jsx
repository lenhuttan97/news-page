import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import CategoryPage from './components/CategoryPage'
import ErrorPage from './components/ErrorPage'
import ErrorBoundary from './components/ErrorBoundary'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/category/:slug',
    element: (
      <ErrorBoundary>
        <CategoryPage />
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
