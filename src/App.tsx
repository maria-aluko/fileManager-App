import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import UserData from "./components/UserData";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Register from "./components/RegisterNewUser";
import { LandingPage2 } from "./components/LandingPage2";

const App: React.FC = () => {
  const token = localStorage.getItem("access_token");

  return (
    <Router>
      <div className="h-screen w-screen">
        <Header />
        <div className="flex h-screen w-screen justify-start items-start">
          <Routes>
            <Route path="/" element={<LandingPage2 />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/user-data/:fileId"
              element={token ? <UserData /> : <Login />}
            />
            <Route path="/newUser" element={<Register />} />
            {/* <Route path="/landing" element={ <LandingPage />} /> */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
