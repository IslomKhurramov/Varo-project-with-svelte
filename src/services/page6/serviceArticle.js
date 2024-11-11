import axios from "axios";
import { serverApi } from "../../lib/config";

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
      return data; // Ma'lumotni qaytarish
    } else {
      throw new Error(data.CODE);
    }
  } catch (error) {
    throw error;
  }
};
