import { useNavigate } from "react-router-dom";
import backgroundImage from '../assets/backgroundImage.jpg'

export const LandingPage2: React.FC = () => {
  const navigate = useNavigate();

  function handleSignIn() {
    navigate('/login');
  }

  return (
    <div
      className="
        w-full
        h-full
        bg-center
        bg-cover
        flex
        flex-col
        items-center
        justify-center
        relative
        overflow-auto
        mt-[-80px]
        flex-1
        pb-0
      "
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="text-white text-center">
        <p className="text-bold text-2xl">Welcome to</p>
        <h1 className="text-bold text-7xl mb-10 font-bebas">SAVE !T</h1>
        <button
          className="
            relative
            custom-glow-btn
            px-12
            py-4
            text-[15px]
            font-bold
            rounded-xl
            border-[0.25em]
            transition-all
            duration-300
            cursor-pointer
            mb-10
          "
          onClick={handleSignIn}
        >
          Log In
        </button>
        
      </div>
      <div className="text-white text-center w-full max-w-lg mt-20">
          Save !t is a File Management platform that allows you to save and store your files in a secure and easy way.
        </div>
    </div>
  );
};
