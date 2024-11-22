import axios from "axios";
import { serverApi } from "../../lib/config";

export const getAllCheckList = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getAllCheckList/`, {
      withCredentials: true,
    });
    console.log("response", response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const setNewChecklistGroup = async (
  checklist_index,
  new_checklist_name,
) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setNewChecklistGroup/`,
      {
        source_chk: checklist_index,
        destion_name: new_checklist_name,
      },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return { success: true };
    } else {
      throw new Error(data.CODE);
    }
  } catch (error) {
    throw error;
  }
};

export const setDeleteChecklistGroup = async (checklist_index) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setDeleteChecklistGroup/`,
      {
        checklist_group_no: checklist_index,
      },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return { success: true };
    } else {
      throw new Error(data.CODE); // Log the error code from the backend
    }
  } catch (error) {
    throw error;
  }
};

export const setUpdateGroupName = async (
  checklist_index,
  new_checklist_name,
) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setUpdateGroupName/`,
      {
        checklist_group_no: checklist_index,
        checklist_new_group_name: new_checklist_name,
      },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return { success: true };
    } else {
      throw new Error(data.CODE); // Log the error code from the backend
    }
  } catch (error) {
    throw error;
  }
};

export const getChecklistItemBySearch = async (
  ccg_index,
  category,
  item_no,
  riskLevel,
) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getChecklistItemBySearch/`,
      {
        checklist_group: ccg_index,
        assessment_target: category,
        checklist_item_id: item_no,
        item_security_level: riskLevel,
      },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(data.CODE); // Log the error code from the backend
    }
  } catch (error) {
    throw error;
  }
};

export const setDeleteChecklistItem = async (ccg_index, ccc_indexes) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setDeleteChecklistItem/`,
      {
        checklist_group_no: ccg_index,
        selected_items: ccc_indexes,
      },
      {
        withCredentials: true,
      },
    );

    const data = response.data;

    if (data.RESULT !== "ERROR") {
      return { success: true };
    } else {
      throw new Error(data.CODE); // Log the error code from the backend
    }
  } catch (error) {
    throw error;
  }
};

/************************************************** */
