import axios from "axios";
import { serverApi } from "../../lib/config";

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// 시스템기본설정 API request part ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
export const getSystemBasicSetup = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getSystemBasicSetup/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const setSystemBasicSetup = async ({
  server_ipaddr,
  server_port,
  connection_interval,
  mailserver_ip,
  mailserver_port,
  mailserver_id,
  mailserver_pw,
  high_level_point,
  medium_level_point,
  low_level_point,
}) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setSystemBasicSetup/`,
      {
        server_ipaddr,
        server_port,
        connection_interval,
        mailserver_ip,
        mailserver_port,
        mailserver_id,
        mailserver_pw,
        high_level_point,
        medium_level_point,
        low_level_point,
      },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(data.CODE);
    }
  } catch (error) {
    throw error;
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// 공지사항 and 자료실 API request part ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
export const getAllArticles = async ({ page, limit, category }) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getAllArticles/`,
      {
        page,
        limit,
        category,
      },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(data.CODE);
    }
  } catch (error) {
    throw error;
  }
};

export const getArticleDetail = async (art_index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getArticleDetail/`,
      {
        art_index: art_index,
      },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(data.CODE);
    }
  } catch (error) {
    throw error;
  }
};

export const createArticle = async (formData) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/createArticle/`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(
        data.MESSAGE || "An error occurred while creating the article.",
      );
    }
  } catch (error) {
    throw error;
  }
};

export const updateArticle = async (formData) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/updateArticle/`,
      formData,
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(data.CODE);
    }
  } catch (error) {
    throw error;
  }
};

export const deleteArticle = async ({ art_index }) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/deleteArticle/`,
      { art_index },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(data.CODE);
    }
  } catch (error) {
    throw error;
  }
};

export const downloadArticleFile = async (file_path, file_name) => {
  try {
    const response = await axios({
      url: `${serverApi}/media/${file_path}`,
      method: "GET",
      responseType: "blob", // Important! Set the response type to blob
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = file_name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Clean up the blob URL
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// 사용자관리 API request part ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

export const getUserLists = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getUserLists/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const setPasswordUpdate = async ({
  user_index,
  user_curr_pass,
  user_new_pass1,
  user_new_pass2,
}) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setPasswordUpdate/`,
      {
        user_index,
        user_curr_pass,
        user_new_pass1,
        user_new_pass2,
      },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(data.CODE);
    }
  } catch (error) {
    throw error;
  }
};

export const setUserDelete = async (user_index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setUserDelete/`,
      { user_index: user_index },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(data.CODE);
    }
  } catch (error) {
    throw error;
  }
};

export const setUserActivate = async (user_index, user_activate) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setUserActivate/`,
      {
        user_index: user_index,
        user_activate: user_activate,
      },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(data.CODE || "Unknown error");
    }
  } catch (error) {
    throw error;
  }
};

export const setUserUpdate = async ({
  user_index,
  user_name,
  user_email,
  user_depart,
  user_level,
}) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setUserUpdate/`,
      {
        user_index,
        user_name,
        user_email,
        user_depart,
        user_level,
      },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(data.CODE);
    }
  } catch (error) {
    throw error;
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// 로그분석 API request part ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

export const setLicenseUpdate = async (formData) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setLicenseUpdate/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct content type
        },
        withCredentials: true, // Include credentials (cookies/sessions) if needed
      },
    );
    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(data.CODE);
    }
  } catch (error) {
    throw error;
  }
};

export const getLicenseInformation = async () => {
  try {
    const response = await axios.get(
      `${serverApi}/api/getLicenseInformation/`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// 프로그램관리 API request part ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

export const getProgramList = async (params) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getProgramList/`,
      params,
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    if (data.RESULT === "OK") {
      return data;
    } else {
      throw new Error(data.CODE || "Unknown error from backend");
    }
  } catch (error) {
    console.error("Error in getProgramList API:", error.message);
    throw error;
  }
};
