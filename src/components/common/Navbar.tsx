// Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <span
            className="text-3xl md:text-4xl font-bold font-orbitron"
            style={{ color: "#FF5F09" }}
          >
            ZEP
          </span>
          <span className="text-3xl md:text-4xl font-orbitron font-bold">
            <span className="text-transparent hyr-stroke">HYR</span>
          </span>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                />
              )}
            </svg>
          </button>
        </div>

        <div className="hidden text-xs md:flex items-center  justify-center space-x-6 lg:space-x-12 flex-grow">
          <Link
            to="/"
            className="text-white transition duration-300 ease-in-out hover:text-[#FF5F09] font-bold font-orbitron"
          >
            Home
          </Link>
          <Link
            to="/"
            className="text-white transition duration-300 ease-in-out hover:text-[#FF5F09] font-bold font-orbitron"
          >
            Zephyr!
          </Link>
          <Link
            to="/about"
            className="text-white transition duration-300 ease-in-out hover:text-[#FF5F09] font-bold font-orbitron"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-white transition duration-300 ease-in-out hover:text-[#FF5F09] font-bold font-orbitron"
          >
            Contact
          </Link>
        </div>

        <div className="hidden md:block">
          <Link to="/signup">
            <button className="orange-button text-white text-l focus:outline-none border-2 border-[#FF5F09] px-8 py-2 font-bold font-orbitron">
              <span className="relative z-10">SignUp</span>
            </button>
          </Link>
        </div>
      </div>

      {isOpen && (
        <div className="bg-ff5f09 md:hidden mt-4 flex flex-col items-center">
          <button className="text-white hover:text-[#FF5F09] font-bold font-orbitron py-2 mb-2">
            SignUp
          </button>
          <Link
            to="/"
            className="py-2 text-white hover:text-[#FF5F09] font-bold font-orbitron"
          >
            Home
          </Link>
          <Link
            to="/"
            className="py-2 text-white hover:text-[#FF5F09] font-bold font-orbitron"
          >
            Zephyr!
          </Link>
          <Link
            to="/about"
            className="py-2 text-white hover:text-[#FF5F09] font-bold font-orbitron"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="py-2 text-white hover:text-[#FF5F09] font-bold font-orbitron"
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
