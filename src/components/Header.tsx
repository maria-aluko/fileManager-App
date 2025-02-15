import { useState } from "react";
import arrow_downward from "../assets/arrow_downward.svg";

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  }

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  }

  return (
    <header className="bg-gray-800 text-white shadow-md z-10">
      <div className="max-w-screen-2xl mx-auto  px-4 py-4 flex justify-between items-center">
        {/* Add a logo here and also make the name and the logo take you to the main page*/}
        <div className="flex items-center">
          <span className="text-2xl font-bold cursor-pointer hover:text-gray-400">File Manager</span>
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
                  <button className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-200 cursor-pointer">
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      // Handle logout here
                      localStorage.removeItem('access_token');
                      // window.location.href = '/login';
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