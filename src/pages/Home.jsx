import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 dark:text-white flex items-center justify-center px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-6xl w-full">
        
        {/* Image */}
        <img
          src="/hero-section/hero-image.webp"
          alt="Streaming"
          className="w-full h-auto max-h-[400px] object-contain"
        />

        {/* Content */}
        <div className="flex flex-col gap-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1c1c1c] dark:text-white leading-tight">
            YouStream: Discover, Watch & Share
          </h1>
          <p className="text-lg md:text-2xl font-medium text-[#1c1c1c] dark:text-white">
            Explore the latest content from streamers worldwide
          </p>

          {!currentUser ? (
            // Buttons when user is NOT logged in
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/signin"
                className="px-8 py-2 text-lg bg-[#1c1c1c] text-white rounded-full text-center"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-8 py-2 text-lg bg-[#1c1c1c] text-white rounded-full text-center"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            // Button when user IS logged in
            <div className="flex justify-center md:justify-start">
              <Link
                to="/upload"
                className="px-8 py-2 text-lg bg-gray-100 dark:bg-white text-[#1c1c1c] rounded-full text-center"
              >
                Upload
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
