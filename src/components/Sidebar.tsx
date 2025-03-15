import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full space-y-6">
      <div>
        <h1 className="text-2xl font-bebas">Shortcuts</h1>
        <button
            onClick={() => navigate('/user-data/0')}
            className= "flex items-center text-purple-300 text-xl mt-1 cursor-pointer hover:underline"
          > 
            All Files
        </button>
        <button
            onClick={() => navigate('/user-data/0')}
            className= "flex items-center text-purple-300 text-xl mt-1 cursor-pointer hover:underline"
          > 
            Favorites
        </button>
        <button
            onClick={() => navigate('/user-data/0')}
            className= "flex items-center text-purple-300 text-xl mt-1 cursor-pointer hover:underline"
          > 
            Link somewhere
        </button>
        <button
            onClick={() => navigate('/user-data/0')}
            className= "flex items-center text-purple-300 text-xl mt-1 cursor-pointer hover:underline"
          > 
            Another
        </button>
        <div className="h-30 border-b border-dotted border-purple-400 mb-4"></div>
        <div className="text-purple-300 text-l mt-1">Total number of files: 
          <p className="text-sm mb-1">Number</p>
        </div>

        <div className="text-purple-300 text-l mt-1">Total size used + free space: 
          <p className="text-sm mb-1">Number</p>
        </div>
          
      </div>

      <div className="mt-auto">
        <button
            onClick={() => navigate('/')}
            className="
              relative
              simpleButton
              px-4
              py-2
              rounded-xl
              border-[0.25em]
              transition-all
              duration-300
              cursor-pointer
              mb-10
              "
          > 
            Log Out
        </button>
      </div>
    </div>
  );
};
