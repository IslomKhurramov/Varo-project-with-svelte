<div class="container_page">
  <div class="header">
    <button>등록현황조회</button>
    <button>에러내역확인</button>
    <button>등록결과조회</button>
  </div>

  <div class="table_center">
    <div class="table_container">
      <p class="word">점검결과등록</p>
      <table style="width: 100%; ">
        <div class="first_line">
          <p class="button1 width">자동</p>
          <p class="button2 width">에이전트결과</p>
          <span
            class="input"
            placeholder="점검대상 200대중 180대 업로드 완료 (등록현황을 그래픽으로 표현)"
          ></span>
          <button class="save_button">등록내역확인</button>
        </div>
      </table>
      <p class="word">수동</p>
      <div class="secondLine">
        <div class="thirdCol">
          <table style="width: 100%; ">
            <div class="first_line" style="padding-left: 10px;">
              <p class="button2">에이전트결과</p>
              <span class="span_at"
                >JSON 파일 업로드 (UNIX/WINDOWS/DBMS/CLOUD….)
              </span>

              <input class="upload" type="file" />
              <button class="save_button">등록내역확인</button>
            </div>
          </table>
          <table style="width: 100%; ">
            <div class="first_line" style="padding-left: 10px;">
              <p class="button2">네트워크설정파일</p>
              <span class="span_at">설정파일(TXT) 파일 업로드 </span>

              <input class="upload" type="file" />
              <button class="save_button">등록내역확인</button>
            </div>
          </table>
          <table style="width: 100%; ">
            <div class="first_line" style="padding-left: 10px;">
              <p class="button2">정보보호시스템</p>
              <span class="span_at">인터뷰파일(EXCEL) 파일 업로드 </span>

              <input class="upload" type="file" />
              <button class="save_button">등록내역확인</button>
            </div>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .container_page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    width: 100%;
  }

  .header {
    display: flex;
    flex-direction: row;
    gap: 15px;
    margin-right: 10px;
    width: 100%;
    justify-content: flex-end;
  }

  .header button {
    background-color: #003366; /* Darker Blue */
    color: #ffffff;
    width: 120px;
    font-size: 12px;
    height: 30px;
    cursor: pointer;
    border-radius: 5px;
  }

  .header button:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }

  .table_center {
    width: 82%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .table_container {
    width: 85%;
    height: 400px;
    padding: 20px;
    background-color: #f2f3f4;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #000000;
    margin-bottom: 30px;
  }

  .first_line {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  .button1,
  .button2 {
    background-color: lightgray; /* Light Blue */
    color: #000000;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    border-radius: 5px;
    width: 150px;
    height: 30px;
  }

  .input,
  .upload {
    flex-grow: 1;
    color: #ffffff;
    border: 1px solid black;
    border-radius: 5px;
    font-size: 12px;
    height: 30px;
    cursor: pointer;
  }

  .save_button {
    background-color: #003366; /* Darker Blue */
    color: #ffffff;
    border: 1px solid #ffffff;
    border-radius: 5px;
    font-size: 12px;
    height: 30px;
    width: 120px;
    cursor: pointer;
  }

  .save_button:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }

  .word {
    font-size: 16px;
    font-weight: bold;
  }

  .secondLine {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
  }

  .span_at {
    width: 260px;
    font-size: 12px;
    color: #888888;
    display: flex;
    align-items: center;
    height: 30px;
  }
  .width {
    width: 120px;
  }
  .thirdCol {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
</style>
