import Api from "./axiosConfig";
import userRoutes from "../endpoints/userEndPoints";

export const getGlobalFriends = async (userId: string) => {
    try {
        const response = await Api.get(`${userRoutes.getGlobalFriends}/${userId}`);
        return response;
    } catch (error: any) {
        if (error.response) {
            return error.response;
        } else {
            console.error("Error", error.message);
        }
        throw error;
    }
}

export const addFriend = async (data: { userId: string, friendId: string }) => {
    try {
        const response = await Api.post(userRoutes.addFriend, data)
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