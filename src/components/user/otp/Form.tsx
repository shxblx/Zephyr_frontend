import React, { useState, useRef, useEffect } from "react";
import OrangeButton from "../../common/user/OrangeButton";
import { toast } from "react-toastify";
import { forgotVerify, resendOtp, verifyOTP } from "../../../api/user";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../../redux/slices/userSlice/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../common/user/Loader";

export const Form: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(10);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

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
      // setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));

      let response;
      if (data.isForgot) {
        response = await forgotVerify({
          email: data.email,
          otp: parseInt(joinedOtp),
        });
      } else {
        response = await verifyOTP({
          otp: parseInt(joinedOtp),
          email: data.email,
        });
      }
      console.log(response.data.userData);

      let userData = response.data.userData;

      if (response?.status === 200) {
        toast.success(response.data.message);

        dispatch(
          setUserInfo({
            userName: data.userName,
            email: data.email,
            displayName: data.displayName,
            profile: data.profile,
            status: userData.status,
            joined_date: userData.joined_date,
          })
        );

        navigate("/");
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await resendOtp({ email: data.email });
      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data);
      }
      setIsResendDisabled(true);
      setCountdown(10);
    } catch (error) {
      console.error("Failed to resend OTP", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <Loader />}
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
            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResendDisabled}
                className={`font-orbitron font-bold px-4 py-3 ${
                  isResendDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-ff5f09 text-white hover:bg-opacity-80"
                }`}
              >
                Resend OTP
              </button>
              {isResendDisabled && (
                <span className="font-orbitron mx-4">{countdown}s</span>
              )}
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
