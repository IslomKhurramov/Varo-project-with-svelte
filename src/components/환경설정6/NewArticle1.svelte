<script>
  import { createArticle } from "../../services/page6/serviceArticle";
  import { errorAlert, successAlert } from "../../shared/sweetAlert";
  import { createEventDispatcher } from "svelte";

  export let selectedData;

  let title = selectedData?.title || "";
  let content = selectedData?.content || "";
  let category = selectedData?.category || "DATAROOM";
  let selectedFile = null;
  let fileName = selectedData?.original_filename || "선택된 파일 없음";
  let error = null;

  const dispatch = createEventDispatcher();

  // Handle file selection
  function handleFileSelect(event) {
    selectedFile = event.target.files[0];
    if (selectedFile) {
      fileName = selectedFile.name;
    } else {
      fileName = "선택된 파일 없음";
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await createArticle(formData);

      if (response.RESULT === "OK") {
        await successAlert("게시물이 성공적으로 등록되었습니다.");
        dispatch("close");
      } else {
        throw new Error(response.MESSAGE || "게시물 등록에 실패하였습니다.");
      }
    } catch (err) {
      let errorMessage =
        "오류가 발생했습니다! 요청 처리 중 문제가 발생하였습니다.";
      if (err.response && err.response.data && err.response.data.CODE) {
        if (
          err.response.data.CODE === "Title, content, and category are required"
        ) {
          errorMessage = "제목, 내용, 카테고리는 필수 항목입니다.";
        } else {
          errorMessage = err.response.data.CODE;
        }
      }
      console.log("Error details:", err.response ? err.response.data : err);
      await errorAlert(errorMessage);
    }
  };

  // Handle list navigation
  function handleList() {
    dispatch("close");
  }
</script>

<main class="tableWrap">
  <div class="formContainer">
    <div class="inputRow">
      <label>제목</label>
      <input type="text" bind:value={title} placeholder="제목 등록하기" />
    </div>

    <div class="inputRow">
      <label>내용</label>
      <textarea bind:value={content} placeholder="내용 등록하기"></textarea>
    </div>

    <!-- File Upload Section -->
    <div class="inputRow">
      <label>파일</label>
      <div class="fileUploadGroup">
        <input
          type="file"
          id="fileInput"
          class="file-input"
          on:change={handleFileSelect}
        />
        <label for="fileInput" class="btn1 btn-primary1">
          <img src="./assets/images/icon/download.svg" class="excel-img" />
          <span>업로드</span>
        </label>
        <input
          type="text"
          placeholder="선택된 파일 없음"
          readonly
          class="file-name-input"
          value={fileName}
        />
      </div>
    </div>

    <div class="buttonContainer">
      <button type="button" class="btn btn-primary" on:click={handleSubmit}>
        등록하기
      </button>
      <button type="button" class="btn btn-green" on:click={handleList}>
        목록
      </button>
    </div>
  </div>
</main>

<style>
  .tableWrap {
    width: 100%;
    background-color: #fff;
    padding: 40px 20px;
    margin-top: 20px;
    box-sizing: border-box;
  }

  .formContainer {
    max-width: 70%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .inputRow {
    display: flex;
    align-items: center;
  }

  .inputRow label {
    width: 90px;
    font-weight: 600;
    font-size: 16px;
  }

  .inputRow input,
  .inputRow textarea {
    flex: 1;
    width: 100%;
    padding: 17px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    font-size: 16px;
  }

  .inputRow textarea {
    resize: vertical;
    height: 25vh;
  }

  .inputRow input:focus,
  .inputRow textarea:focus {
    border-color: #0067ff;
    outline: none;
  }

  /* Fayl yuklash qismi styling */
  .fileUploadGroup {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    padding: 10px 20px;
    border: 1px solid #cccccc;
    color: #acacac;
    border-radius: 5px;
    cursor: pointer;
  }

  .fileUploadGroup input[type="file"] {
    display: none;
  }

  .fileUploadGroup .excel-img {
    width: 20px;
    height: 20px;
  }

  .file-input {
    width: 200px;
    padding: 8px;
    border-radius: 4px;
    font-size: 16px;
    color: #fff;
    border-color: rgba(0, 103, 255, 0.1);
    height: 40px;
  }

  .fileUploadGroup .file-name-input::placeholder {
    color: rgb(39, 39, 39);
  }

  .fileUploadGroup .file-name-input {
    width: 300px;
    padding: 8px;
    border-radius: 4px;
    font-size: 16px;
    background-color: rgba(0, 103, 255, 0.05);
    color: #0067ff;
    border-color: rgba(0, 103, 255, 0.1);
    height: 40px;
  }

  .buttonContainer {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
  }

  .btn {
    padding: 12px 30px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition:
      background-color 0.3s,
      transform 0.2s;
    outline: none;
  }

  .btn1 {
    display: flex;
    gap: 10px;
    width: 200px;
    height: 20px;
    padding: 10px 30px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition:
      background-color 0.3s,
      transform 0.2s;
    outline: none;
  }

  .btn-primary {
    background-color: #007bff;
    color: white;
  }

  .btn-green {
    background-color: #1cb817;
    color: white;
  }

  .btn:hover {
    background-color: #0056b3;
  }

  .btn-primary1 {
    background-color: rgba(0, 103, 255, 0.05);
    color: #0067ff;
    border-color: rgba(0, 103, 255, 0.1);
  }

  .btn-primary1:hover {
    background-color: #007bff;
    color: white;
  }
</style>
