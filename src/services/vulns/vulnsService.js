import axios from "axios";
import { serverApi } from "../../lib/config";

export const getVulnsOfPlan = async (data = undefined) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getVulnsOfPlan/`,
      data,
      {
        withCredentials: true,
      },
    );

    console.log("getVulnsOfPlan RESPONSE:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getVulnsOfPlan:", error);
    throw error;
  }
};

export const getVulnsOfAsset = async (data) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getVulnsOfAsset/`,
      data,
      {
        withCredentials: true,
      },
    );

    console.log("getVulnsOfAsset RESPONSE:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getVulnsOfAsset:", error);
    throw error;
  }
};

export const setFixPlanRegister = async (data) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setFixPlanRegister/`,
      data,
      {
        withCredentials: true,
      },
    );

    console.log("setFixPlanRegister RESPONSE:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error setFixPlanRegister:", error);
    throw error;
  }
};

export const setFixApprove = async (data) => {
  try {
    const response = await axios.post(`${serverApi}/api/setFixApprove/`, data, {
      withCredentials: true,
    });

    console.log("setFixApprove RESPONSE:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error setFixApprove:", error);
    throw error;
  }
};

export const setFixDoneApprove = async (data) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setFixDoneApprove/`,
      data,
      {
        withCredentials: true,
      },
    );

    console.log("setFixDoneApprove RESPONSE:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error setFixDoneApprove:", error);
    throw error;
  }
};

export const getVulnsFixWay = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getVulnsFixWay/`, {
      withCredentials: true,
    });

    console.log("getVulnsFixWay RESPONSE:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getVulnsFixWay:", error);
    throw error;
  }
};

export const getFixHistoryOfItem = async (data) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getFixHistoryOfItem/`,
      data,
      {
        withCredentials: true,
      },
    );

    console.log("getFixHistoryOfItem RESPONSE:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getFixHistoryOfItem:", error);
    throw error;
  }
};

export const getFixDoneLists = async (data) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getFixDoneLists/`,
      data,
      {
        withCredentials: true,
      },
    );

    console.log("getFixDoneLists RESPONSE:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getFixDoneLists:", error);
    throw error;
  }
};
