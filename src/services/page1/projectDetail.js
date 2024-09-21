import axios from "axios";
import { navigate } from "svelte-routing";
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
      }
    );

    console.log("getPlanDetailInformation: ", response);

    if (response?.data?.RESULT == "ERROR")
      throw new Error("Something went wrong!");

    return response.data[index];
  } catch (error) {
    console.error("Error fetching plan info:", error);
    throw error;
  }
};
