import axios from "axios";
import { serverApi } from "../../lib/config";

export const getCCEResultUploadStatus = async (plan_index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getCCEResultUploadStatus/`,
      {
        plan_index: plan_index,
      },
      {
        withCredentials: true,
      },
    );

    if (response?.data?.RESULT == "ERROR")
      throw new Error(response?.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getCCEResultUploadStatus:", error);
    throw error;
  }
};

export const getUploadedResultErrors = async (plan_index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getUploadedResultErrors/`,
      {
        plan_index: plan_index,
      },
      {
        withCredentials: true,
      },
    );

    if (response?.data?.RESULT == "ERROR")
      throw new Error("Something went wrong!");

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getUploadedResultErrors:", error);
    throw error;
  }
};

export const getViewPlanResults = async (search) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getViewPlanResults/`,
      search,
      {
        withCredentials: true,
      },
    );

    if (response?.data?.RESULT == "ERROR")
      throw new Error("Something went wrong!");

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getViewPlanResults:", error);
    throw error;
  }
};

export const setUploadPlanResult = async (data) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setUploadPlanResult/`,
      data,
      {
        withCredentials: true,
      },
    );

    console.log("setUploadPlanResult RESPONSE:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error setUploadPlanResult:", error);
    throw error;
  }
};

export const getViewPlanResultSearch = async () => {
  try {
    const response = await axios.get(
      `${serverApi}/api/getViewPlanResultsSearch/`,
      {
        withCredentials: true,
      },
    );

    console.log("getViewPlanResultsSearch RESPONSE:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getViewPlanResultsSearch:", error);
    throw error;
  }
};

export const setResultChanged = async (data) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setResultChanged/`,
      data,
      {
        withCredentials: true,
      },
    );

    console.log("setResultChanged RESPONSE:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error setResultChanged:", error);
    throw error;
  }
};

export const setSpecificItemResultsChange = async (data) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setSpecificItemResultsChange/`,
      data,
      {
        withCredentials: true,
      },
    );

    console.log("setSpecificItemResultsChange RESPONSE:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error setSpecificItemResultsChange:", error);
    throw error;
  }
};

export const setFinalPlanSecurityPoint = async (plan_index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setFinalPlanSecurityPoint/`,
      {
        plan_index: plan_index,
      },
      {
        withCredentials: true,
      },
    );

    console.log("setFinalPlanSecurityPoint RESPONSE:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error setFinalPlanSecurityPoint:", error);
    throw error;
  }
};

export const getResultUploadStatus = async (plan_index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getResultUploadStatus/`,
      {
        plan_index: plan_index,
      },
      {
        withCredentials: true,
      },
    );

    console.log("getResultUploadStatus RESPONSE:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getResultUploadStatus:", error);
    throw error;
  }
};
