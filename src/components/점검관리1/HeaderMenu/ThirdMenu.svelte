<script>
  let reportType = "summary"; // State to hold the type of report selected

  function showReport(type) {
    reportType = type; // Update the report type based on the button clicked
  }
</script>

<main>
  <div class="container">
    <div class="buttons">
      <button on:click="{() => showReport('summary')}">요약 보고서생성</button>
      <button on:click="{() => showReport('detailed')}">상세 보고서생성</button>
      <button on:click="{() => showReport('target')}"
        >점검대상별 보고서 생성</button
      >
    </div>
    <div class="second_container">
      {#if reportType === "summary"}
        <div class="report-section">
          <h3>요약 보고서생성</h3>
          <p>
            <img src="./images/next.png" alt="Next Icon" />
            요약보고서는 프로젝트에 대한 통계 위주의 요약 내용을 엑셀로 저장
          </p>
        </div>
        <div class="report-section">
          <h3>요약 보고서생성</h3>
          <p>
            <img src="./images/next.png" alt="Next Icon" />
            요약보고서는 프로젝트에 대한 통계 위주의 요약 내용을 엑셀로 저장
          </p>
        </div>
        <div class="report-section">
          <h3>요약 보고서생성</h3>
          <p>
            <img src="./images/next.png" alt="Next Icon" />
            요약보고서는 프로젝트에 대한 통계 위주의 요약 내용을 엑셀로 저장
          </p>
        </div>
      {:else if reportType === "detailed"}
        <div class="report-section">
          <h3>상세 보고서생성</h3>
          <p>
            <img src="./images/next.png" alt="Next Icon" />
            상세보고서는 프로젝트에 대한 세부 내용을 포함하여 엑셀로 저장
          </p>
        </div>
        <div class="report-section">
          <h3>요약 보고서생성</h3>
          <p>
            <img src="./images/next.png" alt="Next Icon" />
            요약보고서는 프로젝트에 대한 통계 위주의 요약 내용을 엑셀로 저장
          </p>
        </div>
      {:else if reportType === "target"}
        <div class="report-section">
          <h3>점검대상별 보고서 생성</h3>
          <p>
            <img src="./images/next.png" alt="Next Icon" />
            점검대상별로 구분된 보고서를 엑셀로 저장
          </p>
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  /* Main container styling */
  main {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  /* Container for the entire content */
  .container {
    margin-top: 20px;
    width: 100%; /* Slightly larger for better readability */
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  /* Buttons styling */
  .buttons {
    display: flex;
    gap: 15px;
  }

  .buttons button {
    background-color: #0056b3;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    height: 40px;
    font-size: 12px;
    font-weight: bold;
    padding: 10px 20px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .buttons button:hover {
    background-color: #004494;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  /* Second container for report details */
  .second_container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #fafafa;
    padding: 20px;
    border-radius: 8px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  }

  /* Individual report sections */
  .report-section {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }

  .report-section h3 {
    font-size: 12px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 10px;
  }

  .report-section p {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #555555;
  }

  .report-section img {
    width: 20px;
    margin-right: 10px;
  }
</style>
