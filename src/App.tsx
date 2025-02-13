import React from 'react';
import Login from './components/Login';
import UserData from './components/UserData';
import Header from './components/Header';

const App: React.FC = () => {
  const token = localStorage.getItem('access_token');

  return (
    <>
      <Header />
      <div className="flex justify-center items-center h-screen bg-gray-100 relative">
        {token ? <UserData /> : <Login />}
      </div>
    </>
  );
};

export default App;