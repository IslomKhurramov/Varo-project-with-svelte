<script>
  import { getUserExist } from "../../services/login/loginService";
  import { errorAlert, successAlert } from "../../shared/sweetAlert";
  import { createEventDispatcher } from "svelte";
  import { register } from "../../services/page1/authService";

  let name = "";
  let email = "";
  let password = "";
  let department = "";
  let userRole = 1;
  let find_user = "";
  let errorMessage = "";

  const dispatch = createEventDispatcher();

  // Check if email already exists
  const findUser = async () => {
    try {
      if (!find_user) throw new Error("이메일 입력하지 않았습니다");
      const result = await getUserExist(find_user);

      if (result?.RESULT === "OK") {
        await successAlert("사용 가능한 이메일입니다.");
      } else {
        throw new Error("이미 등록된 이메일입니다.");
      }
    } catch (err) {
      errorMessage = err?.message;
      await errorAlert(errorMessage);
    } finally {
      find_user = ""; // Reset the email field
    }
  };

  const registerUser = async () => {
    try {
      if (!name || !email || !password || !department) {
        throw new Error("모든 필드를 입력하세요.");
      }

      const response = await register(name, email, password, department);
      if (response.RESULT === "OK") {
        await successAlert("회원가입이 성공적으로 완료되었습니다.");
        handleList();
      } else {
        throw new Error("회원가입에 실패했습니다.");
      }
    } catch (err) {
      errorMessage = err?.message;
      await errorAlert(errorMessage);
    }
  };

  function handleList() {
    dispatch("close");
  }
</script>

<main class="table-container" style="border-radius: 10px;">
  <div class="table-container_1">
    <div class="formControlWrap">
      <div class="formControl">
        <label>사용자 이름</label>
        <div class="inputGroup">
          <input type="text" placeholder="사용자 이름" bind:value={name} />
        </div>
      </div>

      <div class="formControl">
        <label>비밀번호</label>
        <div class="inputGroup">
          <input type="password" placeholder="비밀번호" bind:value={password} />
        </div>
      </div>

      <div class="formControl">
        <label>부서</label>
        <div class="inputGroup">
          <input type="text" placeholder="부서" bind:value={department} />
        </div>
      </div>

      <div class="formControl">
        <label>이메일</label>
        <div class="inputGroup">
          <input
            type="email"
            placeholder="admin@admin.com"
            bind:value={email}
          />
          <button class="btn close-btn" on:click={findUser}>
            이메일 중복확인
          </button>
        </div>
      </div>
      <div class="formControl">
        <label></label>
        <div class="inputGroup">
          <div class="buttons">
            <div class="buttonGroup">
              <button class="btn modify-btn" on:click={registerUser}>
                등록하기
              </button>
              <button
                class="btn close-btn"
                on:click={() => {
                  name = "";
                  email = "";
                  password = "";
                  department = "";
                }}
              >
                다시 놓기
              </button>
              <button class="btn btn-info" on:click={handleList}> 목록 </button>
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
    height: calc(100vh - 220px);
    background-color: #ffffff;
    padding: 20px;
    margin: 10px 0 0 0;
  }

  .table-container_1 {
    margin: 20px 0;
    border-radius: 5px;
    width: 50%;
  }

  .formControlWrap {
    display: flex;
    flex-direction: column;
    row-gap: 40px;
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

  .formControlWrap input {
    border: 1px solid #cccccc;
    height: 60px;
    font-size: 15px;
    color: #101010;
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
