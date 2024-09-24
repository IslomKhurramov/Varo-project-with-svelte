import axios from "axios";
import { serverApi } from "../../lib/config";

export const getCCEResultUploadStatus = async (plan_index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getCCEResultUploadStatus/`,
      {
        plan_index: plan_index,
      },
      {
        withCredentials: true,
      },
    );

    if (response?.data?.RESULT == "ERROR")
      throw new Error("Something went wrong!");

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getCCEResultUploadStatus:", error);
    throw error;
  }
};

export const getUploadedResultErrors = async (plan_index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getUploadedResultErrors/`,
      {
        plan_index: plan_index,
      },
      {
        withCredentials: true,
      },
    );

    if (response?.data?.RESULT == "ERROR")
      throw new Error("Something went wrong!");

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getUploadedResultErrors:", error);
    throw error;
  }
};
