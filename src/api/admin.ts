import Api from "./axiosConfig";
import adminRoutes from "../endpoints/adminEndPoints";

export const adminLogin = async (data: { email: string; password: string }) => {
  try {
    const response = await Api.post(adminRoutes.login, data);
    console.log(response);
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
