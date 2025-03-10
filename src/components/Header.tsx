import { useState } from "react";
import arrow_downward from "../assets/arrow_downward.svg";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-gray-800 text-white shadow-md z-10">
      <div className="max-w-screen-2xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and clickable text for File Manager */}
        <div className="flex items-center">
          <span
            onClick={() => {
              // Navigate to the homepage
              navigate('/');
            }}
            className="text-2xl font-bold cursor-pointer hover:text-gray-400"
          >
            File Manager
          </span>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 bg-gray-700 p-2 cursor-pointer rounded-full hover:bg-gray-600"
          >
            {/* Change the word username to the actual name of the user */}
            <span onClick={toggleDropdown} className="text-m px-2 ml-1">Username</span>
            {/* Add an arrow down icon here */}
            <img src={arrow_downward} alt="arrow" className="w-5 h-5 mr-2" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div onClick={closeDropdown} className="absolute right-0 mt-2 w-48 bg-gray-100 rounded-lg shadow-lg overflow-hidden z-20 group-hover:block">
              <ul className="text-gray-700">
                <li>
                  <button
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      navigate('/');
                    }}
                  >
                    My Files
                  </button>
                </li>
                <li>
                  <button className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-200 cursor-pointer">
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      // Remove access token from local storage
                      localStorage.removeItem('access_token');
                      // Redirect to login page
                      navigate('/'); // Redirect to Login component
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;