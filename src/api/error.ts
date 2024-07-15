import { AxiosError } from "axios";
import { toast } from "react-toastify";
import axios from "axios";

interface IErrorResponse {
  message: string;
  accountType?: string;
}

const errorHandle = (error: Error | AxiosError) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    console.log(axiosError);
    if (axiosError.response?.data) {
      const errorResponse = axiosError.response.data as IErrorResponse;
      if (axiosError.response.status === 403 && errorResponse.accountType === "user") {
        toast.error(errorResponse.message);
        if (window.location.pathname !== "/home") {
          setTimeout(() => {
            window.location.href = "/home";
          }, 2000);
        }
      } else if (axiosError.response.status === 400) {
        toast.error(errorResponse.message);
      } else if (errorResponse.message) {
        toast.error(errorResponse.message);
      } else {
        console.log("Error response has no message");
        toast.error("An error occurred. Please try again!");
      }
    } else {
      toast.error("An error occurred. Please try again!");
      console.log("axiosError", axiosError.message);
    }
  } else {
    toast.error("An error occurred. Please try again!");
    console.log("Error", error.message);
  }
};

export default errorHandle;