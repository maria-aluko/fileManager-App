import { useState } from "react";
// import arrow_downward from "../assets/arrow_downward.svg";
import { useNavigate } from "react-router-dom";
//import logo from "../images/Frame 2.svg";

const logo = "/Frame 2.svg";

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
    <header className="bg-gray-950 text-white shadow-md z-20 border-b border-dotted border-purple-400">
      <div className="max-w-screen-2xl mx-auto px-4 py-4 flex justify-between items-center">
        <button onClick={() => navigate("/")} className="simpleButton">
          SAVE !T
        </button>

        <p className="font-bebas text-3xl">SAVE !T</p>
        {/* <div className="flex items-center">
          <img src={logo} alt="logo" />
        </div> */}

        {/* User Profile Dropdown */}
        <div className="relative">
          <button onClick={toggleDropdown} className="simpleButton">
            {/* Change the word username to the actual name of the user */}
            <span onClick={toggleDropdown} className="text-m px-2 ml-1">
              Username
            </span>

            {/* <img src={arrow_downward} alt="arrow" className="w-5 h-5 mr-2" /> */}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              onClick={closeDropdown}
              className="absolute right-0 mt-2 w-48 bg-gray-100 rounded-lg shadow-lg overflow-hidden z-20 group-hover:block"
            >
              <ul className="text-gray-700">
                <li>
                  <button
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      navigate("/user-data/0");
                      window.location.reload();
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
                      localStorage.removeItem("access_token");
                      // Redirect to login page
                      navigate("/login"); // Redirect to Login component
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
