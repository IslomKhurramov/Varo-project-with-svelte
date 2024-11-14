import axios from "axios";
import { serverApi } from "../../lib/config";

// Post request for saving part of the plan information
export const postNewPlanInformation = async (planInfo) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getNewPlanInformation/`,
      planInfo,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
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
    if (response.data.RESULT === "ERROR") {
      throw new Error(response.data.CODE);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const setPlanChange = async (data) => {
  try {
    const response = await axios.post(`${serverApi}/api/setPlanChange/`, data, {
      withCredentials: true,
    });
    if (response.data.RESULT === "ERROR") {
      throw new Error(response.data.CODE);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const setNewSystemCommand = async (data) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setNewSystemCommand/`,
      data,
      {
        withCredentials: true,
      },
    );
    if (response.data.RESULT === "ERROR") {
      throw new Error(response.data.CODE);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const setDeletePlan = async (plan_index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setDeletePlan/`,
      {
        plan_index: plan_index,
      },
      { withCredentials: true },
    );
    if (response.data.RESULT === "ERROR") {
      throw new Error("Something went wrong");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAssetGroups = async () => {
  try {
    const response = await axios.get(`${serverApi}/getAssetGroups/`, {
      withCredentials: true,
    });

    if (response.status === 200) {
      // Check if the response is OK
      return response.data; // Return the data if successful
    } else {
      throw new Error("Failed to fetch asset groups");
    }
  } catch (error) {
    throw error; // Re-throw the error for the calling function to handle
  }
};

export const getOptionsForNewPlan = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getOptionsForNewPlan/`, {
      withCredentials: true,
    });

    if (response.status === 200) {
      // Check if the response is OK
      return response.data.CODE; // Return the data if successful
    } else {
      throw new Error("Failed to fetch asset groups");
    }
  } catch (error) {
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
    throw error;
  }
};

export const getPlanLists = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getPlanLists/`, {
      withCredentials: true,
    });

    if (response.status === 200) {
      return response.data.CODE;
    } else {
      throw new Error("Failed to fetch asset groups");
    }
  } catch (error) {
    throw error;
  }
};
