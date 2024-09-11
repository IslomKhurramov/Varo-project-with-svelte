import axios from 'axios';
import { serverApi } from "../lib/config";

// Function to check if the user is authenticated
export const checkSession = async () => {
  try {
    const response = await axios.get(`${serverApi}/getUserExist`, {
      withCredentials: true,  // Ensure session cookie is sent
    });

    console.log("CHECK SESSION RESPONSE::", response);

    if (response.status === 200 && response.data.isAuthenticated) {
      // If the session is valid, return the authenticated state and user info
      return { isAuthenticated: true, user: response.data.user };
    } else {
      return { isAuthenticated: false };
    }
  } catch (error) {
    console.error("Error checking session:", error);
    return { isAuthenticated: false };  // Return false if an error occurs
  }
};
