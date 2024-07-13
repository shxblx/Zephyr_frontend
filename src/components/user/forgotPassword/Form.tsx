import React, { useState } from "react";
import OrangeButton from "../../common/user/OrangeButton";
import { toast } from "react-toastify";
import { forgotPassword } from "../../../api/user";
import { useNavigate } from "react-router-dom";
import Loader from "../../common/user/Loader";

const Form: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email: string }>({ email: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors({ email: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPassword({ email });
      console.log(response);

      const data = response.data.userData;

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/otp", {
          state: {
            email,
            isForgot: true,
            userName: data.userName,
            displayName: data.displayName,
            profile: data.profile,
          },
        });
      } else {
        toast.error(response.data || "Password reset failed");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <Loader />}
      <div className="flex flex-col md:flex-row items-center min-h-screen px-4 md:px-0">
        <div className="md:ml-36 font-extrabold text-3xl md:text-5xl font-orbitron text-orange-600 my-4 md:my-auto leading-relaxed text-center md:text-left">
          Unlock Your Account,
          <br />
          Continue the Quest!
        </div>
        <div className="bg-white h-auto md:ml-36 p-8 shadow-md w-full max-w-lg md:max-w-xl">
          <h2 className="text-4xl md:text-5xl text-center font-orbitron font-bold mb-12">
            Forgot Password?
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-black-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                className={`w-full border-b-2 border-black-300 outline-none focus:border-ff5f09 ${
                  errors.email ? "border-red-500" : ""
                }`}
                type="text"
                value={email}
                id="email"
                name="email"
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            <div className="mt-4 flex justify-center font-bold">
              <OrangeButton px={40} py={10} color="#ff5f09" value="Send" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
