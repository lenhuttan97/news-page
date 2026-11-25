import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
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
    children: [
      { index: true, element: <HomePage />, errorElement: <ErrorPage /> },
      { path: 'category/:slug', element: <CategoryPage />, errorElement: <ErrorPage /> },
    ],
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
    errorElement: <ErrorPage />,
  },
])
