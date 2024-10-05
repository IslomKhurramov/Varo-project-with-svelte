import axios from "axios";
import { serverApi } from "../../lib/config";

export const getUserExist = async (user_email) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getUserExist/`,
      {
        user_email: user_email,
      },
      {
        withCredentials: true,
      },
    );

    console.log("getUserExist:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getUserExist:", error);
    throw error;
  }
};

export const setPasswordReset = async (user_email) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setPasswordReset/`,
      {
        user_email: user_email,
      },
      {
        withCredentials: true,
      },
    );

    console.log("setPasswordReset:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error setPasswordReset:", error);
    throw error;
  }
};

export const getUserName = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getUserName/`, {
      withCredentials: true,
    });

    console.log("getUserName:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getUserName:", error);
    throw error;
  }
};
