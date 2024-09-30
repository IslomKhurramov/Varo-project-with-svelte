import axios from "axios";
import { serverApi } from "../../lib/config";

export const getAuditNLog = async (search) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getAuditNLog/`,
      search,
      {
        withCredentials: true,
      },
    );

    console.log("getAuditNLog response:", response);

    if (response?.data?.RESULT == "ERROR")
      throw new Error("Something went wrong!");

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getAuditNLog:", error);
    throw error;
  }
};

export const getPlanFilter = async (search) => {
  try {
    const response = await axios.get(`${serverApi}/api/getPlanFilter/`, {
      withCredentials: true,
    });

    console.log("getPlanFilter response:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getPlanFilter:", error);
    throw error;
  }
};
