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
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const blockUser = async (data: { userId: string }) => {
  try {
    const response = await Api.post(adminRoutes.blockUser, data);

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

export const unblockUser = async (data: { userId: string }) => {
  try {
    const response = await Api.post(adminRoutes.unblockUser, data);
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

export const AdminGetCommunities = async () => {
  try {
    const response = await Api.get(adminRoutes.getCommunities);
    return response;
  } catch (error: any) {
    console.error("Error in createCommunity:", error);
    if (error.response) {
      return error.response;
    } else {
      throw new Error(
        error.message || "An error occurred while creating the community"
      );
    }
  }
};

export const adminLogout = async () => {
  try {
    const response = await Api.post(adminRoutes.logout);

    return response;
  } catch (error: any) {
    console.error("Error in createCommunity:", error);
    if (error.response) {
      return error.response;
    } else {
      throw new Error(
        error.message || "An error occurred while creating the community"
      );
    }
  }
};

export const banCommunity = async (data: { communityId: string }) => {
  try {
    const response = await Api.post(adminRoutes.banCommunity, data);

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

export const unbanCommunity = async (data: { communityId: string }) => {
  try {
    const response = await Api.post(adminRoutes.unbanCommunity, data);
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

export const getUserDetails = async (userId: string) => {
  try {
    let url = `${adminRoutes.getUserInfo}/${userId}`;
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
export const getReports = async () => {
  try {
    const response = await Api.get(adminRoutes.getReports);
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
export const getCommunityReports = async () => {
  try {
    const response = await Api.get(adminRoutes.getCommunityReports);
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

export const getTickets = async () => {
  try {
    const response = await Api.get(adminRoutes.getTickets);
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

export const updateTicketStatus = async (data: {
  ticketId: string;
  newStatus: string;
  adminComments: string;
}) => {
  try {
    const response = await Api.post(adminRoutes.updateTicket, data);
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
