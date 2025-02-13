import React from 'react';
import Login from './components/Login';
import UserData from './components/UserData';

const App: React.FC = () => {
  const token = localStorage.getItem('access_token');

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {token ? <UserData /> : <Login />}
    </div>
  );
};

export default App;