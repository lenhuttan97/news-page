import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import CategoryPage from './components/CategoryPage'
import ErrorPage from './components/ErrorPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/category/:slug',
    element: <CategoryPage />,
    errorElement: <ErrorPage />,
  },
])
