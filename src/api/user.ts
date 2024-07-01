import Api from "./axiosConfig";
import userRoutes from "../endpoints/userEndPoints";

export const signUp = async (email: { email: string }) => {
  try {
    const response = await Api.post(userRoutes.signUp, email);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const verifyOTP = async (data: { otp: Number; email: string }) => {
  try {
    const response = await Api.post(userRoutes.verifyOTP, data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
