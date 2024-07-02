import React, { useState } from "react";
import OrangeButton from "../../common/OrangeButton";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../../api/user";
import { toast } from "react-toastify";

const Form: React.FC = () => {
  const [FormData, setFormData] = useState({
    userName: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await signUp(FormData);

      if (response) {
        toast.success(response.data.message);
        console.log(response.data.message);
        navigate("/otp", {
          state: {
            userName: FormData.userName,
            email: FormData.email,
            displayName: FormData.displayName,
            password: FormData.password,
          },
        });
      }
    } catch (error) {
      toast.error("Failed to sign up. Please try again.");
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    setFormData({
      ...FormData,
      [name]: processedValue,
    });
  };
  return (
    <div className="flex flex-col md:flex-row items-center min-h-screen px-4 md:px-0">
      <div className="md:ml-36 font-extrabold text-3xl md:text-5xl font-orbitron text-ff5f09 my-4 md:my-auto leading-relaxed text-center md:text-left">
        Create Your Account,
        <br />
        Begin the Quest!
      </div>
      <div className="bg-white md:ml-36 p-8 shadow-md w-full max-w-lg md:max-w-xl">
        <h2 className="text-4xl md:text-5xl text-center font-orbitron font-bold mb-12">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="w-full border-b-2 border-black-300 outline-none focus:border-ff5f09"
              type="text"
              id="username"
              value={FormData.userName}
              name="userName"
              onChange={handleChange}
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
              name="displayName"
              value={FormData.displayName}
              onChange={handleChange}
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
              value={FormData.email}
              onChange={handleChange}
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
              value={FormData.password}
              name="password"
              onChange={handleChange}
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
              value={FormData.confirmPassword}
              name="confirm-password"
              onChange={handleChange}
            />
          </div>
          <div className="flex mt-12 justify-center">
            <p>Already have an Account?</p>
            <Link to="/login">
              <p className=" text-ff5f09 hover:underline hover:cursor-pointer">
                Login
              </p>
            </Link>
          </div>
          <div className="mt-4 flex font-extrabold justify-center font-orbitron">
            <OrangeButton
              type="submit"
              px={40}
              py={10}
              color="#ff5f09"
              value="Signup"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
