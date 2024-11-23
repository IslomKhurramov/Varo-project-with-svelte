<script>
  import { setPasswordUpdate } from "../../services/page6/serviceArticle";
  export let selectedData;
  import { errorAlert, successAlert } from "../../shared/sweetAlert";
  import { createEventDispatcher } from "svelte";

  let error = null;
  let currentPassword = "";
  let newPassword1 = "";
  let newPassword2 = "";

  const dispatch = createEventDispatcher();

  async function handleEdit() {
    try {
      // console.log("password", selectedData);

      if (!selectedData || !selectedData.user_index) {
        await errorAlert("죄송합니다, 비밀번호를 변경할 수 없습니다.");
        return;
      }

      const response = await setPasswordUpdate({
        user_index: selectedData.user_index,
        user_curr_pass: currentPassword,
        user_new_pass1: newPassword1,
        user_new_pass2: newPassword2,
      });

      if (
        response.CODE ===
        "기존 비밀번호가 일치하지 않습니다.The password does not match the supplied hash"
      ) {
        await errorAlert(response.CODE);
      } else if (response.CODE === "비밀번호를 업데이트하였습니다.") {
        await successAlert(response.CODE);

        selectedData = null;
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

<main class="table-container">
  <div class="formContainer">
    <div class="inputRow">
      <label>현재비밀번호</label>
      <input
        type="password"
        placeholder="현재비밀번호"
        bind:value={currentPassword}
      />
    </div>
    <div class="inputRow">
      <label>비밀번호변경</label>
      <input
        type="password"
        placeholder="비밀번호변경#1"
        bind:value={newPassword1}
      />
    </div>
    <div class="inputRow">
      <label>비밀번호변경</label>
      <input
        type="password"
        placeholder="비밀번호변경#2"
        bind:value={newPassword2}
      />
    </div>
    <div class="inputRow">
      <label></label>
      <div class="inputGroup">
        <div class="buttons">
          <div class="buttonGroup">
            <button class="btn modify-btn" on:click={handleEdit}>
              수정하기
            </button>
            <button
              class="btn close-btn"
              on:click={() => {
                currentPassword = "";
                newPassword1 = "";
                newPassword2 = "";
              }}
            >
              다시 놓기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .table-container {
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    margin-top: 10px;
    height: 80vh;
  }

  .formContainer {
    max-width: 50%;
    display: flex;
    flex-direction: column;
    gap: 40px;
    margin-top: 10px;
  }

  .inputRow {
    display: flex;
    align-items: center;
    gap: 20px;
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
    padding: 17px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    font-size: 16px;
  }

  .buttons {
    width: 100%;
    display: flex;
  }

  .buttonGroup {
    display: flex;
    flex-direction: row;
    gap: 10px;
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
