import axios from 'axios';
import { serverApi } from '../../lib/config';

export const getAllAssetLists = async () => {
    try {
      const response = await axios.get(`${serverApi}/api/getAllAssetLists/`);
      console.log("Service", response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching getAllAssetLists :', error);
      throw error;
    }
  };