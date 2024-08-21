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
        <div>
          <p>요약 보고서생성</p>
          <p>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="./images/next.png" /> 요약보고서는 프로젝트에 대한 통계 위주의
            요약 내용을 엑셀로 저장
          </p>
        </div>
        <div>
          <p>요약 보고서생성</p>
          <p>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="./images/next.png" /> 요약보고서는 프로젝트에 대한 통계 위주의
            요약 내용을 엑셀로 저장
          </p>
        </div>
        <div>
          <p>요약 보고서생성</p>
          <p>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="./images/next.png" /> 요약보고서는 프로젝트에 대한 통계 위주의
            요약 내용을 엑셀로 저장
          </p>
        </div>
      {:else if reportType === "detailed"}
        <div>
          <p>상세 보고서생성</p>
          <p>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="./images/next.png" />상세보고서는 프로젝트에 대한 세부
            내용을 포함하여 엑셀로 저장
          </p>
        </div>
        <div>
          <p>요약 보고서생성</p>
          <p>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="./images/next.png" />요약보고서는 프로젝트에 대한 통계
            위주의 요약 내용을 엑셀로 저장
          </p>
        </div>
      {:else if reportType === "target"}
        <div>
          <p>점검대상별 보고서 생성</p>
          <p>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="./images/next.png" /> 점검대상별로 구분된 보고서를 엑셀로 저장
          </p>
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    width: 100%;
    justify-content: center;
    border: 1px solid black;
    align-items: center;
    margin-left: 20px;
    margin-top: 40px;
  }
  .container {
    width: 80%; /* Adjust the width as needed */
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 40px;
    margin-bottom: 60px;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    gap: 20px;
  }
  .buttons button {
    background-color: #003366; /* Darker Blue */
    color: #ffffff;
    border: 1px solid #003366;
    border-radius: 5px;
    height: 40px;
    margin-top: 13.5px;
    width: 150px;
    cursor: pointer;
  }
  .buttons button:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }
  .second_container {
    background-color: #dedede;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 12px;
    box-shadow: inset 0 0 2px 2px #888;
    padding: 5px 10px;
  }
  .second_container img {
    width: 15px;
  }
  .second_container p {
    align-items: center;
    display: flex;
  }
</style>
