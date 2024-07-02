import React, { useState, useRef } from "react";
import OrangeButton from "../../common/OrangeButton";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { verifyOTP } from "../../../api/user";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../../redux/slices/userSlice/userSlice";
import { useNavigate } from "react-router-dom";

export const Form: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const { userInfo } = useSelector((state: any) => state.userInfo);
  const dispatch = useDispatch();

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const joinedOtp = otp.join("");

    if (otp.some((digit) => digit === "")) {
      toast.error("All OTP fields must be filled.");
      return;
    }

    try {
      const response = await verifyOTP({
        otp: parseInt(joinedOtp),
        email: userInfo.email,
      });

      if (response?.status === 200) {
        toast.success(response.data.message);

        dispatch(
          setUserInfo({
            userName: userInfo.userName,
            email: userInfo.email,
            displayName: userInfo.displayName,
          })
        );

        navigate("/");
      } else {
        toast.error(response?.data.message || "Failed to verify OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
    }
  };

  return (
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
  );
};

export default Form;
