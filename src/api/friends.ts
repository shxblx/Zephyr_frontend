import Api from "./axiosConfig";
import userRoutes from "../endpoints/userEndPoints";

export const getGlobalFriends = async () => {
    try {
        const response = await Api.get(userRoutes.getGlobalFriends);

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