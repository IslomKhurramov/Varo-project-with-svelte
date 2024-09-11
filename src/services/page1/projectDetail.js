import axios from "axios";
import { serverApi } from "../../lib/config";

export const getPlanDetailInformation = async () => {
    try {
      const response = await axios.get(`${serverApi}/getPlanDetailInformation/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching plan info:', error);
      throw error;
    }
  };
  