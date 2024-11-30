<script>
  import { onMount } from "svelte";
  import {
    getLicenseInformation,
    setLicenseUpdate,
  } from "../../../services/page6/serviceArticle";
  import { errorAlert, successAlert } from "../../../shared/sweetAlert";
  import { writable } from "svelte/store";
  export let tabMenu;
  const license = writable({});

  async function handleFileUpload(event) {
    // Retrieve the selected file
    const inspectionInformation = event.target.files[0];

    // Validate file selection
    if (!inspectionInformation) {
      await errorAlert("Please select a license file!");
      return;
    }

    // Validate file type (ensure it's a .lic file)
    const fileName = inspectionInformation.name;
    if (!fileName.endsWith(".lic")) {
      await errorAlert("Invalid file type! Please upload a .lic file.");
      return;
    }

    // Create FormData for the file
    const formData = new FormData();
    formData.append("file", inspectionInformation);

    // console.log("Uploading file:");
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value.name || value}`);
    // }

    try {
      // Show a loading indicator (optional)
      let loading = true;

      // Send the file to the server
      const response = await setLicenseUpdate(formData);

      // Hide loading indicator (optional)
      loading = false;

      // Handle the server response
      if (response.RESULT === "OK") {
        await successAlert(`License file uploaded successfully: ${fileName}`);
      } else if (response.CODE) {
        await errorAlert(`Upload failed: ${response.CODE}`);
      } else {
        await errorAlert("Unexpected server response.");
      }
    } catch (err) {
      console.error("Error during file upload:", err);
      await errorAlert(err.message || "An error occurred during file upload.");
    }
  }

  // async function submitNewSystemCommand() {
  //   const formData = new FormData();
  //   formData.append("textareaContent", textareaContent);

  //   try {
  //     const response = await setLicenseUpdate(formData);
  //     if (response.RESULT === "OK") {
  //       await successAlert(response.CODE);
  //     } else {
  //       await errorAlert(response.CODE);
  //     }
  //   } catch (err) {
  //     error = err.message;
  //     await errorAlert(error);
  //   }
  // }
  // $: handleFileUpload();

  /****************************************************/
  async function getLicenseInfo() {
    try {
      const response = await getLicenseInformation();

      if (response) {
        license.set(response.CODE);
      } else {
      }
      // console.log("traceByPlan", $license);
    } catch (err) {
      alert(`Error getting asset details: ${err.message}`);
    }
  }

  onMount(() => {
    getLicenseInfo();
  });
  // Map the license object into a column string (key: value per line)
  function describeLicense(licenseObject) {
    const description = Object.entries(licenseObject)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n"); // Newline between key-value pairs
    return `{ ${description} }`; // Return the column formatted string
  }

  // Reactive variable to hold the license description
  let licenseDescription = "";

  // Reactively update licenseDescription when license data changes
  $: license.subscribe((data) => {
    licenseDescription = describeLicense(data);
  });
  /***************************************************************/
  import axios from "axios";
  import { serverApi } from "../../../lib/config";

  let selectedFile = null; // This will hold the selected file
  let fileName = null;
  // Function to handle file selection
  const handleFileSelect = (event) => {
    selectedFile = event.target.files[0]; // Capture the selected file
    // console.log("Selected file:", selectedFile);

    if (selectedFile) {
      fileName = selectedFile.name; // Store the file name
    }
  };

  // Function to upload the selected file
  const uploadLicenseFile = async () => {
    if (!selectedFile) {
      alert("라이센스 파일이 첨부되지 않았습니다."); // Custom error message for missing file
      return;
    }

    // Create FormData to send the file to the server
    const formData = new FormData();
    formData.append("license_file", selectedFile); // Attach the selected file

    // Debug: Log the FormData contents to ensure file is appended correctly
    // console.log("FormData before sending:");
    // formData.forEach((value, key) => {
    //   console.log(`${key}: ${value.name || value}`); // Log each key-value pair in FormData
    // });

    try {
      // Send the formData to the backend API
      const response = await axios.post(
        `${serverApi}/api/setLicenseUpdate/`, // API URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure the correct content type is set
          },
          withCredentials: true, // Include credentials (cookies/sessions) if needed
        },
      );

      // console.log("Response from server:", response.data);

      // Check if the response indicates success
      if (response.data.RESULT === "OK") {
        successAlert("파일이 성공적으로 업로드되었습니다."); // Success message
        fileName = null;
      }
    } catch (error) {
      // Handle any errors during the upload process
      console.error("Error during file upload:", error);
      alert(`파일 업로드 중 오류가 발생했습니다: ${error.message}`); // General error message
    }
  };
  $: getLicenseInfo();
</script>

<section class="container">
  <article class="contentArea">
    <div class="formControl noLabel">
      <textarea
        class="textarea"
        rows="10"
        readonly
        bind:value={licenseDescription}
      ></textarea>
    </div>
    <div class="formControlWrap">
      <div class="formControl">
        <div class="upload-section">
          <label for="file-upload" class="file-label">
            <span>라이센스 업데이트</span>
            <img src="./assets/images/download.svg" alt="Download icon" />
          </label>

          <!-- Hidden file input to capture file -->
          <input
            type="file"
            id="file-upload"
            accept=".lic"
            class="file-input"
            on:change={handleFileSelect}
          />

          <!-- Visible text input to display the file name -->
          <input
            type="text"
            placeholder="선택된 파일 없음"
            bind:value={fileName}
            readonly
            class="file-name-input"
          />

          <button class="upload-btn" on:click={uploadLicenseFile}>
            저장하기
          </button>
        </div>
      </div>
    </div>
  </article>
</section>

<style>
  * {
    font-size: 16px;
    box-sizing: border-box;
  }
  .file-label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .file-label span {
    font-size: 16px;
  }

  /* Hide the default file input */
  .file-input {
    display: none;
  }

  /* Style the buttons */
  .upload-btn,
  .btnSave {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 16px;
  }

  .upload-btn:hover,
  .btnSave:hover {
    background-color: #45a049;
  }

  .upload-btn:active,
  .btnSave:active {
    background-color: #388e3c;
  }
  .file-name-input {
    width: 300px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    color: #555;
    background-color: #f9f9f9;
  }
  .file-name-input[readonly] {
    background-color: #f0f0f0;
  }
  .textarea {
    font-family: "Courier New", Courier, monospace;
    font-size: 16px;
    height: fit-content;
    padding: 10px;
    color: #9197b3;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    resize: none;
    white-space: pre; /* Preserve spacing for formatted JSON */
    overflow: auto;
  }

  .textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  .contentArea {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }

  textarea {
    width: 100%;
    height: 120px;
    padding: 10px;
    font-size: 18px;
    border: 1px solid #ccc;
    color: #333;
    resize: none;
  }

  .formControlWrap {
    padding: 20px;
  }

  .upload-section {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .file-label {
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    line-height: 1.5;
    justify-content: space-between;
    width: 195px;
  }

  .btn {
    padding: 8px 16px;
  }
</style>
