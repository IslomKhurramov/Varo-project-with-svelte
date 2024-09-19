import axios from "axios";
import { serverApi } from "../../lib/config";

// Post request for saving part of the plan information
export const postNewPlanInformation = async (planInfo) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getNewPlanInformation/`,
      planInfo
    );
    return response.data;
  } catch (error) {
    console.error("Error posting new plan information:", error);
    throw error;
  }
};

// Post request to submit the full plan
export const setNewPlan = async (planData) => {
  try {
    const response = await axios.post(`${serverApi}/setNewPlan/`, planData);
    return response.data;
  } catch (error) {
    console.error("Error setting new plan:", error);
    throw error;
  }
};

export const getAssetGroups = async () => {
  try {
    const response = await axios.get(`${serverApi}/getAssetGroups/`);

    if (response.status === 200) {
      // Check if the response is OK
      return response.data; // Return the data if successful
    } else {
      console.error("Error fetching asset groups:", response.status);
      throw new Error("Failed to fetch asset groups");
    }
  } catch (error) {
    console.error("Error fetching asset groups:", error);
    throw error; // Re-throw the error for the calling function to handle
  }
};

export const getOptionsForNewPlan = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getOptionsForNewPlan/`);
    console.log("getOptionsForNewPlan: ", response.data.CODE);

    if (response.status === 200) {
      // Check if the response is OK
      return response.data.CODE; // Return the data if successful
    } else {
      console.error("Error fetching asset groups:", response.status);
      throw new Error("Failed to fetch asset groups");
    }
  } catch (error) {
    console.error("Error fetching asset groups:", error);
    throw error; // Re-throw the error for the calling function to handle
  }
};
