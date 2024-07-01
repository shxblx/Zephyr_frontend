import React from "react";
import OrangeButton from "../../common/OrangeButton";
import { Link } from "react-router-dom";

const Form: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center min-h-screen px-4 md:px-0">
      <div className="md:ml-36 font-extrabold text-3xl md:text-5xl font-orbitron text-orange-600 my-4 md:my-auto leading-relaxed text-center md:text-left">
        Unlock Your Account,
        <br />
        Continue the Quest!
      </div>
      <div className="bg-white h-[450px] md:ml-36 p-8 shadow-md w-full max-w-lg md:max-w-xl">
        <h2 className="text-4xl md:text-5xl text-center font-orbitron font-bold mb-12">
          Login
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-black-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="w-full border-b-2 border-black-300 outline-none focus:border-ff5f09"
              type="text"
              id="username"
              name="username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full border-b-2 border-black-300 outline-none focus:border-ff5f09"
              type="password"
              id="password"
              name="password"
            />
            <p className="flex justify-end text-ff5f09 hover:underline hover:cursor-pointer">
              Forgot Password?
            </p>
          </div>
          <div className="flex justify-center mt-12">
            <p>Dont have an Account?</p>
            <Link to="/signup">
              <p className="text-ff5f09 hover:underline hover:cursor-pointer">
                Signup
              </p>
            </Link>
          </div>
          <div className="mt-4 flex font-extrabold justify-center font-orbitron">
            <OrangeButton px={40} py={10} color="#ff5f09" value="Login" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
