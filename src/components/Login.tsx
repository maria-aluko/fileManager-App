import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LoginResponse {
  user: {
    access_token: string;
  };
}

interface LoginProps {
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

const Login: React.FC<LoginProps> = ({ setUsername }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        "https://unelmacloud.com/api/v1/auth/login",
        {
          email,
          password,
          token_name: "your_token_name_here", // doesn't work without this but what should it be?
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { access_token } = response.data.user;
      console.log("Received Access Token:", access_token);
      if (access_token) {
        localStorage.setItem("access_token", access_token);
        // Extract username from email
        const extractedUsername = email.split("@")[0];
        localStorage.setItem("username", extractedUsername);
        setUsername(extractedUsername);

        alert("Login successful!");
        navigate("/user-data/0"); // Redirect to UserData component
        window.location.reload();
      } else {
        console.error("Access token is missing in response data");
        setError("Login failed: Token not found");
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Response error:", error.response.data);
        setError("Invalid credentials, please try again.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex mx-auto justify-center items-center text-white">
      <div className="justify-center items-center mt-20 p-6 border-1 border-purple-200 rounded-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="simpleButton w-full"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </form>
        <div className="mt-5">
          <span>Not a user yet? Register here: </span>
          <button
            onClick={() => navigate("/newUser")}
            className="w-full simpleButton mt-2"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
