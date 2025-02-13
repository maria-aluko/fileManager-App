import { useState } from 'react';
import axios from 'axios';

interface LoginResponse {
  user: {
    access_token: string;
  };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
  
    try {
      const response = await axios.post<LoginResponse>(
        'https://unelmacloud.com/api/v1/auth/login',
        {
          email,
          password,
          token_name: 'your_token_name_here', // Add token_name to the request
        },
        {
          headers: {
            'Content-Type': 'application/json', // Explicitly set the content type
          },
        }
      );

      const { access_token } = response.data.user;
      console.log('Received Access Token:', access_token); 
      if (access_token) {
        localStorage.setItem('access_token', access_token);
        alert('Login successful!');
      } else {
        console.error('Access token is missing in response data');
        setError('Login failed: Token not found');
      }
    } catch (error: any) {
      if (error.response) {
        // If there's a response error, print it
        console.error('Response error:', error.response.data);
        setError('Invalid credentials, please try again.');
      } else {
        // For other errors (like network issues)
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="bg-white p-6 rounded shadow-md w-96">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Login;