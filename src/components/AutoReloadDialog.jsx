import ReactDOM from 'react-dom'

// Dialog hỏi xác nhận trước khi tự động reload dữ liệu sau 30 phút.
// Chỉ reload khi người dùng nhấn "Đồng ý".
export default function AutoReloadDialog({ show, onConfirm, onDismiss }) {
  if (!show) return null

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Cập nhật tin mới"
    >
      <div
        className="relative w-full max-w-md rounded-xl shadow-2xl bg-background-light dark:bg-background-dark p-6 animate-modalScaleIn"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="mb-2 text-lg font-bold text-text-light dark:text-text-dark">
          Cập nhật tin mới
        </h3>
        <p className="mb-6 text-sm text-text-muted-light dark:text-text-muted-dark">
          Bạn đã mở trang trong 30 phút. Tải lại dữ liệu bài mới nhất không?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onDismiss}
            className="rounded-lg px-4 py-2 font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            Để sau
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg px-4 py-2 font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
