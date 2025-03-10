import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import arrow_back from "../assets/arrow_back.svg";

interface RegisterResponse {
  bootstrapData: {
    user: {
      access_token: string;
    };
  };
}

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    // Check if the password and confirmation match
    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post<RegisterResponse>(
        "https://unelmacloud.com/api/v1/auth/register",
        {
          email,
          password,
          token_name: "your_token_name_here",
          password_confirmation: passwordConfirmation,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response from API:", response);

      const {access_token} = response.data.bootstrapData.user;
      console.log("Received Access Token:", access_token);
      if (access_token) {
        localStorage.setItem("access_token", access_token);
        alert("Registration successful!");
        navigate('/user-data'); // Redirect to UserData component
      } else {
        console.error("Access token is missing in response data");
        setError("Registration failed: Token not found");
      }
    } catch (error: any) {
      console.error("Error details:", error);

      if (error.response) {
        // Log the specific error response
        console.error("Response error:", error.response);
        
        // Provide more specific error message from the server response
        const message = error.response.data.message || "Invalid credentials, please try again.";
        setError(message);  // Set the detailed error message from the server
      } else {
        // If no response from the server, handle unexpected errors
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-7 rounded shadow-md w-100">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">
            Confirm Password:
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </label>
        </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white text-xl p-2 mt-5 rounded hover:bg-blue-700 cursor-pointer"
            >
            {isLoading ? "Registering..." : "Register"}
          </button>
      </form>
      <div className="mt-4">
        <button
          onClick={() => navigate('/')}
          className= "flex items-center text-blue-600 text-sm mt-1 cursor-pointer hover:underline"
        > <img className="h-7 w-7 mr-2" src={arrow_back} alt="arrow" />
          Back to Login
        </button>
      </div>
      {error && <div>{error}</div>}
    </div>
  );
};

export default Register;