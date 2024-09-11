import axios from "axios";
import { serverApi } from "../../lib/config";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${serverApi}/setLogin/`,
      email, password,{ withCredentials:true}
    );
    const data = response.data;

    if (response.status === 200) { 
      return { success: true, token: data.token };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};


export const register = async (name, email, password, department) => {
    try {
      const response = await axios.post(`${serverApi}/setRegisterNewMember/`, 
        name, email, password, department, {withCredentials:true});
      const data = response.data;
  
      if (response.status === 200) { 
        return { success: true };
      } else {
        return { success: false, message: data.message }; // Error message from server
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };