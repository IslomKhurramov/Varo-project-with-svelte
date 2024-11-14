import axios from "axios";
import { serverApi } from "../../lib/config";

export const getAllPlanLists = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getAllPlanLists/`, {
      withCredentials: true,
    });

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    const data = Object.values(response.data).sort(
      (a, b) => b.ccp_index - a.ccp_index,
    );

    return data;
  } catch (error) {
    throw error;
  }
};
