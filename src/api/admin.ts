import Api from "./axiosConfig";
import adminRoutes from "../endpoints/adminEndPoints";

export const adminLogin = async (data: { email: string; password: string }) => {
  try {
    const response = await Api.post(adminRoutes.login, data);

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
export const getUsers = async () => {
  try {
    const data = await Api.get(adminRoutes.getUsers);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const blockUser = async (data: { userId: string }) => {
  try {
    const response = await Api.post(adminRoutes.blockUser, data)
    console.log("response in api " + response);

    return response
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
}

export const unblockUser = async (data: { userId: string }) => {
  try {
    const response = await Api.post(adminRoutes.unblockUser, data)
    return response
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }

}
