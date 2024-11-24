<script>
  import { getUserExist } from "../../services/login/loginService";
  import {
    setUserDelete,
    setUserUpdate,
  } from "../../services/page6/serviceArticle";
  export let selectedData;
  export let getUserListsData;
  import { errorAlert, successAlert } from "../../shared/sweetAlert";
  import { createEventDispatcher } from "svelte";

  let find_user = "";
  let error = null;
  let default_user_name = selectedData?.hostname || "";
  let default_user_email = selectedData?.itemTitle || "";
  let default_user_depart = selectedData?.itemCriteria || "";
  let default_user_level = selectedData?.itemLevel || "";

  const dispatch = createEventDispatcher();

  const findUser = async () => {
    try {
      if (!default_user_email) {
        throw new Error("이메일 입력하지 않았습니다");
      }

      const result = await getUserExist(default_user_email);

      if (result.RESULT === "OK") {
        await successAlert(result.CODE);
        getUserListsData();
      } else if (result?.RESULT === "ERROR") {
        await errorAlert(result.CODE);
      }
    } catch (err) {
      await errorAlert(err?.message || "알 수 없는 오류가 발생했습니다.");
    }
  };

  async function setUserDeleteData(user_index) {
    try {
      const response = await setUserDelete(user_index);
      if (response.RESULT === "OK") {
        await successAlert();
        selectedData = null;
        getUserListsData();
      } else {
        await errorAlert("삭제에 실패했습니다.");
      }
    } catch (err) {
      error = err.message;
      await errorAlert(error);
    }
  }

  async function handleUserEdit() {
    try {
      if (!selectedData || !selectedData.user_index) {
        await errorAlert("죄송합니다, 변경할 수 없습니다.");
        return;
      }

      const response = await setUserUpdate({
        user_index: selectedData.user_index,
        user_name: default_user_name,
        user_email: default_user_email,
        user_depart: default_user_depart,
        user_level: default_user_level,
      });

      if (response.RESULT === "OK") {
        await successAlert(response.CODE);
        getUserListsData();
        handleList();
      } else if (response.RESULT === "ERROR") {
        await errorAlert(response.CODE);

        selectedData = null;
        dispatch("close");
      }
    } catch (err) {
      error = err.message;
      console.log("Error details:", err.response ? err.response.data : err);
      await errorAlert(error);
    }
  }

  function handleInputChange(event) {
    const value = event.target.value;
    find_user = value;
    default_user_email = value;
  }

  function handleList() {
    dispatch("close");
  }
</script>

<main class="table-container">
  <div class="formContainer">
    <div class="inputRow">
      <label>사용자이름</label>
      <input
        type="text"
        placeholder={selectedData?.hostname}
        bind:value={default_user_name}
      />
    </div>
    <div class="inputRow">
      <label>이메일(변경불가)</label>
      <input
        type="email"
        bind:value={default_user_email}
        placeholder={selectedData?.itemTitle}
        on:input={handleInputChange}
      />
      <button style="height: 49px;" class="btn close-btn" on:click={findUser}>
        이메일 중복확인
      </button>
    </div>
    <div class="inputRow">
      <label>부서</label>
      <input
        type="text"
        placeholder={selectedData?.itemCriteria}
        bind:value={default_user_depart}
      />
    </div>
    <div class="inputRow">
      <label>유저권한</label>
      <input
        type="number"
        placeholder={selectedData?.itemLevel}
        bind:value={default_user_level}
      />
    </div>
    <div class="inputRow">
      <label></label>
      <div class="buttons">
        <div class="buttonGroup">
          <button
            class="btn modify-btn"
            on:click={() => {
              if (selectedData && selectedData.user_index) {
                handleUserEdit(selectedData.user_index);
              } else {
                errorAlert("변경할 사용자를 선택하지 않았습니다.");
              }
            }}>수정하기</button
          >
          <button
            class="btn delete-btn"
            on:click={() => {
              if (selectedData && selectedData.user_index) {
                setUserDeleteData(selectedData.user_index);
              } else {
                errorAlert("삭제할 사용자를 선택하지 않았습니다.");
              }
            }}>삭제하기</button
          >
          <button class="btn btn-info" on:click={handleList}>목록</button>
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
    margin-left: 35px;
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
