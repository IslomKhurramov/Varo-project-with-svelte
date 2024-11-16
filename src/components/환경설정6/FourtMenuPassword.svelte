<script>
  import { getUserExist } from "../../services/login/loginService";
  import { setUserDelete } from "../../services/page6/serviceArticle";
  export let selectedData;
  import { errorAlert, successAlert } from "../../shared/sweetAlert";
  import { createEventDispatcher } from "svelte";

  let find_user = "";
  let errorMessage = "";
  let error = null;

  const dispatch = createEventDispatcher();

  const findUser = async () => {
    try {
      if (!find_user) throw new Error("이메일 입력하지 않았습니다");
      const result = await getUserExist(find_user);

      await successAlert(result);
    } catch (err) {
      errorMessage = err?.message;
      await errorAlert(errorMessage);
    } finally {
      find_user = "";
    }
  };
  async function setUserDeleteData(user_index) {
    try {
      const response = await setUserDelete(user_index);
      if (response.RESULT === "OK") {
        await successAlert();
        selectedData = null;
      } else {
        await errorAlert("삭제에 실패했습니다.");
      }
    } catch (err) {
      error = err.message;
      await errorAlert(error);
    }
  }

  function handleList() {
    dispatch("close");
  }
</script>

<main class="table-container" style="margin: 0; border-radius: 10px">
  <article class="contentArea" style="position: relative; width:33%;">
    <table class="tableForm">
      <colgroup>
        <col style="width:130px;" />
        <col />
      </colgroup>
      <tbody>
        <tr>
          <th> 사용자이름 </th>
          <td>
            <div class="inputGroup">
              <input type="text" placeholder="사용자이름" />
            </div>
          </td>
        </tr>
        <tr>
          <th> 비밀번호 </th>

          <td>
            <div class="inputGroup">
              <input type="text" placeholder="비밀번호" />
            </div>
          </td>
        </tr>
        <tr>
          <th> 이메일(변경불가) </th>

          <td>
            <div class="inputGroup">
              <input
                type="email"
                placeholder="admin@admin.com"
                bind:value={find_user}
              />
              <button
                style="height: 49px;"
                class="btn close-btn"
                on:click={findUser}
              >
                이메일 중복확인
              </button>
            </div>
          </td>
        </tr>
        <tr>
          <th> 부서 </th>

          <td>
            <div class="inputGroup">
              <input type="text" placeholder="default" />
            </div>
          </td>
        </tr>
        <tr>
          <th>유저권한</th>
          <td>
            <div class="inputGroup">
              <input type="text" placeholder="유저권한" />
            </div>
          </td>
        </tr>
        <tr>
          <th></th>
          <td>
            <div class="formControl">
              <label></label>
              <div class="inputGroup">
                <div class="buttons">
                  <div class="buttonGroup">
                    <button class="btn modify-btn">수정하기</button>
                    <button class="btn close-btn">다시 놓기</button>
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
                    <!-- <button class="btn btn-info" on:click={handleList}>목록</button> -->
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </article>
</main>

<style>
  .contentArea {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    height: fit-content;
    margin-left: 20px;
    margin-top: 10px;
    width: fit-content;
  }
  .table-container {
    width: 100%;
    height: calc(100vh - 280px);
    background-color: #ffffff;
  }
  th,
  td {
    font-size: 16px;
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
    align-items: center;
  }

  .inputGroup input {
    flex: 1;
    font-size: 16px;
    margin: 5px;
    height: 50px;
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
