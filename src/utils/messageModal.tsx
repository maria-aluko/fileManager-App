interface MessageModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-200">
      <div className="bg-slate-900 p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <p className="mb-4 text-lg">{message}</p>
        <div>
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