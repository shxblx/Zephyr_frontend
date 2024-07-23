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