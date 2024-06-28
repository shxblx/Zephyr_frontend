import React from "react";
import OrangeButton from "../../common/OrangeButton";

const Form: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center min-h-screen px-4 md:px-0">
      <div className="md:ml-36 font-extrabold text-3xl md:text-5xl font-orbitron text-orange-600 my-4 md:my-auto leading-relaxed text-center md:text-left">
        Unlock Your Account,<br />Begin the Quest!
      </div>
      <div className="bg-white md:ml-36 p-8 shadow-md w-full max-w-lg md:max-w-xl">
        <h2 className="text-4xl md:text-5xl text-center font-orbitron font-bold mb-12">
          Sign Up
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
            <label className="block text-black-700 mb-2" htmlFor="displayname">
              Display Name
            </label>
            <input
              className="w-full border-b-2 border-black-300 outline-none focus:border-ff5f09"
              type="text"
              id="displayname"
              name="displayname"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full border-b-2 border-black-300 outline-none focus:border-ff5f09"
              type="email"
              id="email"
              name="email"
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
          </div>
          <div className="mb-4">
            <label
              className="block text-black-700 mb-2"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              className="w-full border-b-2 border-black-300 outline-none focus:border-ff5f09"
              type="password"
              id="confirm-password"
              name="confirm-password"
            />
          </div>
          <div className="mt-8 md:mt-14 flex font-extrabold justify-center font-orbitron">
            <OrangeButton px={40} py={10} color="#ff5f09" value="Submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
