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
</script>

<main class="table-container" style="margin: 0; border-radius: 10px">
  <div class="table-container_1">
    <div class="formControlWrap">
      <div class="formControl">
        <label>현재비밀번호</label>
        <div class="inputGroup">
          <input
            type="password"
            placeholder="현재비밀번호"
            bind:value={currentPassword}
          />
        </div>
      </div>
      <div class="formControl">
        <label>비밀번호변경#1</label>
        <div class="inputGroup">
          <input
            type="password"
            placeholder="비밀번호변경#1"
            bind:value={newPassword1}
          />
        </div>
      </div>
      <div class="formControl">
        <label>비밀번호변경#2</label>
        <div class="inputGroup">
          <input
            type="password"
            placeholder="비밀번호변경#2"
            bind:value={newPassword2}
          />
        </div>
      </div>
      <div class="formControl">
        <label></label>
        <div class="inputGroup">
          <div class="buttons">
            <div class="buttonGroup">
              <button class="btn modify-btn" on:click={handleEdit}>
                수정하기
              </button>
              <button class="btn close-btn" on:click={() => dispatch("close")}>
                다시 놓기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .table-container {
    width: 100%;
    height: calc(100vh - 280px);
    background-color: #ffffff;
    padding: 20px;
    margin: 5px 0 0 0;
  }

  .table-container_1 {
    margin: 20px 0;
    border-radius: 10px;
    width: 50%;
  }

  .formControlWrap {
    display: flex;
    flex-direction: column;
    row-gap: 13px;
  }

  .formControl {
    display: flex;
    align-items: flex-start;
  }

  .formControl label {
    width: 150px;
    margin-right: 20px;
    font-weight: bold;
    margin-top: 10px;
  }

  .formControl input {
    width: 50%;
    flex: 1;
    padding: 8px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .formControl input:focus {
    border-color: #0067ff;
    outline: none;
  }

  .inputGroup {
    display: flex;
    flex: 1;
    gap: 10px;
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
</style>
