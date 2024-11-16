<script>
  import { serverApi } from "../../lib/config";
  import { dataArray } from "../../services/page7/trace.store";
  import { errorAlert, successAlert } from "../../shared/sweetAlert";
  // export let selectPageMain;
  let filteredProjects = [];

  let itemsPerPage = 5;
  let currentPage = 1;
  let totalItems = $dataArray.length;
  let totalPages = Math.ceil(totalItems / itemsPerPage);

  $: paginatedData = $dataArray.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  let maxPageNumbers = 5;

  $: pages = [];
  $: {
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(1, endPage - maxPageNumbers + 1);
    }

    pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  const selectPage = (page, menu) => {
    currentPage = page;
    tabMenu = menu;
  };

  function downloadCSV() {
    const csvRows = [];
    const headers = Object.keys(filteredProjects[0]);
    csvRows.push(headers.join(",")); // Add headers

    for (const row of filteredProjects) {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '\\"'); // Escape quotes
        return `"${escaped}"`; // Wrap in quotes
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create a link to download the file
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "table_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**********************************************/
  let selectedFiles = {}; // Use an object to store files for each row
  let fileNames = {}; // Use an object to store file names for each row

  // Handle file selection
  function handleFileSelect(event, type) {
    const file = event.target.files[0];
    if (file) {
      selectedFiles[type] = file; // Store the selected file by type
      fileNames[type] = file.name; // Store the file name by type
    } else {
      fileNames[type] = "선택된 파일 없음"; // Default text if no file is selected
    }
  }

  // Upload the selected file
  async function uploadFile(type) {
    const file = selectedFiles[type];
    if (!file) {
      errorAlert(`${type}에 대해 파일을 선택해주세요.`);
      return;
    }

    const apiUrl = `${serverApi}/api/setUploadProgram/`;
    const formData = new FormData();
    formData.append("upload_file", file);
    formData.append("type", type); // Include the file type

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        credentials: "include", // Include cookies if necessary
      });

      const result = await response.json();

      if (result.RESULT === "OK") {
        successAlert(`${type} 파일 업로드 성공!`);
      } else {
        errorAlert(`${type} 파일 업로드 실패: ${result.CODE}`);
      }
    } catch (error) {
      console.error(`Error uploading file for ${type}:`, error);
    }
  }
</script>

<section class="tableWrap" style="height: calc(-100px + 100vh);">
  <div class="parent_table">
    <div
      class="tableListWrap"
      style="height: calc(-294px + 100vh); overflow: auto;"
    >
      <table class="tableList hdBorder">
        <colgroup>
          <col style="width:90px;" />
          <col />
          <col style="width: 36%;" />
        </colgroup>
        <thead>
          <tr>
            <th class="text-center" style="font-size: 16px;">순번</th>
            <th class="text-center" style="font-size: 16px;">용도</th>
            <th class="text-center" style="font-size: 16px;">업로드</th>
          </tr>
        </thead>
        <tbody>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          {#each $dataArray as data, index}
            <tr>
              <td class="text-center">{index + 1}</td>
              <td style="font-size: 16px;" class="text-center">
                {data.cs_category}
                <!-- Display the purpose (e.g., Windows Agent) -->
              </td>
              <td class="text-center">
                <div
                  style="width: 100%; display:flex; gap:10px; justify-content:center"
                >
                  <!-- File Input -->
                  <label
                    class="btn btnPrimary"
                    style="display: flex; flex-direction:row; gap:10px; width:170px;"
                  >
                    <input
                      type="file"
                      class="file-input"
                      data-index={index}
                      on:change={(event) =>
                        handleFileSelect(event, data.cs_category)}
                    />
                    <img
                      src="./assets/images/icon/download.svg"
                      class="excel-img"
                    />
                    <span>파일업로드</span>
                  </label>
                  <!-- Display the file name -->
                  <input
                    type="text"
                    placeholder="선택된 파일 없음"
                    value={fileNames[data.cs_category] || "선택된 파일 없음"}
                    readonly
                    class="file-name-input"
                  />
                  <button
                    type="button"
                    class="upload-btn"
                    on:click={() => uploadFile(data.cs_category)}
                  >
                    업로드
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</section>

<style>
  * {
    font-size: 16px;
  }
  .upload-btn,
  .btnSave {
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    font-size: 16px;
    width: 85px;
    height: 40px;
  }

  .upload-btn:hover,
  .btnSave:hover {
    background-color: #45a049;
  }
  .file-name-input {
    width: 300px;
    padding: 8px;
    border-radius: 4px;
    font-size: 16px;
    background-color: rgba(0, 103, 255, 0.05);
    color: #0067ff;
    border-color: rgba(0, 103, 255, 0.1);
    height: 40px;
  }

  .tableWrap {
    background-color: #fff;
  }
  .parent_table {
    padding: 20px;
    height: 100%;
  }
  thead {
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 150px;
  }

  .pagination button {
    border: none !important;
    padding: 8px 12px;
    margin: 0 4px;
    cursor: pointer;
    border-radius: 5px;
  }

  .pagination button.selected {
    background-color: #007bff;
    color: #fff;
  }

  .pagination button[disabled] {
    cursor: not-allowed;
  }

  .pagination button:hover:not([disabled]) {
    background-color: #d4d4d4;
  }

  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }

  .btn_dean {
    display: flex;
    gap: 10px;
    width: 250px;
  }

  .btn:hover {
    color: #fff;
    background-color: #0067ff;
  }
  .excel-img {
    filter: invert(45%) sepia(100%) saturate(550%) hue-rotate(195deg)
      brightness(100%) contrast(98%);
  }
</style>
