<script>



</script>

<main class="table-container" style="margin: 0; border-radius: 10px">
  <div class="table-container_1">
    <div class="formControlWrap">
      <div class="formControl">
        <label>사용자이름</label>
        <div class="inputGroup">
          <input type="text" placeholder="사용자이름" />
        </div>
      </div>
      <div class="formControl">
        <label>비밀번호</label>
        <div class="inputGroup">
          <input type="text" placeholder="비밀번호" />
        </div>
      </div>
      <div class="formControl">
        <label>이메일(변경불가)</label>
        <div class="inputGroup">
          <input type="email" placeholder="admin@admin.com" />
          <button class="btn close-btn">이메일 중복확인</button>
        </div>
      </div>
      <div class="formControl">
        <label>부서</label>
        <div class="inputGroup">
          <input type="text" placeholder="default" />
        </div>
      </div>
      <div class="formControl">
        <label>유저권한</label>
        <div class="inputGroup">
          <input type="text" placeholder="유저권한" />
        </div>
      </div>
      <div class="formControl">
        <label></label>
        <div class="inputGroup">
          <div class="buttons">
            <div class="buttonGroup">
              <button class="btn modify-btn">수정하기</button>
              <button class="btn close-btn">다시 놓기</button>
              <button class="btn delete-btn">삭제하기</button>
              <!-- <button class="btn btn-info" on:click={handleList}>목록</button> -->
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
