type ModalProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal = ({ open, onClose, children }: ModalProps) => {
    if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  )
}

export default Modal