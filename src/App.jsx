import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import PageLayout from './layout/PageLayout'
import HomePage from './pages/HomePage'
import AutoReloadDialog from './components/AutoReloadDialog'
import { fetchNews } from './store'

// App is now a thin router wrapper: layout + page + home revalidation.
// Page-level state lives in HomePage, not here.
const RELOAD_INTERVAL = 30 * 60 * 1000 // 30 phút

export default function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { loading } = useSelector((state) => state.home)
  const [showReload, setShowReload] = useState(false)

  useEffect(() => {
    if (location.pathname === '/') {
      dispatch(fetchNews())
    }
  }, [dispatch, location.pathname])

  // Tự động hỏi reload sau 30 phút kể từ khi vào trang.
  useEffect(() => {
    const timer = setTimeout(() => setShowReload(true), RELOAD_INTERVAL)
    return () => clearTimeout(timer)
  }, [])

  const handleReload = () => {
    setShowReload(false)
    dispatch(fetchNews())
  }

  return (
    <PageLayout>
      <HomePage />
      <AutoReloadDialog
        show={showReload && location.pathname === '/' && !loading}
        onConfirm={handleReload}
        onDismiss={() => setShowReload(false)}
      />
    </PageLayout>
  )
}
