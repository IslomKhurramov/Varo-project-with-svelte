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

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
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

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
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

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
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

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
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

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
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

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    throw error;
  }
};
