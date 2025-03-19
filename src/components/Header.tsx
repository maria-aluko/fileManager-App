import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  username: string | null;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    if (username) {
      setIsDropdownOpen((prevState) => !prevState);
    }
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-gray-950 text-white shadow-md z-20 border-b border-dotted border-purple-400">
      <div className="max-w-screen-2xl mx-auto px-4 py-4 flex justify-between items-center">
        <button onClick={() => navigate("/user-data/0")} className="simpleButton">
          SAVE !T
        </button>

        <p className="font-bebas text-3xl">SAVE !T</p>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button onClick={toggleDropdown} className="simpleButton">
            <span className="text-m px-2 ml-1">
              {username ? username : "Log In"}
            </span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              onClick={closeDropdown}
              className="bg-grey-600 absolute right-0 mt-2 w-48 bg-gray-100 rounded-lg shadow-lg overflow-hidden z-20 group-hover:block"
            >
              <ul className="text-purple-700">
                <li>
                  <button
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-grey-200 cursor-pointer"
                    onClick={() => {
                      navigate("/user-data/0");
                      window.location.reload();
                    }}
                  >
                    My Files
                  </button>
                </li>
                <li>
                  <button
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      localStorage.removeItem("access_token");
                      localStorage.removeItem("username");
                      navigate("/login"); // Redirect to Login component
                      window.location.reload();
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
