<div class="container_page">
  <div class="header">
    <button>등록현황조회</button>
    <button>에러내역확인</button>
    <button>등록결과조회</button>
  </div>

  <div class="table_container">
    <p class="word">점검결과등록</p>
    <table style="width: 100%; ">
      <div class="first_line">
        <p class="button1 width">자동</p>
        <p class="button2">에이전트결과</p>
        <span
          class="input"
          placeholder="점검대상 200대중 180대 업로드 완료 (등록현황을 그래픽으로 표현)"
        ></span>
        <button class="save_button">등록내역확인</button>
      </div>
    </table>
    <div class="secondLine">
      <p class="button1 width">수동</p>
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

<style>
  .container_page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
  .header {
    display: flex;
    flex-direction: row;
    gap: 15px;
    padding-left: 40px;
    width: 100%;
    justify-content: flex-end;
  }
  .header button {
    background-color: #003366; /* Darker Blue */
    color: #ffffff;
    width: 120px;
    height: 30px;
    cursor: pointer;
  }
  .header button:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }
  .table_container {
    margin-left: 50px;
    margin-top: 50px;
    padding-bottom: 50px;
    width: 100%;
    background-color: #fff;
    border: 1px solid #000000;

    box-shadow: 0 4px 8px rgb(255, 255, 255);
  }
  .first_line {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    padding-left: 20px;
  }
  .button1,
  .button2 {
    background-color: #5f9ea0; /* Light Blue */
    color: #ffffff;
    border: 2px solid #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    padding: 10px;
    border-radius: 5px;
    width: 120px;
  }
  .input {
    flex-grow: 1;
    max-width: 500px;
    border: 1px solid black;
    border-radius: 5px;
    font-size: 12px;
    height: 40px;
    margin-top: 13.5px;
    cursor: pointer;
  }
  .upload {
    flex-grow: 1;
    max-width: 300px;
    border: 1px solid black;
    border-radius: 5px;
    font-size: 12px;
    height: 40px;
    margin-top: 13.5px;
    cursor: pointer;
  }
  .save_button {
    background-color: #003366; /* Darker Blue */
    color: #ffffff;
    border: 1px solid #ffffff;
    border-radius: 5px;
    height: 40px;
    margin-top: 13.5px;
    width: 150px;
    cursor: pointer;
  }
  .save_button:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }
  .word {
    padding-left: 20px;
  }

  .width {
    width: 60px;
  }
  .secondLine {
    display: flex;
    flex-direction: row;
    margin-left: 20px;
    justify-content: center;
  }
  .span_at {
    width: 260px;
    border-radius: 5px;
    font-size: 12px;
    height: 40px;
    color: #babecc;
    margin-top: 13.5px;
  }
  .thirdCol {
    display: flex;
    flex-direction: column;
  }
</style>
