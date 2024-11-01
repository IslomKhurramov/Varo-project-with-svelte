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

    if (response?.data?.RESULT == "ERROR")
      throw new Error("Something went wrong!");

    return response.data?.CODE;
  } catch (error) {
    throw error;
  }
};

export const getPlanFilter = async (search) => {
  try {
    const response = await axios.get(`${serverApi}/api/getPlanFilter/`, {
      withCredentials: true,
    });

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    throw error;
  }
};
