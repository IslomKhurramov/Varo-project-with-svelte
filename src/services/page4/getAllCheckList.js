import axios from 'axios';
import { serverApi } from '../../lib/config';

export const getAllCheckList = async () => {
  try {
    const response = await axios.get(`https://119.65.247.158:9001/api/getAllCheckList/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plan info:', error);
    throw error;
  }
};

export const setNewChecklistGroup = async () => {
  try {
    const response = await axios.get(`https://119.65.247.158:9001/api/setNewChecklistGroup/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plan info:', error);
    throw error;
  }
};
