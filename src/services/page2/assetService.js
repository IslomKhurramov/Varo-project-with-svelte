import axios from "axios";
import { serverApi } from "../../lib/config";

/****************ASSET DATA LIST***************** */
export const getAllAssetLists = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getAllAssetLists/`);
    console.log("Service", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching getAllAssetLists :", error);
    throw error;
  }
};

export const setAssetUnActivate = async (uuid) => {
  try {
    // Send request to server to unactivate the asset
    const response = await axios.post(`${serverApi}/api/setAssetUnActivate/`, {
      ass_uuid: uuid,
    });

    const data = response.data;
    console.log("Data from unactivate", data);

    // If successful, return success
    if (data.RESULT !== "ERROR") {
      return { success: true };
    } else {
      throw new Error(`Error Code: ${data.CODE}`);
    }
  } catch (error) {
    throw error;
  }
};

export const setAssetActivate = async (uuid) => {
  try {
    // Send request to server to unactivate the asset
    const response = await axios.post(`${serverApi}/api/setAssetActivate/`, {
      ass_uuid: uuid,
    });

    const data = response.data;
    console.log("Data from setAssetActivate", data);

    // If successful, return success
    if (data.RESULT !== "ERROR") {
      return { success: true };
    } else {
      throw new Error(`Error Code: ${data.CODE}`);
    }
  } catch (error) {
    throw error;
  }
};

/***********CREATE ASSET GROUP*************** */
export const getAssetGroup = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getAssetGroup/`);
    console.log("assetGroups:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching getAllAssetLists :", error);
    throw error;
  }
};

export const setNewAssetGroup = async (asset_group_name) => {
  try {
    // Send request to server to unactivate the asset
    const response = await axios.post(`${serverApi}/api/setNewAssetGroup/`, {
      asset_group_name: asset_group_name,
    });

    const data = response.data;
    console.log(" setNewAssetGroup", data);

    // If successful, return success
    if (data.RESULT !== "ERROR") {
      return { success: true };
    } else {
      throw new Error(`Error Code: ${data.CODE}`);
    }
  } catch (error) {
    throw error;
  }
};

/**ASSET DETAIL INFORMATION */

export const getDetailInformationOfAsset = async (uuid) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getDetailInformationOfAsset/`,
      {
        asset_uuid: uuid,
      },
    );

    if (response.data.RESULT === "OK") {
      return response.data.CODE; // Return the data from the API
    } else {
      throw new Error(
        `Error Code on getDetailInformationOfAsset: ${response.data.CODE}`,
      );
    }
  } catch (error) {
    throw new Error(`Failed to fetch asset detail: ${error.message}`);
  }
};
/******ASSET GROUP CHANGE***** */

export const setAssetGroupChange = async (
  uuid,
  current_group_index,
  next_group_index,
) => {
  try {
    const response = await axios.post(`${serverApi}/api/setAssetGroupChange/`, {
      ass_uuid: uuid,
      current_group_index: current_group_index,
      next_group_index: next_group_index,
    });

    if (response.data.RESULT === "OK") {
      return { success: true }; // Return the data from the API
    } else {
      throw new Error(
        `Error Code on setAssetGroupChange: ${response.data.CODE}`,
      );
    }
  } catch (error) {
    throw new Error(`Failed to fetch asset detail: ${error.message}`);
  }
};

/************* ASSET INFORMATION UPDATE*************** */
export const setAssetInformationUpdate = async (assetInfo) => {
  try {
    const {
      ass_uuid,
      ast_group,
      ast_code,
      ast_usage,
      ast_model,
      ast_brand,
      ast_os,
      ast_ostype,
      ast_application,
      ast_version,
      ast_url,
      ast_hostname,
      ast_real_hostname,
      ast_macaddress,
      ast_ipaddr,
      ast_ipaddrs,
      ast_real_ipaddr,
      ast_location,
      ast_manager_team,
      ast_manager_person,
      ast_operator_team,
      ast_operator_person,
      ast_operator_phone,
      ast_isms_target,
      ast_confidentiality,
      ast_integrity,
      ast_availability,
      ast_security_point,
      ast_security_level,
      ast_etc,
      ast_approve_status,
      ast_activate,
      ast_agent_installed,
    } = assetInfo;
    const response = await axios.post(
      `${serverApi}/api/setAssetInformationUpdate/`,
      {
        ass_uuid,
        ast_group,
        ast_code,
        ast_usage,
        ast_model,
        ast_brand,
        ast_os,
        ast_ostype,
        ast_application,
        ast_version,
        ast_url,
        ast_hostname,
        ast_real_hostname,
        ast_macaddress,
        ast_ipaddr,
        ast_ipaddrs,
        ast_real_ipaddr,
        ast_location,
        ast_manager_team,
        ast_manager_person,
        ast_operator_team,
        ast_operator_person,
        ast_operator_phone,
        ast_isms_target,
        ast_confidentiality,
        ast_integrity,
        ast_availability,
        ast_security_point,
        ast_security_level,
        ast_etc,
        ast_approve_status,
        ast_activate,
        ast_agent_installed,
      },
    );

    if (response.data.RESULT === "OK") {
      return { success: true }; // Return the data from the API
    } else {
      console.error(`API Error:`, response.data); // Log the full response for debugging
      throw new Error(
        `Error Code on setAssetInformationUpdate: ${response.data.CODE}`,
      );
    }
  } catch (error) {
    throw new Error(`Failed to fetch asset detail: ${error.message}`);
  }
};

/******setAssetRegisterChange****************** */

export const setAssetRegisterChange = async (uuid, approve_status) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setAssetRegisterChange/`,
      {
        asset_uuid: uuid,
        approve_status: approve_status,
      },
    );

    if (response.data.RESULT === "OK") {
      return response.data; // Return the data from the API
    } else {
      throw new Error(
        `Error Code on setAssetRegisterChange: ${response.data.CODE}`,
      );
    }
  } catch (error) {
    throw new Error(`Failed to fetch asset detail: ${error.message}`);
  }
};
/****** get TARGET SYSTEMLIST *******************/
export const getTargetSystemLists = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/getTargetSystemLists/`);
    console.log("assetGroups:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching getAllAssetLists :", error);
    throw error;
  }
};
export const setAssetTargetRegister = async (ass_uuid, targets) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/setAssetTargetRegister/`,
      {
        asset_uuid: ass_uuid,
        targets: targets,
      },
    );

    console.log("API response:", response.data);

    if (response.data && response.data.RESULT === "OK") {
      return response.data;
    } else {
      throw new Error(
        `Error Code on setAssetTargetRegister: ${response.data.CODE}`,
      );
    }
  } catch (error) {
    console.error(
      "Error in setAssetTargetRegister:",
      error.response ? error.response.data : error.message,
    );
    throw new Error(`Failed to register asset target: ${error.message}`);
  }
};
/*********************************************************************************** */

export const getAssetRegisterStatus = async (current_day) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/getAssetRegisterStatus/`,
      {
        curr_day: current_day,
      },
    );

    if (response.data.RESULT === "OK") {
      return response.data; // Return the data from the API
    } else {
      throw new Error(
        `Error Code on getAssetRegisterStatus: ${response.data.CODE}`,
      );
    }
  } catch (error) {
    throw new Error(`Failed to fetch asset detail: ${error.message}`);
  }
};
/**************************************************************************** */

export const setAssetForNewGroup = async (addingAssetForm) => {
  try {
    const {
      asset_reg_how,
      existed_asset_group_index,
      target_group_index,
      asset_file,
      asset_lists,
    } = addingAssetForm;
    console.log("api data: ", addingAssetForm);

    // Create FormData object for multipart/form-data
    const formData = new FormData();

    // Append the form data fields
    formData.append("asset_reg_how", asset_reg_how);
    formData.append("existed_asset_group_index", existed_asset_group_index);
    formData.append("target_group_index", target_group_index);

    // Append the file only if it exists (you can omit null fields)
    if (asset_file) {
      formData.append("asset_file", asset_file); // Assuming asset_file is a File object
    }

    // Loop through asset_lists array and append each item individually
    asset_lists.forEach((asset) => {
      formData.append("asset_lists[]", asset); // Correct way to append arrays in FormData
    });

    // Send the request using axios
    const response = await axios.post(
      `${serverApi}/api/setAssetForNewGroup/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Set the proper Content-Type
        },
      },
    );

    // Handle the API response
    if (response.data.RESULT === "OK") {
      return { success: true }; // Return success if response is OK
    } else {
      console.log("API ERROR:", response.data);
      return { success: false, message: response.data.CODE };
    }
  } catch (error) {
    console.error("API Request Error:", error); // Log any errors
    throw error;
  }
};
