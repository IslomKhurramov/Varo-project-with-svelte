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

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
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

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
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

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    throw error;
  }
};

export const setFixApprove = async (data) => {
  try {
    const response = await axios.post(`${serverApi}/api/setFixApprove/`, data, {
      withCredentials: true,
    });

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
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

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    throw error;
  }
};

export const getVulnsFixWay = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getVulnsFixWay/`, {
      withCredentials: true,
    });

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
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

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
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

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    throw error;
  }
};

export const setFixDoneRegister = async (data) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setFixDoneRegister/`,
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

export const getFixEviDownload = async (cfr_index, filename) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getFixEviDownload/`,
      {
        cfr_index: cfr_index,
      },
      {
        responseType: "blob",
        withCredentials: true,
      },
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw error;
  }
};
