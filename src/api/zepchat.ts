import Api from "./axiosConfig";
import userRoutes from "../endpoints/userEndPoints";

export const newZapchat = async (data: {
  title: string;
  content: string;
  tags: string;
  userId: string;
}) => {
  try {
    const response = await Api.post(userRoutes.newZepchat, data);
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

export const getZepchats = async () => {
  try {
    const response = await Api.get(userRoutes.getZepchats);
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

export const postReply = async (data: {
  zepChatId: string;
  userId: string;
  content: string;
}) => {
  try {
    const response = await Api.post(userRoutes.postReply, data);
    console.log(response);

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

export const getReplies = async (zepchatId: string) => {
  try {
    const url = `${userRoutes.getReplies}/${zepchatId}`;
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

export const getZepchatById = async (zepchatId: string) => {
  try {
    const url = `${userRoutes.getZepchatById}/${zepchatId}`;
    const response = await Api.get(url);
    console.log(response);

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
export const voteReply = async (data: {
  replyId: string;
  voteType: "upVote" | "downVote" | "removeUpVote" | "removeDownVote";
  userId: string;
}) => {
  try {
    console.log(data);

    const response = await Api.patch(userRoutes.replyVote, data);
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

export const voteZepchat = async (data: {
  zepchatId: string;
  voteType: "upVote" | "downVote" | "removeUpVote" | "removeDownVote";
  userId: string;
}) => {
  try {
    console.log(data);

    const response = await Api.patch(userRoutes.voteZepchat, data);
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

export const deleteZepchat = async (data: {
  zepchatId: string;
  userId: string;
}) => {
  try {
    const response = await Api.patch(userRoutes.deleteZepchat, data);
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
export const updateZepchat = async (data: {
  zepchatId: string;
  title: string;
  content: string;
  tags: string[];
}) => {
  try {
    const response = await Api.patch(userRoutes.updateZepchat, data);
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

export const reportZepchat = async (data: {
  zepchatId: string;
  userId: string;
  subject: string;
  reason: string;
}) => {
  try {
    const response = await Api.patch(userRoutes.updateZepchat, data);
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
