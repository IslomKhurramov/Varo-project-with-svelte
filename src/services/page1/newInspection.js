import axios from "axios";
import { serverApi } from "../../lib/config";

// Post request for saving part of the plan information
export const postNewPlanInformation = async (planInfo) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getNewPlanInformation/`,
      planInfo,
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
    const response = await axios.post(
      `${serverApi}/api/setNewPlanSave/`,
      planData,
      {
        withCredentials: true,
      },
    );
    console.log("setNewPlan: RESPONSE:", response);
    if (response.data.RESULT === "ERROR") {
      throw new Error(response.data.CODE);
    }
    return response.data;
  } catch (error) {
    console.error("Error setting new plan:", error);
    throw error;
  }
};

export const setDeletePlan = async (plan_index) => {
  try {
    console.log("plan_index:", plan_index);
    const response = await axios.post(
      `${serverApi}/api/setDeletePlan/`,
      {
        plan_index: plan_index,
      },
      { withCredentials: true },
    );
    console.log("setDeletePlan response:", response);
    if (response.data.RESULT === "ERROR") {
      throw new Error("Something went wrong");
    }
    return response.data;
  } catch (error) {
    console.error("Error posting new plan information:", error);
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

export const getPlanCommandExcel = async (asset_group) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getPlanCommandExcel/`,
      {
        asset_group: asset_group,
      },
      {
        responseType: "blob", // Important for file downloads
        withCredentials: true, // If you're using session cookies
      },
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample.xlsx"; // Set the desired file name
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error("Error fetching asset groups:", error);
    throw error;
  }
};

export const getPlanLists = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getPlanLists/`, {
      withCredentials: true,
    });
    console.log("getPlanLists: ", response.data);

    if (response.status === 200) {
      return response.data.CODE;
    } else {
      console.error("Error fetching asset groups:", response);
      throw new Error("Failed to fetch asset groups");
    }
  } catch (error) {
    console.error("Error fetching asset groups:", error);
    throw error;
  }
};
