import { createBrowserRouter, Route } from 'react-router-dom'
import App from './App'
import CategoryPage from './components/CategoryPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/category/:slug',
    element: <CategoryPage />,
  },
])