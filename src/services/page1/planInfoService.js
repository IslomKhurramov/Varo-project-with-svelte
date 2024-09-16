import axios from 'axios';
import { serverApi } from '../../lib/config';

export const getAllPlanInfo = async () => {
  try {
    const response = await axios.get(`https://119.65.247.158:9001/api/getAllPlanLists/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plan info:', error);
    throw error;
  }
};
