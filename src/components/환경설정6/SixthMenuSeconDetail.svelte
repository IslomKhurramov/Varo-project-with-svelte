<script>
  import { serverApi } from "../../lib/config";
  import { getProgramList } from "../../services/page1/getProgramListService";
  import { dataArray, programList } from "../../services/page7/trace.store";
  import { errorAlert, successAlert } from "../../shared/sweetAlert";
  // export let selectPageMain;

  let displayedPages = [];

  let totalPages = 1;
  let target = "점검대상";
  /************SORTINGACENDINGVERSION*************************/
  // Default sorting parameters
  let orderUsage = "";
  let orderVersion = "";
  let orderCdate = "";
  let currentPage = 1;
  let listCount = "15";

  let sortField = ""; // No default sort field
  let sortAscending = true; // Default to ascending

  async function fetchProgramList() {
    try {
      let limit = listCount === "전체" ? undefined : Number(listCount);

      // Dynamically construct parameters
      const params = {
        ...(orderUsage && { orderUsage }),
        ...(orderVersion && { orderVersion }),
        ...(orderCdate && { orderCdate }),
        currentPage,
        limit,
      };

      console.log("Fetching data with params:", params);

      const response = await getProgramList(
        params.orderUsage || "",
        params.orderVersion || "",
        params.orderCdate || "",
        params.currentPage,
        params.limit,
      );

      if (response) {
        programList.set(response.CODE);
        totalPages = Math.ceil(
          response.CODE.total_count / (limit || response.CODE.total_count),
        );
      }
    } catch (err) {
      console.error(`Error fetching data: ${err.message}`);
    }
  }

  function toggleSort(field) {
    // Reset all sorting variables
    orderUsage = "";
    orderVersion = "";
    orderCdate = "";

    if (sortField === field) {
      sortAscending = !sortAscending; // Toggle direction
    } else {
      // Update sorting field and default to ascending
      sortField = field;
      sortAscending = true;
    }

    // Update the specific sorting variable based on the field
    if (field === "order_usage") {
      orderUsage = sortAscending ? "asc" : "desc";
    } else if (field === "order_version") {
      orderVersion = sortAscending ? "asc" : "desc";
    } else if (field === "order_cdate") {
      orderCdate = sortAscending ? "asc" : "desc";
    }

    // Refetch data with updated sorting
    fetchProgramList();
  }

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      fetchProgramList();
    }
  }

  $: listCount, fetchProgramList(); // Re-fetch data when listCount changes

  $: {
    const maxPagesToShow = 5;
    displayedPages = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) displayedPages.push(i);
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        displayedPages.push(i);
      }
    }
  }

  let fakeData = [];
  for (let i = 0; i <= 100; i++) {
    fakeData.push({
      cs_index: 6,
      cs_category: "MANUAL",
      cs_support_os: "",
      cs_codetype: "MANUAL",
      cs_filename: "varo_agent_manual_v1.0.docx",
      cs_version: "0.8",
      cs_provied_date: "2024-04-11",
      cs_description: "클라이언트 프로그램 사용자 매뉴얼",
    });
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
    formData.append("update_file", file);
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
        fileNames = {};
      } else {
        errorAlert(`${type} 파일 업로드 실패: ${result.CODE}`);
      }
    } catch (error) {
      console.error(`Error uploading file for ${type}:`, error);
    }
  }
</script>

<section style="background-color: #fff;">
  <div class="tableWrap">
    <div class="tableListWrap">
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
          {#each $programList.list as data, index}
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
  <select style="margin-top:10px; margin-left:10px" bind:value={listCount}>
    <option value="15">15개 보기</option>

    <option value="30">30개 보기</option>
    <option value="50">50개 보기</option>
    <option value="100">100개 보기</option>
    <option value="전체">전체 보기</option>
  </select>
  <div class="pagination_box">
    <nav class="pagination">
      <button
        on:click={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lsaquo;
      </button>
      {#each Array(totalPages) as _, page (page)}
        <button
          class:selected={currentPage === page + 1}
          on:click={() => goToPage(page + 1)}
        >
          {page + 1}
        </button>
      {/each}
      <button
        on:click={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &rsaquo;
      </button>
    </nav>
  </div>
</section>

<style>
  /*******************/
  * {
    font-size: 16px;
  }
  .pagination_box {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
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
  .tableWrap {
    background-color: #fff;
    max-height: 70vh;
    border-radius: 5px;
    overflow-y: auto;
  }
  .tableList {
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
    margin-bottom: 60px;
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
