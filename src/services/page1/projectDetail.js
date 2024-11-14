import axios from "axios";
import { serverApi } from "../../lib/config";

export const getPlanDetailInformation = async (index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getPlanDetailInformation/`,
      {
        plan_index: index,
      },
      {
        withCredentials: true,
      },
    );

    if (response?.data?.RESULT == "ERROR")
      throw new Error("Something went wrong!");

    return response.data[index];
  } catch (error) {
    throw error;
  }
};
