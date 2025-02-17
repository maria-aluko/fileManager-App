import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

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
  const navigate = useNavigate();

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
          token_name: 'your_token_name_here', // doesn't work without this but what should it be?
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { access_token } = response.data.user;
      console.log('Received Access Token:', access_token); 
      if (access_token) {
        localStorage.setItem('access_token', access_token);
        alert('Login successful!');
        navigate('/user-data'); // Redirect to UserData component
      } else {
        console.error('Access token is missing in response data');
        setError('Login failed: Token not found');
      }
    } catch (error: any) {
      if (error.response) {
        console.error('Response error:', error.response.data);
        setError('Invalid credentials, please try again.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="bg-white p-7 rounded shadow-md w-100">
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
          className="w-full bg-blue-600 text-white text-xl p-2 mt-5 rounded hover:bg-blue-700 cursor-pointer"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
      <div className='mt-5'>
        <span>Not a user yet? Register here: </span>
        <button
          onClick={() => navigate('/newUser')}
          className="w-full bg-blue-600 text-white text-xl p-2 mt-5 rounded hover:bg-blue-700 cursor-pointer"
        >
        Register
        </button>
      
      </div>
    </div>
  );
};

export default Login;