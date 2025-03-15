import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/Frame 2.svg';

const images = [
  "/excel.svg",
  "/pdf.svg",
  "/word.svg",
  "/mov.svg",
  "/jpg.svg",
];

const logo = "/Frame 2.svg";

export const LandingPage: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const speed = 1;

  const navigate = useNavigate();
 
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setScrollWidth(containerRef.current.scrollWidth / 2); // only original width
    }

    let animationFrameId: number;

    const animate = () => {
      setOffset((prev) => {
        const newOffset = prev - speed;
        return newOffset <= -scrollWidth ? 0 : newOffset;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [scrollWidth]);

  const loopImages = [...images, ...images]; // duplicate for loop

  function handleSignIn () {
    console.log('Sign In');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 to-blue-100 w-full flex items-center justify-between px-10 gap-10">

    {/* Left Section */}
    <div className="lg:w-1/2 flex flex-col items-start text-left space-y-6">
      <h1 className="text-5xl font-bold text-gray-800 flex items-center">
        Welcome to
        <img src={logo} alt="logo" className="w-[200px] h-auto ml-4" />
      </h1>
        <p className="text-gray-900 text-lg">
          Save !t is a File Management platform that allows you to save and store your files in a secure and easy way.
        </p>
        <div className="flex">
          <button className="text-white bg-pink-700 py-2 px-6 rounded text-lg cursor-pointer">
            About Save !t
          </button>
          <button className="ml-4 text-gray-700 bg-gray-100 py-2 px-6 hover:bg-gray-200 rounded text-lg cursor-pointer" onClick={handleSignIn}>
            Sign In
          </button>
        </div>
      </div>

      {/* Right Section - Animated image strip */}
      <div
        style={{
          width: "50%",
          overflow: "hidden",
          // border: "1px solid red",
        }}
      >
        <div
          ref={containerRef}
          style={{
            display: "flex",
            transform: `translateX(${offset}px)`,
            transition: "transform 0s linear",
            whiteSpace: "nowrap",
          }}
        >
          {loopImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`icon-${index}`}
              style={{
                width: "80px",
                height: "80px",
                marginRight: "16px",
                flexShrink: 0,
                objectFit: "contain",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};




        


