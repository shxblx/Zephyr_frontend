import React, { useState } from "react";
import OrangeButton from "../../common/user/OrangeButton";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../../api/user";
import { toast } from "react-toastify";
import Loader from "../../common/user/Loader";

const Form: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    userName: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      name === "displayName" ||
      name === "password" ||
      name === "confirmPassword"
    ) {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      let processedValue = value.trim().toLowerCase();
      if (name === "userName") {
        processedValue = processedValue.replace(/\s/g, "");
      }
      setFormData({
        ...formData,
        [name]: processedValue,
      });
    }

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      userName: "",
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.userName) {
      newErrors.userName = "Username is required";
    } else if (/\s/.test(formData.userName)) {
      newErrors.userName = "Username cannot contain spaces";
    }

    if (!formData.displayName) {
      newErrors.displayName = "Display name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // if (!formData.password) {
    //   newErrors.password = "Password is required";
    // } else if (!validatePassword(formData.password)) {
    //   newErrors.password =
    //     "Password must be at least 8 characters long and include a number, an uppercase letter, and a lowercase letter";
    // }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) return;

    try {
      setLoading(true);
      const response = await signUp(formData);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (response.status === 200) {
        toast.success(response.data);
        navigate("/otp", {
          state: {
            email: formData.email,
            userName: formData.userName,
            displayName: formData.displayName,
          },
        });
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      toast.error("Failed to sign up. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <Loader />}
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
              <label className="block text-black-700 mb-2" htmlFor="userName">
                Username
              </label>
              <input
                className="w-full border-b-2 border-black-300 outline-none focus:border-ff5f09"
                type="text"
                id="userName"
                value={formData.userName}
                name="userName"
                onChange={handleChange}
              />
              {errors.userName && (
                <p className="text-red-500">{errors.userName}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-black-700 mb-2"
                htmlFor="displayName"
              >
                Display Name
              </label>
              <input
                className="w-full border-b-2 border-black-300 outline-none focus:border-ff5f09"
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
              />
              {errors.displayName && (
                <p className="text-red-500">{errors.displayName}</p>
              )}
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
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-black-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full border-b-2 border-black-300 outline-none focus:border-ff5f09"
                type="password"
                id="password"
                value={formData.password}
                name="password"
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-black-700 mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                className="w-full border-b-2 border-black-300 outline-none focus:border-ff5f09"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                name="confirmPassword"
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="flex mt-12 justify-center">
              <p>Already have an Account?</p>
              <Link to="/login">
                <p className="text-ff5f09 hover:underline hover:cursor-pointer">
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
    </div>
  );
};

export default Form;
