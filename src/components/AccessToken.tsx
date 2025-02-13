import axios from 'axios';

const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

const AccessToken = async () => {
  const token = getAccessToken();

  if (!token) {
    console.error('No access token found');
    return;
  }

  try {
    const response = await axios.get('https://unelmacloud.com/api/v1/auth/login', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // This is the user data or file information
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

export default AccessToken;