import React, { useState, useRef } from "react";
import OrangeButton from "../../common/OrangeButton";
import { useSelector } from "react-redux";

export const Form: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const { userInfo } = useSelector((state: any) => state.userInfo);


  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted OTP:", otp.join(""));
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
