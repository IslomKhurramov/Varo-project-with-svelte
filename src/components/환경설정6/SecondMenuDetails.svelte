<script>
  // Accept props from the parent component
  export let selectedData;
  export let getArticleDetailData;

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
  let file = null;
  let error = null;

  const dispatch = createEventDispatcher();

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
        await successAlert(response.CODE);
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

<main class="table-container" style="border-radius: 10px;">
  <article class="contentArea" style="position: relative; width:28%;">
    <table class="tableForm">
      <colgroup>
        <col style="width:130px;" />
        <col />
      </colgroup>
      <tbody>
        <tr>
          <th> 제목 </th>

          <td>
            <div class="inputGroup">
              <input bind:value={title} type="text" placeholder="제목" />
            </div>
          </td>
        </tr>
        <tr>
          <th> 내용 </th>
          <td>
            <div class="inputGroup">
              <textarea
                bind:value={content}
                class="form-control"
                placeholder="내용"
              ></textarea>
            </div>
          </td>
        </tr>
        <tr>
          <th> 파일 </th>
          <td>
            <div class="inputGroup">
              {#if selectedData.file_path}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-missing-attribute -->
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
                  {selectedData.original_filename}
                </a>

                <label
                  class="btn btnPrimary"
                  style="display: flex; flex-direction:row; gap:10px; width:170px;"
                >
                  <input
                    class="file-input"
                    style="border: none;"
                    type="file"
                    on:change={(e) => (file = e.target.files[0])}
                  />
                  <img
                    src="./assets/images/icon/download.svg"
                    class="excel-img"
                  />
                  <span>파일업로드</span>
                </label>
              {:else}
                <label
                  class="btn btnPrimary"
                  style="display: flex; flex-direction:row; gap:10px; width:170px;"
                >
                  <input
                    class="file-input"
                    style="border: none;"
                    type="file"
                    on:change={(e) => (file = e.target.files[0])}
                  />
                  <img
                    src="./assets/images/icon/download.svg"
                    class="excel-img"
                  />
                  <span>파일업로드</span>
                </label>
              {/if}
            </div>
          </td>
        </tr>
        <tr></tr>
      </tbody>
    </table>
    <div class="formControl">
      <div class="buttons">
        <div class="buttonGroup">
          <button type="button" class="btn modify-btn" on:click={handleEdit}>
            수정
          </button>
          <button type="button" class="btn delete-btn" on:click={handleDelete}>
            삭제
          </button>
          <button type="button" class="btn close-btn" on:click={handleList}>
            목록
          </button>
        </div>
      </div>
    </div>
  </article>
</main>

<style>
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

  .contentArea {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    height: fit-content;
    margin-left: 20px;
    margin-top: 10px;
    width: fit-content;
  }

  .formControl {
    display: flex;
    justify-content: center;
    padding: 20px;
  }

  .tableForm tr:not(:last-child) th,
  .tableForm tr:not(:last-child) td {
    padding: 15px;
  }

  .tableForm input {
    font-size: 16px;
  }
  .tableForm {
    width: 100%;
  }
  td,
  th {
    font-size: 16px;
  }
  tr {
    border: 1px solid #f2f2f2;
  }
  td {
    margin-left: 10px;
  }
  .table-container {
    background-color: #ffffff;

    /* width: 100%; */
    height: calc(100vh - 134px);
  }
  th {
    background-color: #ffffff;
    color: #333;
    font-weight: 600;
    white-space: nowrap;
  }

  .inputGroup {
    display: flex;
    flex: 1;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
  }

  .buttonGroup {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  .inputGroup input {
    height: 50px;
  }
  .inputGroup input,
  .inputGroup textarea {
    flex: 1;
  }
  .inputGroup textarea {
    height: 120px;
  }

  .buttonGroup button:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition:
      background-color 0.3s,
      transform 0.2s;
    cursor: pointer;
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
</style>
