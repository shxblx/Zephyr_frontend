import Api from "./axiosConfig";
import userRoutes from "../endpoints/userEndPoints";

export const createCommunity = async (data: FormData) => {
    try {
        console.log("Sending data to backend:", Object.fromEntries(data));

        let response = await Api.post(userRoutes.createCommuity, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response;
    } catch (error: any) {
        console.error("Error in createCommunity:", error);
        if (error.response) {
            return error.response;
        } else {
            throw new Error(error.message || "An error occurred while creating the community");
        }
    }
}


export const getCommunities = async (userId?: string) => {
    try {
        let url = `${userRoutes.getCommunities}/${userId}`;
        const response = await Api.get(url)
        return response
    } catch (error: any) {
        console.error("Error in createCommunity:", error);
        if (error.response) {
            return error.response;
        } else {
            throw new Error(error.message || "An error occurred while creating the community");
        }
    }
}

export const joinCommunity = async (data: { communityId: string, userId: string }) => {
    try {
        const response = await Api.patch(userRoutes.joinCommunity, data)
        return response
    } catch (error: any) {
        console.error("Error in createCommunity:", error);
        if (error.response) {
            return error.response;
        } else {
            throw new Error(error.message || "An error occurred while creating the community");
        }
    }
}

export const getMycommunities = async (userId: string) => {
    try {
        let url = `${userRoutes.getMyCommunity}/${userId}`;
        const response = await Api.get(url)
        return response
    } catch (error: any) {
        console.error("Error in createCommunity:", error);
        if (error.response) {
            return error.response;
        } else {
            throw new Error(error.message || "An error occurred while creating the community");
        }
    }
}

export const leaveCommunity = async (data: { userId: string, communityId: string }) => {
    try {
        const response = await Api.patch(userRoutes.leaveCommunity, data)
        return response
    } catch (error: any) {
        console.error("Error in createCommunity:", error);
        if (error.response) {
            return error.response;
        } else {
            throw new Error(error.message || "An error occurred while creating the community");
        }
    }
}

export const getMembers = async (communityId: string) => {
    try {
        let url = `${userRoutes.getMembers}/${communityId}`
        const response = await Api.get(url)
        return response
    } catch (error: any) {
        console.error("Error in createCommunity:", error);
        if (error.response) {
            return error.response;
        } else {
            throw new Error(error.message || "An error occurred while creating the community");
        }
    }
}