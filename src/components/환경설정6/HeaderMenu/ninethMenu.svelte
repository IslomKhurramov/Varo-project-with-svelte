<script>
  import { onMount } from "svelte";
  import {
    getChecklistTargets,
    getSystemBasicSetup,
    setChecklistTargetsAdd,
    setChecklistTargetsDelete,
    setChecklistTargetsUpdate,
    setSystemBasicSetup,
  } from "../../../services/page6/serviceArticle";
  import {
    confirmDelete,
    errorAlert,
    successAlert,
  } from "../../../shared/sweetAlert";
  import { navigate } from "svelte-routing";
  import { checkListTargets } from "../../../services/page6/store";
  let showModal = false;
  let keyWord = "";
  let fullName = "";
  let year = "";
  let targetIndex = null;

  async function checkListTargetsFunction() {
    try {
      const response = await getChecklistTargets();

      if (response) {
        checkListTargets.set(response.CODE);
      } else {
      }
      // console.log("traceByPlan", $license);
    } catch (err) {
      alert(`Error getting asset details: ${err.message}`);
    }
  }

  onMount(() => {
    checkListTargetsFunction();
  });
  function closeModal() {
    showModal = false;
  }

  async function targetAdd() {
    // const originalValue = event.target.value;
    try {
      const response = await setChecklistTargetsAdd(keyWord, fullName);

      if (response.RESULT === "OK") {
        await successAlert(response.CODE);
        showModal = false;
        await checkListTargetsFunction();
      } else if (response.RESULT === "ERROR") {
        await errorAlert(response.CODE);

        await checkListTargetsFunction();
      }
    } catch (err) {
      // event.target.value = originalValue;
      await errorAlert(err.message);
      await checkListTargetsFunction();
    }
  }
  async function targetDelete(index) {
    try {
      const isConfirmed = await confirmDelete();
      if (!isConfirmed) return;

      const response = await setChecklistTargetsDelete(index);

      if (response.RESULT === "OK") {
        await successAlert(response.CODE);
        await checkListTargetsFunction();
      } else if (response.RESULT === "ERROR") {
        await errorAlert(response.CODE);

        await checkListTargetsFunction();
      }
    } catch (err) {
      // event.target.value = originalValue;
      await errorAlert(err.message);
      await checkListTargetsFunction();
    }
  }
  let showModalUpdate = false;
  function handleClickTarget(data) {
    targetIndex = data.index;
    keyWord = data.keyword;
    fullName = data.fullname;
    showModalUpdate = true;
  }
  async function targetUpdate() {
    try {
      const response = await setChecklistTargetsUpdate(
        targetIndex,
        keyWord,
        fullName,
      );

      if (response.RESULT === "OK") {
        await successAlert(response.CODE);
        showModalUpdate = false;
        await checkListTargetsFunction();
        targetIndex = null;
        keyWord = "";
        fullName = "";
      } else if (response.RESULT === "ERROR") {
        await errorAlert(response.CODE);

        await checkListTargetsFunction();
      }
    } catch (err) {
      // event.target.value = originalValue;
      await errorAlert(err.message);
      await checkListTargetsFunction();
    }
  }
</script>

<main class="table-container">
  <div class="formContainer">
    <div class="inputRow">
      <label>점검항목그룹명</label>
      <div class="inputGroup">
        <input type="text" />
        <p>(신규인 경우)</p>
      </div>
    </div>
    <div class="inputRow">
      <label>점검항목 타임</label>
      <div class="inputGroup">
        <select>
          {#each $checkListTargets as target}
            <option value={target.index}>{target.fullname}</option>
          {/each}
        </select>
        <p style="cursor: pointer;" on:click={() => (showModal = true)}>
          [점검항목타입추가]
        </p>
      </div>
    </div>
    <div class="inputRow">
      <label style="width: 129px;">발행년도</label>
      <select style="width: 87%;">
        <option value="2024">2024년</option>
        <option value="2023">2023년</option>
        <option value="2022">2022년</option>
        <option value="2021">2021년</option>
        <option value="2020">2020년</option>
        <option value="2019">2019년</option>
      </select>
    </div>
    <div class="inputRow">
      <label>점검항목 파일명</label>
      <div class="inputGroup">
        <input type="file" />
        <p>샘플:</p>
      </div>
    </div>
    <div class="buttonContainer">
      <button type="button" class="btn btnBlue btnSave"> 등록하기 </button>
      <button type="button" class="btn btnBlue btnSave"> 새로고첨 </button>
    </div>
  </div>
  <div
    class="tableListWrap table1"
    style="margin-bottom: 20px; margin-top:20px"
  >
    <table class="tableList hdBorder font-size: 16px;">
      <colgroup>
        <col style="width:90px;" />
        <col />
        <col style="width:90px;" />
        <col style="width:200px" />
      </colgroup>
      <thead>
        <tr>
          <th class="text-center">넘버</th>
          <th class="text-center">설명</th>
          <th class="text-center">키워드</th>
          <th class="text-center">비고</th>
        </tr>
      </thead>
      <tbody>
        {#each $checkListTargets as data, index}
          <tr>
            <td class="text-center">{$checkListTargets.length - index}</td>
            <td class="text-center">{data.fullname}</td>
            <td class="text-center">{data.keyword} </td>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <td class="text-center" on:click|stopPropagation>
              <!-- Show the button but make it invisible if not needed -->
              <div class="button-group">
                <button
                  class="btn btnRed"
                  on:click={() => targetDelete(data.index)}
                  title="Delete item"
                >
                  <img src="./assets/images/delete.svg" alt="Delete item" />삭제
                </button>

                <button
                  class="btn btnPrimary"
                  on:click={() => handleClickTarget(data)}>수정</button
                >
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</main>

{#if showModal}
  <div class="modal-open-wrap">
    <dialog open on:close={() => (showModal = false)}>
      <div class="modal-content">
        <div class="modal">
          <div class="first_line">
            <label for="source-group">구분자</label>

            <input
              id="new-group"
              class="second_line_input"
              type="text"
              bind:value={keyWord}
            />
          </div>
          <div class="second_line">
            <label for="new-group">설명</label>
            <input
              bind:value={fullName}
              class="second_line_input"
              type="text"
              id="new-group"
              placeholder="새로운 진단 그룹명을 입력하세요"
            />
          </div>
          <div class="modal-buttons">
            <button class="primary-button" on:click={targetAdd}>저장하기</button
            >
            <button
              class="secondary-button"
              on:click={() => (showModal = false)}>취소</button
            >
          </div>
        </div>
      </div>
    </dialog>
  </div>
{/if}
{#if showModalUpdate}
  <div class="modal-open-wrap">
    <dialog open on:close={() => (showModalUpdate = false)}>
      <div class="modal-content">
        <div class="modal">
          <!-- First input field -->
          <div class="first_line">
            <label for="source-group">구분자</label>
            <input
              id="source-group"
              class="second_line_input"
              type="text"
              bind:value={keyWord}
            />
          </div>

          <!-- Second input field -->
          <div class="second_line">
            <label for="new-group">설명</label>
            <input
              id="new-group"
              class="second_line_input"
              type="text"
              bind:value={fullName}
              placeholder="새로운 진단 그룹명을 입력하세요"
            />
          </div>

          <!-- Modal buttons -->
          <div class="modal-buttons">
            <button class="primary-button" on:click={targetUpdate}
              >저장하기</button
            >
            <button
              class="secondary-button"
              on:click={() => (showModalUpdate = false)}>취소</button
            >
          </div>
        </div>
      </div>
    </dialog>
  </div>
{/if}

<style>
  td.delete-column {
    position: relative;
    text-align: center; /* Centers horizontally */
    vertical-align: middle; /* Centers vertically */
    line-height: normal; /* Ensures line height doesn't affect centering */
  }

  td.delete-column button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(
      -50%,
      -50%
    ); /* Moves the button exactly to the center */
  }
  .modal-open-wrap {
    display: block;
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(167, 167, 167, 0.6);
  }
  dialog {
    position: fixed;
    top: 50%;
    left: 12%;
    transform: translate(-50%, -50%);
    width: 400px;
    border: none;
    border-radius: 10px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.3s ease;
    z-index: 100;
  }
  /***MODAL */
  /* Modal content container */
  .modal-content {
    text-align: center;
  }
  .modal {
    margin-top: 10px;
  }
  * {
    font-size: 16px;
  }
  .modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  .first_line_input {
    width: 250px;
    padding: 5px;
  }
  .second_line_input {
    width: 250px;
    padding: 5px;
  }
  td.delete-column {
    position: relative;
    text-align: center; /* Centers horizontally */
    vertical-align: middle; /* Centers vertically */
    line-height: normal; /* Ensures line height doesn't affect centering */
  }

  td.delete-column button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(
      -50%,
      -50%
    ); /* Moves the button exactly to the center */
  }
  .button-group {
    display: flex;
    flex-direction: row;
    gap: 5px;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .inputGroup {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 5px;
  }

  .inputGroup p {
    color: #9197b3;
  }
  .table-container {
    overflow-y: auto;
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    margin-top: 10px;
    height: calc(100vh - 200px);
  }

  .formContainer {
    max-width: 50%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 10px;
  }

  .inputRow {
    display: flex;
    align-items: center;
  }

  .inputRow label {
    width: 150px;
    font-weight: 600;
    font-size: 16px;
    margin-left: 20px;
  }

  .inputRow input {
    flex: 1;
    width: 100%;
    padding: 8px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    font-size: 16px;
  }
  .primary-button {
    background-color: #54b3d6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .primary-button:hover {
    background-color: #48a2bf;
  }

  .secondary-button {
    background-color: #f0f0f0;
    color: #666;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .secondary-button:hover {
    background-color: #e0e0e0;
  }

  /* Modal backdrop */
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    animation: fadeInBackdrop 0.3s ease;
  }

  .buttonContainer {
    display: flex;
    justify-content: center;
    margin-top: 5px;
    flex-direction: row;
    gap: 10px;
  }

  .btnSave {
    padding: 15px 40px;
    background-color: #0067ff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  .first_line {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .second_line {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }

  .btnSave:hover {
    background-color: #4989ff;
  }

  .table1,
  .table2 {
    width: 100%;
    font-size: 16px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  th,
  td {
    font-size: 16px;
  }

  thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }
  .table1 {
    height: 48vh;
  }

  tr:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
  table {
    width: 100%;
  }

  tr {
    cursor: pointer;
  }
</style>
