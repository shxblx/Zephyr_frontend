import React, { useState } from "react";
import OrangeButton from "../../common/OrangeButton";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../api/user";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../../redux/slices/userSlice/userSlice";

const Form: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validatePassword = (password: string) => {
    return password.length >= 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    let error = "";
    if (name === "email") {
      if (!validateEmail(value)) {
        error = "Invalid email format";
      }
    } else if (name === "password") {
      if (!validatePassword(value)) {
        error = "Password must be at least 6 characters long";
      }
    }
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(formData.email)
      ? ""
      : "Invalid email format";
    const passwordError = validatePassword(formData.password)
      ? ""
      : "Field cannot be empty";

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (!emailError && !passwordError) {
      const response = await login(formData);
      if (response.data?.status === true) {
        const userData = response.data.userData;

        dispatch(
          setUserInfo({
            userName: userData.userName,
            email: userData.email,
            displayName: userData.displayName,
          })
        );

        navigate("/");

        toast.success(response.data.message);
      } else {
        toast.error(response);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center min-h-screen px-4 md:px-0">
      <div className="md:ml-36 font-extrabold text-3xl md:text-5xl font-orbitron text-orange-600 my-4 md:my-auto leading-relaxed text-center md:text-left">
        Unlock Your Account,
        <br />
        Continue the Quest!
      </div>
      <div className="bg-white h-auto md:ml-36 p-8 shadow-md w-full max-w-lg md:max-w-xl">
        <h2 className="text-4xl md:text-5xl text-center font-orbitron font-bold mb-12">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full border-b-2 border-black-300 outline-none focus:border-ff5f09"
              type="text"
              value={formData.email}
              id="email"
              name="email"
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
              value={formData.password}
              id="password"
              name="password"
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
            <p className="flex justify-end text-ff5f09 hover:underline hover:cursor-pointer">
              Forgot Password?
            </p>
          </div>
          <div className="flex justify-center mt-12">
            <p>Don't have an Account?</p>
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
