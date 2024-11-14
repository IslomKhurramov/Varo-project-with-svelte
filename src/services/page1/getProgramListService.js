import axios from "axios";
import { serverApi } from "../../lib/config";

// Post request for saving part of the plan information
export const getProgramList = async (
  order_usage,
  order_version,
  order_cdate,
  page_count,
  list_count,
) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getProgramList/`,
      {
        order_usage: order_usage,
        order_version: order_version,
        order_cdate: order_cdate,
        page_count: page_count,
        list_count: list_count,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Post request for saving part of the plan information
export const getTargetList = async (plan_index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getTargetLists/`,
      {
        plan_index: plan_index,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const manualDownload = async (target, ccp_index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getDownloadManualProgram/`,
      {
        target: target,
        ccp_index: ccp_index,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
