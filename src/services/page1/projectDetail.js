import axios from "axios";
import { navigate } from "svelte-routing";
import { serverApi } from "../../lib/config";
export const getPlanDetailInformation = async (index) => {
  try {
    const response = await axios.get(`${serverApi}/getPlanDetailInformation/${index}`, {
      withCredentials: true,  // Ensures cookies are sent with the request
    });

    // Check if we received HTML instead of JSON (which likely means the login page)
    if (response.headers['content-type'] && response.headers['content-type'].includes('text/html')) {
      throw new Error('Received an HTML response, possibly a login page.');
    }

    // Ensure that the response was successful and contains JSON
    if (response.status !== 200) {
      throw new Error(`Failed to fetch project details. Status code: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    // If the error is related to authentication, redirect to login
    if (error.message.includes('login page')) {
      navigate('/login');  // Redirect the user to the login page
    }

    console.error('Error fetching plan info:', error);
    throw error;  // Throw the error so the calling component can handle it
  }
};
