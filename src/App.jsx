import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import PageLayout from './layout/PageLayout'
import HomePage from './pages/HomePage'
import { fetchNews } from './store'

// App is now a thin router wrapper: layout + page + home revalidation.
// Page-level state lives in HomePage, not here.
export default function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { loading } = useSelector((state) => state.home)

  useEffect(() => {
    if (location.pathname === '/') {
      dispatch(fetchNews())
    }
  }, [dispatch, location.pathname])

  return (
    <PageLayout>
      <HomePage />
    </PageLayout>
  )
}