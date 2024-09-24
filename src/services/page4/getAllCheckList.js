import axios from "axios";
import { serverApi } from "../../lib/config";

export const getAllCheckList = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getAllCheckList/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching plan info:", error);
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
    );

    const data = response.data;

    console.log("NEW checklist:response =>", response);

    if (data.RESULT !== "ERROR") {
      return { success: true };
    } else {
      throw new Error(data.CODE);
    }
  } catch (error) {
    console.error("Error setNewChecklistGroup:", error);
    throw error;
  }
};

export const setDeleteChecklistGroup = async (checklist_index) => {
  try {
    console.log(`Attempting to delete checklist with ID: ${checklist_index}`);

    const response = await axios.post(
      `${serverApi}/api/setDeleteChecklistGroup/`,
      {
        checklist_group_no: checklist_index,
      },
    );

    const data = response.data;

    console.log("API delete Response:", data); // Log response for debugging

    if (data.RESULT !== "ERROR") {
      return { success: true };
    } else {
      throw new Error(data.CODE); // Log the error code from the backend
    }
  } catch (error) {
    console.error("Error setDeleteChecklistGroup:", error); // Log error for debugging
    throw error;
  }
};

export const setUpdateGroupName = async (
  checklist_index,
  new_checklist_name,
) => {
  try {
    const response = await axios.post(`${serverApi}/api/setUpdateGroupName/`, {
      checklist_group_no: checklist_index,
      checklist_new_group_name: new_checklist_name,
    });

    const data = response.data;

    console.log("API edit Response:", data); // Log response for debugging

    if (data.RESULT !== "ERROR") {
      return { success: true };
    } else {
      throw new Error(data.CODE); // Log the error code from the backend
    }
  } catch (error) {
    console.error("Error setUpdateGroupName:", error); // Log error for debugging
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
    );

    const data = response.data;

    console.log("API Search Response:", data); // Log response for debugging

    if (data.RESULT !== "ERROR") {
      return data;
    } else {
      throw new Error(data.CODE); // Log the error code from the backend
    }
  } catch (error) {
    console.error("Error getChecklistItemBySearch:", error); // Log error for debugging
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
    );

    const data = response.data;

    console.log("API setDeleteChecklistItem Response:", data); // Log response for debugging

    if (data.RESULT !== "ERROR") {
      return { success: true };
    } else {
      throw new Error(data.CODE); // Log the error code from the backend
    }
  } catch (error) {
    console.error("Error setDeleteChecklistItem:", error); // Log error for debugging
    throw error;
  }
};
