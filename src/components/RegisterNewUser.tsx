import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface RegisterResponse {
  bootstrapData: {
    user: {
      access_token: string;
    };
  };
}

interface RegisterProps {
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

const Register: React.FC<RegisterProps> = ({ setUsername }) => {
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
      const { access_token } = response.data.bootstrapData.user;
      console.log("Received Access Token:", access_token);
      if (access_token) {
        localStorage.setItem("access_token", access_token);
        const extractedUsername = email.split("@")[0];
        localStorage.setItem("username", extractedUsername);
        setUsername(extractedUsername);

        alert("Registration successful!");
        navigate("/user-data/0"); // Redirect to UserData component
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
        const message =
          error.response.data.message ||
          "Invalid credentials, please try again.";
        setError(message); // Set the detailed error message from the server
      } else {
        // If no response from the server, handle unexpected errors
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex mx-auto justify-center items-center text-white">
      <div className="justify-center items-center mt-20 p-6 border-1 border-purple-200 rounded-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium ">
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </label>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </label>
          </div>
          <div className="mb-4">
            <label
              htmlFor="passwordConfirmation"
              className="block text-sm font-medium"
            >
              Confirm Password:
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full simpleButton"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-purple-300 text-sm mt-1 cursor-pointer hover:underline"
          >
            Back to Login
          </button>
        </div>
        {error && <div>{error}</div>}
      </div>
    </div>
  );
};

export default Register;
