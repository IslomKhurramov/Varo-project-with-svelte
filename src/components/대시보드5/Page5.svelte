<script>
  import { Doughnut, Bar } from "svelte-chartjs";
  import { Chart as ChartJS, registerables } from "chart.js";

  ChartJS.register(...registerables);

  // Data for the Doughnut Chart (위약점조치현황)
  const doughnutData = {
    labels: ["Complete", "In Progress", "Not Started"],
    datasets: [
      {
        data: [40, 30, 30],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  // Data for the Bar Chart (프로젝트등록현황)
  const barData = {
    labels: ["Project A", "Project B", "Project C"],
    datasets: [
      {
        label: "Number of Registrations",
        backgroundColor: "#42A5F5",
        borderColor: "#1E88E5",
        borderWidth: 1,
        data: [50, 75, 100],
      },
    ],
  };

  // Data for the Bar Chart (위약점 보유자산 Top 5)
  const topAssetsData = {
    labels: ["Asset 1", "Asset 2", "Asset 3", "Asset 4", "Asset 5"],
    datasets: [
      {
        label: "Vulnerabilities",
        backgroundColor: "#FF6384",
        data: [12, 19, 3, 5, 2],
      },
    ],
  };

  // Data for the Bar Chart (위약점 Top 5)
  const topVulnerabilitiesData = {
    labels: ["Vuln 1", "Vuln 2", "Vuln 3", "Vuln 4", "Vuln 5"],
    datasets: [
      {
        label: "Occurrences",
        backgroundColor: "#FF6384",
        data: [15, 20, 7, 10, 5],
      },
    ],
  };
</script>

<div class="dashboard-container">
  <div class="header">
    <button>공지사항</button>
    <button>조치사항 알림</button>
    <button>자료실</button>
    <div class="summary">
      <div>등록된 프로젝트: 10개</div>
      <div>완료된 프로젝트: 10개</div>
      <div>등록된 자산: 10개</div>
    </div>
  </div>

  <div class="content">
    <!-- 위약점조치현황 (Doughnut Chart) -->
    <div class="section large">
      <h3>위약점조치현황</h3>
      <Doughnut {doughnutData} />
    </div>

    <!-- 프로젝트등록현황 (Bar Chart) -->
    <div class="section large">
      <h3>프로젝트등록현황</h3>
      <Bar {barData} />
    </div>

    <!-- 위약점 보유자산 Top 5 (Bar Chart) -->
    <div class="section">
      <h3>위약점 보유자산 Top 5</h3>
      <Bar {topAssetsData} />
    </div>

    <!-- 위약점 Top 5 (Bar Chart) -->
    <div class="section">
      <h3>위약점 Top 5</h3>
      <Bar {topVulnerabilitiesData} />
    </div>
  </div>
</div>

<style>
  .dashboard-container {
    font-family: Arial, sans-serif;
    color: #333;
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    background-color: #f5f5f5;
  }

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #0062cc;
    padding: 10px 20px;
    border-radius: 8px;
    color: #fff;
  }

  .header button {
    background-color: #fff;
    border: none;
    padding: 8px 12px;
    margin: 0 5px;
    border-radius: 4px;
    cursor: pointer;
    color: #0062cc;
    font-weight: bold;
  }

  .header button:hover {
    background-color: #e0e0e0;
  }

  .summary {
    display: flex;
    gap: 20px;
    font-size: 14px;
  }

  .content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    gap: 20px;
  }

  .section {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .section.large {
    grid-column: span 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .section h3 {
    font-size: 16px;
    color: #0062cc;
    margin-bottom: 10px;
  }
</style>
