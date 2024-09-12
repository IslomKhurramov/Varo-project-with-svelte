import axios from "axios";
import { serverApi } from "../../lib/config";

export const getPlanDetailInformation = async (index) => {
  try {
    const response = await axios.get(`${serverApi}/getPlanDetailInformation/${index}`);
    

    if (response.status !== 200) {
      throw new Error(`Failed to fetch project details. Status code: ${response.status}`);
    }

    // Log the full response for debugging
    console.log('Full response:', response);

    return response.data;
  } catch (error) {
    console.error('Error fetching plan info:', error);
    throw error;
  }
};