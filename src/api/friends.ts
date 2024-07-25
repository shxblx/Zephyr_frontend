import Api from "./axiosConfig";
import userRoutes from "../endpoints/userEndPoints";


export const getGlobalFriends = async (userId: string, searchText?: string) => {
    try {
        let url = `${userRoutes.getGlobalFriends}/${userId}`;
        if (searchText) {
            url += `?search=${encodeURIComponent(searchText)}`;
        }
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

export const getFriends = async (userId: string) => {
    try {
        const response = await Api.get(`${userRoutes.getFriends}/${userId}`)
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

export const fetchAllUsers = async (searchText?: string) => {
    try {
        let url = userRoutes.getAllUsers;
        if (searchText) {
            url += `?search=${encodeURIComponent(searchText)}`;
        }
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
}

export const removeFriend = async (data: { userId: string, friendId: string }) => {
    try {
        const response = await Api.patch(userRoutes.removeFriend, data)
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