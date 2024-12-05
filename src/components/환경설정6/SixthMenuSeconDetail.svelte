<script>
  import { errorAlert, successAlert } from "../../shared/sweetAlert";
  import { serverApi } from "../../lib/config";
  export let dataArray = {};

  let displayedPages = [
    { hostname: "윈도우에이전트" },
    { hostname: "리눅스에이전트" },
    { hostname: "수동점검프로그램" },
    { hostname: "수동점검 스크립트" },
    { hostname: "네트워크장비정보수집 프로그램" },
    { hostname: "매뉴얼" },
    { hostname: "가이드라인" },
    { hostname: "수동점검용 엑셀파일 템플릿" },
  ];

  let selectedFiles = {};
  let fileNames = {};

  function handleFileSelect(event, hostname) {
    const file = event.target.files[0];
    if (file) {
      selectedFiles[hostname] = file;
      fileNames[hostname] = file.name;
    } else {
      fileNames[hostname] = "선택된 파일 없음";
    }
  }

  async function uploadFile(hostname) {
    const file = selectedFiles[hostname];
    if (!file) {
      errorAlert(`${hostname}에 대해 파일을 선택해주세요.`);
      return;
    }

    const apiUrl = `${serverApi}/api/setUploadProgram/`;
    const formData = new FormData();
    formData.append("update_file", file);
    formData.append("hostname", hostname);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();

      if (result.RESULT === "OK") {
        successAlert(`${hostname} 파일 업로드 성공!`);
        fileNames[hostname] = "선택된 파일 없음";
      } else {
        errorAlert(`${hostname} 파일 업로드 실패: ${result.CODE}`);
      }
    } catch (error) {
      console.error(`Error uploading file for ${hostname}:`, error);
      errorAlert(`${hostname} 파일 업로드 과정에서 에러 발생.`);
    }
  }
</script>

<section class="tableWrap_4">
  <div class="tableListWrap">
    <table class="tableList hdBorder">
      <colgroup>
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th class="text-center" style="font-size: 16px;">용도</th>
          <th class="text-center" style="font-size: 16px;">업로드</th>
        </tr>
      </thead>
      <tbody>
        {#each displayedPages as data, index}
          <tr>
            <td style="font-size: 16px;" class="text-center">
              {data.hostname}
            </td>
            <td class="text-center">
              <div
                style="width: 100%; display:flex; gap:10px; justify-content:center"
              >
                <label
                  class="btn btnPrimary"
                  style="display: flex; flex-direction:row; gap:10px; width:170px;"
                >
                  <input
                    type="file"
                    class="file-input"
                    data-index={index}
                    on:change={(event) =>
                      handleFileSelect(event, data.hostname)}
                  />
                  <img src="./assets/images/download.svg" class="excel-img" />
                  <span>파일업로드</span>
                </label>
                <input
                  type="text"
                  placeholder="선택된 파일 없음"
                  value={fileNames[data.hostname] || "선택된 파일 없음"}
                  readonly
                  class="file-name-input"
                />
                <button
                  type="button"
                  class="upload-btn"
                  on:click={() => uploadFile(data.hostname)}
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
</section>

<style>
  /*******************/
  * {
    font-size: 16px;
  }
  .upload-btn {
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    font-size: 16px;
    width: 85px;
    height: 40px;
  }

  .tableWrap_4 {
    background-color: #fff;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    height: 70vh;
    border-radius: 5px;
    margin-top: 10px;
    overflow-y: auto;
  }

  .upload-btn:hover {
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

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
  }

  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
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
