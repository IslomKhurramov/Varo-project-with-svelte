import axios from "axios";
import { serverApi } from "../../lib/config";

/****************ASSET DATA LIST***************** */
export const getLeftTrackData = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getLeftTrackData/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    await errorAlert(err?.message);
    loading = false;
  }
};

export const getAllTraceByPlan = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getAllTraceByPlan/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    await errorAlert(err?.message);
    loading = false;
  }
};
