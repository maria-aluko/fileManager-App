interface MessageModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-60"></div>

      {/* Modal Content */}
      <div className="relative bg-slate-900 bg-pacity-100 p-6 rounded-lg shadow-lg max-w-sm w-full text-center z-60">
        <p className="mb-4 text-lg">{message}</p>
        <div className="flex justify-center">
          <button 
            onClick={onConfirm}
            className="m-2 simpleButton"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="m-2 simpleButton"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;