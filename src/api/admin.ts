import Api from "./axiosConfig";
import adminRoutes from "../endpoints/adminEndPoints";

export const adminLogin = async (data: { email: string; password: string }) => {
  try {
    const response = await Api.post(adminRoutes.login, data);

    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};
export const getUsers = async () => {
  try {
    const data = await Api.get(adminRoutes.getUsers);
    console.log(data);

    return data;
  } catch (error) {}
};
