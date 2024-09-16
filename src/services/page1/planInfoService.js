import axios from "axios";
import { serverApi } from "../../lib/config";

export const getAllPlanInfo = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getAllPlanLists/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching plan info:", error);
    throw error;
  }
};
