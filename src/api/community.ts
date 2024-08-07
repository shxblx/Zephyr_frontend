import Api from "./axiosConfig";
import userRoutes from "../endpoints/userEndPoints";

export const createCommunity = async (data: FormData) => {
  try {
    console.log("Sending data to backend:", Object.fromEntries(data));

    let response = await Api.post(userRoutes.createCommuity, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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

export const getCommunities = async (userId?: string, search?: string) => {
  try {
    let url = `${userRoutes.getCommunities}/${userId}`;
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }

    const response = await Api.get(url);
    return response;
  } catch (error: any) {
    console.error("Error in getCommunities:", error);
    if (error.response) {
      return error.response;
    } else {
      throw new Error(
        error.message || "An error occurred while fetching communities"
      );
    }
  }
};

export const joinCommunity = async (data: {
  communityId: string;
  userId: string;
}) => {
  try {
    const response = await Api.patch(userRoutes.joinCommunity, data);
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

export const getMycommunities = async (userId: string) => {
  try {
    let url = `${userRoutes.getMyCommunity}/${userId}`;
    const response = await Api.get(url);
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

export const leaveCommunity = async (data: {
  userId: string;
  communityId: string;
}) => {
  try {
    const response = await Api.patch(userRoutes.leaveCommunity, data);
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

export const getMembers = async (communityId: string) => {
  try {
    let url = `${userRoutes.getMembers}/${communityId}`;
    const response = await Api.get(url);
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

export const getCommunityById = async (communityId: string | undefined) => {
  try {
    let url = `${userRoutes.getCommunityById}/${communityId}`;

    const response = await Api.get(url);
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

export const removeMember = async (data: {
  userId: string;
  communityId: string;
}) => {
  try {
    const response = await Api.patch(userRoutes.removeMember, data);
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

export const updateCommunity = async (data: {
  name: string;
  description: string;
  tags: string[];
  communityId: string;
}) => {
  try {
    const response = await Api.patch(userRoutes.updateCommunity, data);
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

export const sendCommunityMessage = async (data: {
  communityId: string;
  sender: string;
  userName: string;
  profilePicture: string;
  content: string;
}) => {
  try {
    const response = await Api.post(userRoutes.sendCommunityMessage, data);

    console.log(response);

    return response;
  } catch (error: any) {
    console.error("Error in sendCommunityMessage:", error);
    if (error.response) {
      return error.response;
    } else {
      throw new Error(
        error.message || "An error occurred while sending the community message"
      );
    }
  }
};
export const getCommunityMessages = async (communityId: string) => {
  try {
    const url = `${userRoutes.getCommunityMessages}/${communityId}`;
    const response = await Api.get(url);
    return response;
  } catch (error: any) {
    console.error("Error in sendCommunityMessage:", error);
    if (error.response) {
      return error.response;
    } else {
      throw new Error(
        error.message || "An error occurred while sending the community message"
      );
    }
  }
};
export const reportCommunity = async (data: {
  reporterId: string;
  reportedCommunityId: string;
  subject: string;
  reason: string;
}) => {
  try {
    const response = await Api.post(userRoutes.communityReport, data);
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
