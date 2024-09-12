import axios from "axios";
import { serverApi } from "../../lib/config";

export const login = async (email, password) => {
  try {
    const formData = new FormData();
    formData.append("user_email", email);
    formData.append("user_pw", password);

    const response = await axios.post(`${serverApi}/api/setLogin/`, formData, {
      withCredentials: true,
    });
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
      `${serverApi}/setRegisterNewMember/`,
      name,
      email,
      password,
      department,
      { withCredentials: true }
    );
    const data = response.data;

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, message: data.message }; // Error message from server
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
