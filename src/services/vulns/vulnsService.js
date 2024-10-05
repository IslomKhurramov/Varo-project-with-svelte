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
