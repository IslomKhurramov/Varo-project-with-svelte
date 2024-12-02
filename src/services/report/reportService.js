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

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    throw error;
  }
};

export const setMakeExcelWordFullReport = async (data) => {
  try {
    console.log("data:", data);
    if (data.plan_index) data.plan_index = String(data.plan_index);

    const response = await axios.post(
      `${serverApi}/api/setMakeExcelWordFullReport/`,
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

export const setPlanSummaryReportCreate = async (plan_index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setPlanSummaryReportCreate/`,
      {
        plan_index: plan_index,
      },
      {
        responseType: "blob",
        withCredentials: true,
      },
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "요약 보고서생성.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    throw error;
  }
};
