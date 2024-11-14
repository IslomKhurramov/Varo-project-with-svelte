import axios from "axios";
import { serverApi } from "../../lib/config";

export const dashboardData = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/dashboardData/`, {
      withCredentials: true,
    });

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    throw error;
  }
};
