import axios from "axios";
import CryptoJS from "crypto-js";
import { serverApi } from "../../lib/config";

export const getUserExist = async (user_email) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getUserExist/`,
      {
        user_email: user_email,
      },
      {
        withCredentials: true,
      },
    );

    console.log("getUserExist:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getUserExist:", error);
    throw error;
  }
};

export const setPasswordReset = async (user_email) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setPasswordReset/`,
      {
        user_email: user_email,
      },
      {
        withCredentials: true,
      },
    );

    console.log("setPasswordReset:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error setPasswordReset:", error);
    throw error;
  }
};

export const getUserName = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getUserName/`, {
      withCredentials: true,
    });

    console.log("getUserName:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.CODE;
  } catch (error) {
    console.error("Error getUserName:", error);
    throw error;
  }
};

export const getUserAllMessages = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getUserAllMessages/`, {
      withCredentials: true,
    });

    console.log("getUserAllMessages:", response);

    if (response?.data?.RESULT == "ERROR") throw new Error(response.data?.CODE);

    return response.data?.ALRAM;
  } catch (error) {
    console.error("Error getUserAllMessages:", error);
    throw error;
  }
};

export function decryptData(encryptedString) {
  const AES_ENCRYPT_KEY = "oingisprettyintheworld1234567890".slice(0, 32);
  const IV = CryptoJS.enc.Utf8.parse("\0".repeat(16));
  try {
    const ciphertext = CryptoJS.enc.Base64.parse(encryptedString);
    const bytes = CryptoJS.AES.decrypt(
      { ciphertext },
      CryptoJS.enc.Utf8.parse(AES_ENCRYPT_KEY),
      { iv: IV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 },
    );
    return bytes.toString(CryptoJS.enc.Utf8); // Return the decrypted text
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}
