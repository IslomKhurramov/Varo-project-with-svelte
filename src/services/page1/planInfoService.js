import axios from "axios";
import { serverApi } from "../../lib/config";

export const getAllPlanLists = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getAllPlanLists/`, {
      withCredentials: true,
    });

    console.log("getAllPlanLists RESPONSE:", response);

    const data = Object.values(response.data).sort(
      (a, b) => b.ccp_index - a.ccp_index,
    );

    console.log("++data", data);

    return data;
  } catch (error) {
    console.error("Error fetching plan info:", error);
    throw error;
  }
};
