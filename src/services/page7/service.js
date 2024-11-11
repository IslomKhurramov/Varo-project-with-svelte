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
export const getTraceByPlan = async (plan_id) => {
  try {
    // Send request to server to unactivate the asset
    const response = await axios.post(
      `${serverApi}/api/getTraceByPlan/`,
      {
        plan_id: plan_id,
      },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    // If successful, return success
    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(`Error Code: ${data.CODE}`);
    }
  } catch (error) {
    throw error;
  }
};
export const compareByPlan = async (first_id, second_id) => {
  try {
    // Send request to server to unactivate the asset
    const response = await axios.post(
      `${serverApi}/api/compareTraceByPlan/`,
      {
        first: first_id,
        second: second_id,
      },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    // If successful, return success
    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(`Error Code: ${data.CODE}`);
    }
  } catch (error) {
    throw error;
  }
};
/********************ASSET*********************************** */
export const getAllTraceByAsset = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getAllTraceByAsset/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    await errorAlert(err?.message);
    loading = false;
  }
};
export const getTraceByAsset = async (asset_id) => {
  try {
    // Send request to server to unactivate the asset
    const response = await axios.post(
      `${serverApi}/api/getTraceByAsset/`,
      {
        asg_index: asset_id,
      },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    // If successful, return success
    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(`Error Code: ${data.CODE}`);
    }
  } catch (error) {
    throw error;
  }
};
