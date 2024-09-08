import axios from 'axios';

export const getAllPlanInfo = async () => {
  try {
    const response = await axios.get('http://localhost:8010/proxy/asset/api/getAllPlanInfo/');
    return response.data;
  } catch (error) {
    console.error('ERR:::', error);
    throw error;
  }
};
