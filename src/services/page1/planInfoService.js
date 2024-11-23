import axios from "axios";
import { serverApi } from "../../lib/config";

export const getAllPlanLists = async (search) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getAllPlanLists/`,
      search,
      {
        withCredentials: true,
      },
    );

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    // const data = Object.values(response.data).sort(
    //   (a, b) => b.ccp_index - a.ccp_index,
    // );

    return response.data;
  } catch (error) {
    throw error;
  }
};
