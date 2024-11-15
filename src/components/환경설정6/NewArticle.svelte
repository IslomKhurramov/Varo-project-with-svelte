<script>
  import { createArticle } from "../../services/page6/serviceArticle";
  import { errorAlert, successAlert } from "../../shared/sweetAlert";
  import { createEventDispatcher } from "svelte";

  export let selectedData;

  let title = selectedData?.title || "";
  let content = selectedData?.content || "";
  let category = selectedData?.category || "NOTICE";
  let selectedFile = null;
  let fileName = selectedData?.original_filename || null;
  let error = null;

  const dispatch = createEventDispatcher();

  // Handle file selection
  const handleFileSelect = (event) => {
    selectedFile = event.target.files[0];
    if (selectedFile) {
      fileName = selectedFile.name;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const response = await createArticle({
        title,
        content,
        category,
        file: selectedFile,
      });

      if (response.RESULT === "OK") {
        await successAlert("Article created successfully!");
        dispatch("close");
      } else {
        throw new Error(response.MESSAGE || "Failed to create the article");
      }
    } catch (err) {
      error = err.message;
      console.log("Error details:", err.response ? err.response.data : err);
      await errorAlert(error);
    }
  };

  // Handle list navigation
  function handleList() {
    dispatch("close");
  }
</script>

<main class="tableWrap">
  <div class="table-container_1">
    <div class="formControlWrap">
      <div class="formControl">
        <label>제목</label>
        <div class="inputGroup">
          <input bind:value={title} type="text" placeholder="제목" />
        </div>
      </div>

      <div class="formControl">
        <label>내용</label>
        <div class="inputGroup">
          <textarea bind:value={content} class="form-control" placeholder="내용"
          ></textarea>
        </div>
      </div>

      <div class="formControl">
        <label>파일</label>
        <div class="inputGroup">
          {#if selectedData?.file_path}
            <a href={`/${selectedData.file_path}`} target="_blank">
              {selectedData.original_filename}
            </a>
          {/if}
          <input type="file" on:change={handleFileSelect} />
        </div>
      </div>

      <div class="formControl">
        <label></label>
        <div class="buttons">
          <div class="buttonGroup">
            <button
              type="button"
              class="btn btn-primary"
              on:click={handleSubmit}
            >
              등록하기
            </button>
            <button type="button" class="btn btn-green" on:click={handleList}>
              목록
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .tableWrap {
    width: 100%;
    background-color: #fff;
    height: calc(100vh - 220px);
    border-radius: 10px;
    padding: 20px;
    margin-top: 10px;
  }

  .table-container_1 {
    margin: 20px 0;
    border-radius: 5px;
    width: 50%;
  }

  .formControlWrap {
    display: flex;
    flex-direction: column;
    row-gap: 13px;
  }

  .formControlWrap textarea {
    width: 0;
  }

  .formControl label {
    width: 100px;
    margin-right: 10px;
    font-weight: bold;
    margin-top: 10px;
  }

  .formControl .form-control input {
    width: 50%;
    flex: 1;
    padding: 8px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .inputGroup {
    display: flex;
    flex: 1;
    gap: 10px;
    align-items: center;
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

  .file-input {
    display: none;
  }

  .buttonGroup {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .inputGroup input,
  .inputGroup textarea {
    flex: 1;
  }

  .formControl input:focus,
  .formControl textarea:focus {
    border-color: #0067ff;
    outline: none;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
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

  .btn-warning {
    background-color: #ff5507;
    color: white;
  }

  .btn-info {
    background-color: #17a2b8;
    color: white;
  }

  .btn-green {
    background-color: #1cb817;
    color: white;
  }
</style>
