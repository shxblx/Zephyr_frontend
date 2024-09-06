import Api from "./axiosConfig";
import userRoutes from "../endpoints/userEndPoints";

export const signUp = async (email: { email: string }) => {
  try {
    const response = await Api.post(userRoutes.signUp, email);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const verifyOTP = async (data: { otp: number; email: string }) => {
  try {
    const response = await Api.post(userRoutes.verifyOTP, data);

    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
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
      return error.response;
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
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await Api.post(userRoutes.logout);
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
      return error.response;
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
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const getUserInfo = async (data: { userId: string }) => {
  try {
    const response = await Api.get(`${userRoutes.getUserInfo}/${data.userId}`);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const changeProfile = async (data: FormData) => {
  try {
    const response = await Api.put(userRoutes.changeProfile, data, {
      headers: {  
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const changeStatus = async (data: {
  status: string;
  userId: string;
}) => {
  try {
    const response = await Api.put(userRoutes.changeStatus, data);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const changeUserName = async (data: {
  userId: string;
  newName: string;
}) => {
  try {
    const response = await Api.put(userRoutes.changeUserName, data);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const changeDisplayName = async (data: {
  userId: string;
  newName: string;
}) => {
  try {
    const response = await Api.put(userRoutes.changeDisplayName, data);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const changePassword = async (data: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await Api.put(userRoutes.changePassword, data);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const getNotification = async (userId: string) => {
  try {
    let url = `${userRoutes.getNotification}/${userId}`;
    const response = await Api.get(url);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const clearNotifications = async (data: { userId: string }) => {
  try {
    const response = await Api.patch(userRoutes.clearNotifications, data);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const sendMessageToChatbot = async (data: { message: string }) => {
  try {
    const response = await Api.post(userRoutes.chatWithBot, data);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const raiseTicket = async (data: {
  userId: string;
  subject: string;
  description: string;
}) => {
  try {
    const response = await Api.post(userRoutes.raiseTicket, data);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const getTickets = async (userId: string) => {
  try {
    const url = `${userRoutes.fetchTickets}/${userId}`;
    const response = await Api.get(url);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};
