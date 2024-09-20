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


  export const setAssetUnActivate = async (uuid) => {
    try {
      // Send request to server to unactivate the asset
      const response = await axios.post(`${serverApi}/api/setAssetUnActivate/`, {
        ass_uuid: uuid,
      });
  
      const data = response.data;
      console.log("Data from unactivate", data);
  
      // If successful, return success
      if (data.RESULT !== "ERROR") {
        return { success: true };
      } else {
        throw new Error(`Error Code: ${data.CODE}`);
      }
    } catch (error) {
     throw error
    }
  };
  
  export const setAssetActivate = async (uuid) => {
    try {
      // Send request to server to unactivate the asset
      const response = await axios.post(`${serverApi}/api/setAssetActivate/`, {
        ass_uuid: uuid,
      });
  
      const data = response.data;
      console.log("Data from setAssetActivate", data);
  
      // If successful, return success
      if (data.RESULT !== "ERROR") {
        return { success: true };
      } else {
        throw new Error(`Error Code: ${data.CODE}`);
      }
    } catch (error) {
     throw error
    }
  };