<script>
  // Accept props from the parent component
  export let selectedData;
  export let getArticleDetailData;

  import {
    updateArticle,
    deleteArticle,
  } from "../../services/page6/serviceArticle";
  import { errorAlert, successAlert } from "../../shared/sweetAlert";
  import { createEventDispatcher } from "svelte";

  let title = "";
  let content = "";
  let writer_name = "";
  let file = null;
  let error = null;

  const dispatch = createEventDispatcher();

  // Initialize variables when selectedData changes
  $: if (selectedData && !title && !content && !writer_name) {
    title = selectedData.title || "";
    content = selectedData.content || "";
    writer_name = selectedData.writer_name || "";
  }

  async function handleEdit() {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("writer_name", writer_name);
      formData.append("art_index", selectedData.art_index);
      if (file) formData.append("file", file);

      const response = await updateArticle(formData);
      if (response.RESULT === "OK") {
        await successAlert("게시물이 성공적으로 수정되었습니다.");
        await getArticleDetailData(selectedData.art_index);
        dispatch("close");
      }
    } catch (err) {
      error = err.message;
      console.log("Error details:", err.response ? err.response.data : err);
      await errorAlert(error);
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
          {#if selectedData.file_path}
            <a href={`/${selectedData.file_path}`} target="_blank">
              {selectedData.original_filename}
            </a>
            <div class="inputGroup_1">
              <input
                style="border: none;"
                type="file"
                on:change={(e) => (file = e.target.files[0])}
              />
            </div>
          {:else}
            <div class="inputGroup_1">
              <input
                style="border: none;"
                type="file"
                on:change={(e) => (file = e.target.files[0])}
              />
            </div>
          {/if}
        </div>
      </div>
      <div class="formControl">
        <label></label>
        <div class="inputGroup">
          <div class="buttons">
            <div class="buttonGroup">
              <button
                type="button"
                class="btn btn-primary"
                on:click={handleEdit}
              >
                수정
              </button>
              <button
                type="button"
                class="btn btn-warning"
                on:click={handleDelete}
              >
                삭제
              </button>
              <button type="button" class="btn btn-green" on:click={handleList}>
                목록
              </button>
            </div>
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

  .inputGroup_1 {
    margin-top: 10px;
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
