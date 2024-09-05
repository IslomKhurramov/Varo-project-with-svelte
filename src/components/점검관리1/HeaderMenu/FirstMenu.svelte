<div class="container_page">
  <div class="header">
    <button>등록현황조회</button>
    <button>에러내역확인</button>
    <button>등록결과조회</button>
  </div>

  <div class="table_center">
    <div class="table_container">
      <p class="word">점검결과등록</p>
      <div class="first_line">
        <p class="button1 width">자동</p>
        <p class="button2 width">에이전트결과</p>
        <input
          class="input"
          placeholder="점검대상 200대중 180대 업로드 완료 (등록현황을 그래픽으로 표현)"
          readonly
        />
        <button class="save_button">등록내역확인</button>
      </div>
      <p class="word">수동</p>
      <div class="secondLine">
        <div class="thirdCol">
          <div class="first_line">
            <p class="button2">에이전트결과</p>
            <span class="span_at"
              >JSON 파일 업로드 (UNIX/WINDOWS/DBMS/CLOUD…)</span
            >
            <input class="upload" type="file" />
            <button class="save_button">등록내역확인</button>
          </div>
          <div class="first_line">
            <p class="button2">네트워크설정파일</p>
            <span class="span_at">설정파일(TXT) 파일 업로드</span>
            <input class="upload" type="file" />
            <button class="save_button">등록내역확인</button>
          </div>
          <div class="first_line">
            <p class="button2">정보보호시스템</p>
            <span class="span_at">인터뷰파일(EXCEL) 파일 업로드</span>
            <input class="upload" type="file" />
            <button class="save_button">등록내역확인</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Main Container */
  .container_page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    width: 100%;
  }

  /* Header Buttons */
  .header {
    display: flex;
    gap: 12px;
    margin-bottom: 10px;
    width: 100%;
    justify-content: flex-end;
  }

  .header button {
    background-color: #004080;
    color: #ffffff;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: bold;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .header button:hover {
    background-color: #003366;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  /* Table Centering */
  .table_center {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Table Container Styling */
  .table_container {
    width: 100%;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #dddddd;
    margin-bottom: 30px;
  }

  .word {
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 10px;
  }

  /* Row Styling */
  .first_line,
  .secondLine {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
  }
  .secondLine {
    align-items: center;
    justify-content: center;
  }

  /* Button Styling */
  .button1,
  .button2 {
    background-color: #f0f0f0;
    color: #333333;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    border-radius: 5px;
    padding: 8px 12px;
    width: 150px;
    text-align: center;
    border: 1px solid #cccccc;
  }

  .button2 {
    background-color: #e0e0e0;
  }

  /* Input Styling */
  .input {
    flex-grow: 1;
    background-color: #f9f9f9;
    border: 1px solid #cccccc;
    border-radius: 5px;
    padding: 8px;
    font-size: 12px;
    color: #555555;
  }

  .input[readonly] {
    color: #666666;
  }

  .upload {
    border: none;
    background-color: transparent;
    font-size: 12px;
    color: #333333;
    cursor: pointer;
  }

  /* Save Button Styling */
  .save_button {
    background-color: #004080;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    font-size: 12px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .save_button:hover {
    background-color: #003366;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .span_at {
    width: 260px;
    font-size: 12px;
    color: #666666;
    display: flex;
    align-items: center;
  }

  /* Column Layout */
  .thirdCol {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
</style>
