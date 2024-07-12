import Api from "./axiosConfig";
import userRoutes from "../endpoints/userEndPoints";

export const signUp = async (email: { email: string }) => {
  try {
    const response = await Api.post(userRoutes.signUp, email);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const verifyOTP = async (data: { otp: number; email: string }) => {
  try {
    const response = await Api.post(userRoutes.verifyOTP, data);
    console.log(response.data);
    return response;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.data);

      return error.response.data;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const resendOtp = async (email: { email: string }) => {
  try {
    const response = await Api.post(userRoutes.resendOtp, email);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
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
  } catch (error: any) {
    console.error("Error", error.message);
    throw error;
  }
};

export const forgotPassword = async (data: { email: string }) => {
  try {
    const response = await Api.post(userRoutes.forgotPassword, data);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const forgotVerify = async (data: { email: string; otp: number }) => {
  try {
    const response = await Api.post(userRoutes.forgotVerify, data);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};
