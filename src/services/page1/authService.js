import axios from "axios";
import { serverApi } from "../../lib/config";

export const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setLogin/`,
      {
        user_email: email,
        user_pw: password,
      },
      {
        withCredentials: true,
      },
    );
    const data = response.data;

    console.log("login: response =>", response);

    if (data.RESULT !== "ERROR") {
      return { success: true };
    } else {
      throw new Error(data.CODE);
    }
  } catch (error) {
    throw error;
  }
};

export const register = async (name, email, password, department) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setRegisterNewMember/`,
      {
        user_email: email,
        user_pw: password,
        user_name: name,
        user_depart: department,
        user_rolltype: 1,
      },
      { withCredentials: true },
    );
    const data = response.data;

    console.log("login: response =>", response);

    if (data.RESULT !== "ERROR") {
      return { success: true };
    } else {
      throw new Error(data.CODE);
    }
  } catch (error) {
    throw error;
  }
};
