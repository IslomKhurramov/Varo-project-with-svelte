<script>
  // Mock Data for demonstration purposes
  let projectTitle = "프로젝트1 어쩌고 저쩌고...";
  let targetGroups = "자산그룹1 (총 28대)";
  let inspectionDetails = "유닉스: 11대, 윈도우 20대, 맥: 10대";
  let producer = "홍길동";
  let progress = "점검진행률: 진행완료 (28/28대, 100% 결과 수집)";
  let startDate = "2024년 7월 11일";
  let endDate = "2024년 7월 12일";
  let method = "정기점검 (또는 긴급점검)";
  let overallSecurityLevel = 80;

  // Data for charts
  let unixRegistration = 45;
  let networkRegistration = 65;
  let dbmsRegistration = 85;

  let securityLevel = {
    overall: 80,
    unix: 30,
    windows: 50,
  };

  let criticalWeaknesses = [
    { name: "계정관리", value: 10 },
    { name: "서비스관리", value: 40 },
    { name: "취약점1", value: 38 },
    { name: "취약점2", value: 38 },
  ];

  // Pie chart data
  let pieData = [
    { label: "전체등록현황", value: 45, color: "#4caf50" },
    { label: "NETWORK", value: 35, color: "#ffeb3b" },
    { label: "DBMS", value: 20, color: "#f44336" },
  ];

  // Function to calculate the path for the pie slices
  function calculatePieSlice(value, total, radius, startAngle) {
    const angle = (value / total) * 2 * Math.PI;
    const x1 = radius * Math.cos(startAngle);
    const y1 = radius * Math.sin(startAngle);
    const x2 = radius * Math.cos(startAngle + angle);
    const y2 = radius * Math.sin(startAngle + angle);
    const largeArcFlag = angle > Math.PI ? 1 : 0;

    return `
      M 0 0 
      L ${x1} ${y1} 
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} 
      Z
    `;
  }
</script>

<main>
  <div class="main-container">
    <div class="container">
      <!-- Overview Section -->
      <h2>[개요]</h2>
      <div class="overview">
        <div class="percentage1">
          <p><strong>보안수준</strong></p>
          <div class="security-level">
            <div class="score">{overallSecurityLevel}%</div>
          </div>
        </div>
        <div class="project-details">
          <p>제목: {projectTitle}</p>
          <p>점검대상: {targetGroups}</p>
          <p>{inspectionDetails}</p>
          <p>생성자: {producer}</p>
          <p>{progress}</p>
          <p>점검일시: {startDate} ~ {endDate}</p>
          <p>점검방법: {method}</p>
        </div>
        <div class="actions">
          <button>결과등록</button>
          <button>결과조회</button>
          <button>변경</button>
          <button>삭제</button>
        </div>
      </div>

      <!-- Registration Status Section -->
      <h2>[결과 등록 현황]</h2>
      <div class="registration-status">
        <div class="status">
          <div class="pie-chart">
            <div class="chart-label">전체등록현황</div>
            <svg width="160" height="160" viewBox="-80 -80 160 160">
              {#each pieData as { value, color }, i (i)}
                <path
                  d="{calculatePieSlice(
                    value,
                    100,
                    80,
                    pieData
                      .slice(0, i)
                      .reduce(
                        (acc, slice) => acc + (slice.value / 100) * 2 * Math.PI,
                        0
                      )
                  )}"
                  fill="{color}"
                ></path>
              {/each}
            </svg>
          </div>
          <div class="bar-charts">
            <div class="bar">
              <div class="label">UNIX</div>
              <div class="bar-fill" style="width: {unixRegistration}%;">
                {unixRegistration}% 등록
              </div>
            </div>
            <div class="bar">
              <div class="label">NETWORK</div>
              <div class="bar-fill" style="width: {networkRegistration}%;">
                {networkRegistration}% 등록
              </div>
            </div>
            <div class="bar">
              <div class="label">DBMS</div>
              <div class="bar-fill" style="width: {dbmsRegistration}%;">
                {dbmsRegistration}% 등록
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Level Section -->
      <h2>[보안수준]</h2>
      <div class="security-level-section">
        <div>
          <p>전체보안수준: {securityLevel.overall}%</p>
          <p>유닉스: {securityLevel.unix} %</p>
          <p>윈도우: {securityLevel.windows} %</p>
        </div>
        <div class="bar-charts2">
          {#each criticalWeaknesses as weakness}
            <div class="bar">
              <div class="label">{weakness.name}</div>
              <div class="bar-fill2" style="width: {weakness.value}%;">
                {weakness.value}% 등록
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Critical Weaknesses Section -->
      <h2>[주요 취약점]</h2>
      <div class="critical-weaknesses">
        <div class="bar-chart">
          <p>대상 / 점검그룹 / 점검항목 / 위험도</p>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  /* Main container centered and wider */
  .main-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    padding: 40px 0;
  }

  .container {
    width: 900px; /* Increased width */
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
  }

  .overview,
  .registration-status,
  .security-level-section,
  .critical-weaknesses {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    background-color: #fafafa;
  }

  h2 {
    margin-bottom: 15px;
    font-size: 20px;
    color: #333;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 10px;
  }

  .overview {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .percentage1 {
    width: 80px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
  }

  .security-level {
    background-color: #4caf50;
    color: white;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 20px;
    border-radius: 50%;
    box-shadow:
      inset 0 0 35px 5px rgba(0, 0, 0, 0.1),
      inset 0 2px 1px 1px rgba(255, 255, 255, 0.5),
      inset 0 -2px 1px rgba(0, 0, 0, 0.1);
  }

  .project-details p {
    margin: 5px 0;
    font-size: 14px;
    color: #555;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .actions button {
    padding: 8px 12px;
    background-color: #1976d2;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .actions button:hover {
    background-color: #1565c0;
    transform: translateY(-2px);
  }

  .status {
    display: flex;
    justify-content: space-between;
  }

  .pie-chart {
    width: 100px;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .chart-label {
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 14px;
    color: #555;
  }

  .bar-charts {
    flex-grow: 1;
    padding-left: 20px;
  }

  .bar-charts2 {
    flex-grow: 1;
    padding-left: 50px;
  }

  .bar {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .bar .label {
    width: 100px;
    font-weight: bold;
    font-size: 14px;
    color: #555;
  }

  .bar .bar-fill {
    height: 20px;
    background-color: #4caf50;
    color: white;
    text-align: right;
    padding-right: 5px;
    line-height: 20px;
    border-radius: 5px;
    font-size: 14px;
  }

  .bar .bar-fill2 {
    height: 20px;
    background-color: #2196f3;
    color: white;
    text-align: right;
    padding-right: 5px;
    line-height: 20px;
    border-radius: 5px;
    font-size: 14px;
  }

  .security-level-section p {
    margin: 5px 0;
    font-size: 14px;
    color: #555;
  }

  .critical-weaknesses .bar-chart {
    padding: 10px;
    color: #555;
  }
</style>
