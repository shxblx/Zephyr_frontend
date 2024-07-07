import React, { useState, useRef } from "react";
import OrangeButton from "../../common/user/OrangeButton";
import { toast } from "react-toastify";
import { verifyOTP } from "../../../api/user";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../../redux/slices/userSlice/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../common/user/Loader";

export const Form: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const navigate = useNavigate();

  const location = useLocation();
  const data = location.state;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const joinedOtp = otp.join("");

    if (otp.some((digit) => digit === "")) {
      toast.error("All OTP fields must be filled.");
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await verifyOTP({
        otp: parseInt(joinedOtp),
        email: data.email,
      });

      if (response?.status === 200) {
        toast.success(response);

        dispatch(
          setUserInfo({
            userName: data.userName,
            email: data.email,
            displayName: data.displayName,
          })
        );

        navigate("/");
      } else {
        toast.error(response);
      }
    } catch (error) {
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {Loading && <Loader />}
      <div className="flex flex-col md:flex-row items-center min-h-screen px-4 md:px-0">
        <div className="md:ml-36 font-extrabold text-3xl md:text-5xl font-orbitron text-ff5f09 my-4 md:my-auto leading-relaxed text-center md:text-left">
          Verify Your Account,
          <br />
          Continue the Quest!
        </div>
        <div className="bg-white md:ml-36 p-8 shadow-md w-full max-w-lg md:max-w-xl">
          <h2 className="text-4xl md:text-5xl text-center font-orbitron font-bold mb-12">
            Enter OTP
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  className="w-16 h-16 text-center text-2xl border-b-2 border-black-300 outline-none focus:border-ff5f09"
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              ))}
            </div>
            <div className="mt-4 flex font-extrabold justify-center font-orbitron">
              <OrangeButton
                type="submit"
                px={40}
                py={10}
                color="#ff5f09"
                value="Verify OTP"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
