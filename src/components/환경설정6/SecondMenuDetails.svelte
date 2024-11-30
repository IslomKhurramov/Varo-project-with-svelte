<script>
  // Accept props from the parent component
  export let selectedData;
  import {
    updateArticle,
    deleteArticle,
    downloadArticleFile,
  } from "../../services/page6/serviceArticle";
  import { errorAlert, successAlert } from "../../shared/sweetAlert";
  import { createEventDispatcher } from "svelte";

  let title = "";
  let content = "";
  let writer_name = "";
  let error = null;
  let selectedFile = null;
  let fileName = selectedData?.original_filename || "선택된 파일 없음";

  const dispatch = createEventDispatcher();

  $: if (selectedData && !title && !content && !writer_name) {
    title = selectedData.title || "";
    content = selectedData.content || "";
    writer_name = selectedData.writer_name || "";
  }

  function handleFileSelect(event) {
    selectedFile = event.target.files[0];
    if (selectedFile) {
      fileName = selectedFile.name;
    } else {
      fileName = "선택된 파일 없음";
    }
  }

  async function handleEdit() {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("writer_name", writer_name);
      formData.append("art_index", selectedData.art_index);
      if (selectedFile) formData.append("file", selectedFile);

      const response = await updateArticle(formData);

      if (response.RESULT === "OK") {
        await successAlert("게시물이 성공적으로 수정되었습니다.");
        dispatch("close");
      } else {
        throw new Error(response.MESSAGE || "게시물 수정에 실패하였습니다.");
      }
    } catch (err) {
      let errorMessage =
        "오류가 발생했습니다! 요청 처리 중 문제가 발생하였습니다.";

      if (err.response && err.response.data && err.response.data.CODE) {
        errorMessage = err.response.data.CODE;
      }

      console.log("Error details:", err.response ? err.response.data : err);
      await errorAlert(errorMessage);
    }
  }

  async function handleDelete() {
    try {
      const response = await deleteArticle({
        art_index: selectedData.art_index,
      });
      if (response.RESULT === "OK") {
        await successAlert(response.CODE);
        dispatch("close");
      }
    } catch (err) {
      error = err.message;
      console.log("Error details:", err.response ? err.response.data : err);
      await errorAlert(error);
    }
  }

  function handleList() {
    dispatch("close");
  }
</script>

<main class="tableWrap">
  <div class="formContainer">
    <div class="inputRow">
      <label>제목</label>
      <input type="text" bind:value={title} placeholder="제목 수정하기" />
    </div>

    <div class="inputRow">
      <label>내용</label>
      <textarea bind:value={content} placeholder="내용 수정하기"></textarea>
    </div>

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
          <img src="./assets/images/download.svg" class="excel-img" />
          <span>업로드</span>
        </label>
        <input
          type="text"
          placeholder="선택된 파일 없음"
          readonly
          class="file-name-input"
          value={fileName}
        />
        {#if selectedData.file_path}
          <a
            href="javascript:void(0)"
            on:click={(e) => {
              e.stopPropagation();
              downloadArticleFile(
                selectedData.file_path,
                selectedData.original_filename,
              );
            }}
          >
            <img src="./assets/images/download.svg" class="excel-img" />
          </a>
        {/if}
      </div>
    </div>

    <div class="buttonContainer">
      <button type="button" class="btn btn-primary" on:click={handleEdit}>
        수정
      </button>
      <button type="button" class="btn delete-btn" on:click={handleDelete}>
        삭제
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
  .modify-btn {
    background-color: #4caf50;
    color: white;
  }

  .modify-btn:hover {
    background-color: #45a049;
  }

  .close-btn {
    background-color: #2196f3;
    color: white;
  }

  .close-btn:hover {
    background-color: #1976d2;
  }

  .delete-btn {
    background-color: #f44336;
    color: white;
  }

  .delete-btn:hover {
    background-color: #e53935;
  }

  .btn-info {
    background-color: #17a2b8;
    color: white;
  }
</style>
