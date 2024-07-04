import Api from "./axiosConfig";
import userRoutes from "../endpoints/userEndPoints";

export const signUp = async (email: { email: string }) => {
  try {
    const response = await Api.post(userRoutes.signUp, email);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const verifyOTP = async (data: { otp: Number; email: string }) => {
  try {
    const response = await Api.post(userRoutes.verifyOTP, data);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await Api.post(userRoutes.login, data);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await Api.post(userRoutes.logout);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
