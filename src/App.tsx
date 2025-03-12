import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import UserData from "./components/UserData";
import Header from "./components/Header";

import Register from "./components/RegisterNewUser";

const App: React.FC = () => {
  const token = localStorage.getItem("access_token");

  return (
    <Router>
      <div className="h-screen w-screen">
        <Header />
        <div className="flex justify-center items-center h-screen bg-gray-100 relative">
          <Routes>
            <Route path="/" element={token ? <UserData /> : <Login />} />
            <Route path="/user-data" element={<UserData />} />
            <Route path="/newUser" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
