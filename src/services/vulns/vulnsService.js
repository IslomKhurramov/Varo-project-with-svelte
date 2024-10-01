import axios from "axios";
import { serverApi } from "../../lib/config";

export const getVulnsOfPlan = async (plan_index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getVulnsOfPlan/`,
      {},
      {
        withCredentials: true,
      },
    );

    console.log("getVulnsOfPlan RESPONSE:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getVulnsOfPlan:", error);
    throw error;
  }
};
