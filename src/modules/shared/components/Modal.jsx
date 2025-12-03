function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-xl leading-none text-neutral-500 hover:text-neutral-700"
            >
              x
            </button>
          </div>
  
          {children}
        </div>
      </div>
    );
  }
  
  export default Modal;