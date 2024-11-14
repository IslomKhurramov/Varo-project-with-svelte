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
////////////////////////// 공지사항 and 사용자관리 API request part ///////////////////////////////////////
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
