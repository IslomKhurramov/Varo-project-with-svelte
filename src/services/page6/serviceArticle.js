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

export const createArticle = async ({ title, content, category, file }) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (file) formData.append("file", file); // Add file if it exists

    const response = await axios.post(
      `${serverApi}/api/createArticle/`,
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

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// 사용자관리 API request part ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

export const setLicenseUpdate = async (formData) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setLicenseUpdate/`,
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
////////////////////////// 사용자관리 API request part ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

export const getProgramList = async (params) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getProgramList/`,
      params, // Parametrlar obyekt sifatida yuboriladi
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
