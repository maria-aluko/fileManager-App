interface MessageModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <p className="mb-4 text-lg">{message}</p>
        <div>
          <button 
            onClick={onConfirm}
            className="m-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="m-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;