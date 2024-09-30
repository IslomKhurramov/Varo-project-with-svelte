import axios from "axios";
import { serverApi } from "../../lib/config";

export const getPlanReportLists = async (plan_index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getPlanReportLists/`,
      {
        plan_index: plan_index,
      },
      {
        withCredentials: true,
      },
    );

    console.log("getPlanReportLists:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getPlanReportLists:", error);
    throw error;
  }
};

export const setMakeExcelWordFullReport = async (data) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setMakeExcelWordFullReport/`,
      data,
      {
        withCredentials: true,
      },
    );

    console.log("setMakeExcelWordFullReport:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error setMakeExcelWordFullReport:", error);
    throw error;
  }
};
