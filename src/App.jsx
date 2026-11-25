import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation } from 'react-router-dom'
import PageLayout from './layout/PageLayout'
import AutoReloadDialog from './components/AutoReloadDialog'
import { fetchNews } from './store'

// App is the shared route layout, so the reload prompt stays mounted while
// navigating between the home and category pages.
const RELOAD_INTERVAL = 30 * 60 * 1000 // 30 phút

export default function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { loading } = useSelector((state) => state.home)
  const [showReload, setShowReload] = useState(false)

  // Tự động hỏi reload sau 30 phút kể từ khi vào trang.
  useEffect(() => {
    const timer = setTimeout(() => setShowReload(true), RELOAD_INTERVAL)
    return () => clearTimeout(timer)
  }, [])

  const handleReload = () => {
    setShowReload(false)
    dispatch(fetchNews({ offset: 0, limit: 50 }))
  }

  return (
    <PageLayout>
      <Outlet />
      <AutoReloadDialog
        show={showReload && location.pathname === '/' && !loading}
        onConfirm={handleReload}
        onDismiss={() => setShowReload(false)}
      />
    </PageLayout>
  )
}
