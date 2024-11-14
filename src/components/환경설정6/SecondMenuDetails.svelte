<script>
  import SecondMenu from "./HeaderMenu/SecondMenu.svelte";

  let username = "";
  let text = "";
  let selectedData = null;
  let content = "";

  function handleEdit() {
    // Handle edit logic here
    console.log("Edit button clicked");
  }

  function handleDelete() {
    // Handle delete logic here
    console.log("Delete button clicked");
  }

  function handleList() {
    selectedData = {};
  }
</script>

{#if selectedData}
  <SecondMenu {selectedData} on:close={() => (selectedData = null)} />
{:else}
  <main class="tableWrap">
    <div class="table-container_1">
      <div class="formControlWrap">
        <div class="formControl">
          <label>제목</label>
          <div class="inputGroup">
            <input bind:value={username} type="text" placeholder="제목" />
          </div>
        </div>
        <div class="formControl">
          <label>작성자</label>
          <div class="inputGroup">
            <input
              bind:value={text}
              type="text"
              id="text"
              placeholder="작성자"
            />
          </div>
        </div>
        <div class="formControl">
          <label for="text">내용</label>
          <div class="inputGroup">
            <textarea
              bind:value={content}
              class="form-control"
              id="content"
              rows="5"
              placeholder="내용"
            ></textarea>
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
                  on:click={handleEdit}>수정</button
                >
                <button
                  type="button"
                  class="btn btn-warning"
                  on:click={handleDelete}>삭제</button
                >
                <button
                  type="button"
                  class="btn btn-green"
                  on:click={handleDelete}>만들기</button
                >
                <button type="button" class="btn btn-info" on:click={handleList}
                  >목록</button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
{/if}

<style>
  .tableWrap {
    width: 100%;
    background-color: #fff;
    height: 85vh;
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

  .buttonGroup {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .inputGroup input {
    flex: 1;
  }

  .inputGroup textarea {
    flex: 1;
  }

  .formControl input:focus {
    border-color: #0067ff;
    outline: none;
  }

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
