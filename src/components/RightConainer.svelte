<script>
  import moment from "moment";
  import { getAllPlanLists } from "../services/page1/planInfoService";
  import { onMount } from "svelte";
  import { utils, writeFile } from "xlsx";

  let projectData = {};
  let projectArray = [];
  let filteredProjects = [];
  let loading = true;
  let error = null;

  // Filter state for each select input
  let selectedStatus = "";
  let selectedScheduleRange = ""; // Schedule range
  let selectedOS = ""; // Operating system (Windows, Unix, etc.)
  let selectedAgentStatus = "";

  onMount(async () => {
    try {
      projectData = await getAllPlanLists();
      projectArray = Object.values(projectData);
      filteredProjects = projectArray;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });

  // Function to filter based on the selected criteria
  function filterProjects() {
    filteredProjects = projectArray.filter((project) => {
      return (
        (selectedStatus === "" ||
          project.ccp_b_finalized === (selectedStatus === "approved")) &&
        (selectedScheduleRange === "" ||
          doesProjectMatchScheduleRange(
            project.ccp_cdate,
            selectedScheduleRange,
          )) &&
        (selectedOS === "" || doesProjectMatchOS(project, selectedOS)) &&
        (selectedAgentStatus === "" ||
          project.uploaded_result === selectedAgentStatus)
      );
    });
  }

  // Function to check if the project matches the selected OS (asset type)
  function doesProjectMatchOS(project, os) {
    if (os === "Windows") {
      return project.asset?.WINDOWS; // Match Windows
    } else if (os === "Unix") {
      return project.asset?.UNIX; // Match Unix
    } else if (os === "Security") {
      return project.asset?.SECURITY; // Match Security Assets
    }
    return false;
  }

  // Function to check if the project date matches the selected schedule range
  function doesProjectMatchScheduleRange(projectDate, range) {
    const projectDateObj = new Date(projectDate);
    const now = new Date();

    if (range === "next7days") {
      const next7Days = new Date();
      next7Days.setDate(now.getDate() + 7);
      return projectDateObj >= now && projectDateObj <= next7Days;
    } else if (range === "past90days") {
      const past90Days = new Date();
      past90Days.setDate(now.getDate() - 90);
      return projectDateObj >= past90Days && projectDateObj <= now;
    }
    return true; // Default, show all if no range selected
  }

  // Function to download Excel
  function downloadExcel() {
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(projectArray);
    utils.book_append_sheet(wb, ws, "Projects");
    writeFile(wb, "projects.xlsx");
  }

  // Function to download Program
  function downloadProgram() {
    const fileUrl = "/path/to/program.zip"; // Update this with the actual path to the file
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "program.zip"; // Specify the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up after the click event
  }
</script>

<header>
  <form action="/action_page.php" class="form_select">
    <!-- Select for filtering by project status -->
    <div class="select_container">
      <select
        bind:value={selectedStatus}
        on:change={filterProjects}
        class="select_input"
      >
        <option value="">프로젝트명</option>
        <option value="approved">완료된 프로젝트</option>
        <option value="pending">진행 중인 프로젝트</option>
      </select>
    </div>

    <!-- Select for filtering by schedule range -->
    <div class="select_container">
      <select
        bind:value={selectedScheduleRange}
        on:change={filterProjects}
        class="select_input"
      >
        <option value="">일정범위</option>
        <option value="next7days">Next 7 Days</option>
        <option value="past90days">Past 90 Days</option>
      </select>
    </div>

    <!-- Select for filtering by operating system (derived from asset type) -->
    <div class="select_container">
      <select
        bind:value={selectedOS}
        on:change={filterProjects}
        class="select_input"
      >
        <option value="">운영체제</option>
        <option value="Windows">Windows</option>
        <option value="Unix">Unix</option>
        <option value="Security">Security</option>
      </select>
    </div>

    <!-- Select for filtering by agent status -->
    <div class="select_container">
      <select
        bind:value={selectedAgentStatus}
        on:change={filterProjects}
        class="select_input"
      >
        <option value="">결과등록상태</option>
        <option value="12">Registered</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  </form>

  <div class="headerButton">
    <button on:click={downloadProgram}> 프로그램다운로드 </button>
    <button on:click={downloadExcel}> 엑셀다운로드 </button>
  </div>
</header>

<main>
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p>Error: {error}</p>
  {:else if filteredProjects.length > 0}
    <div class="projectContainer">
      {#each filteredProjects as project, index}
        <div class="project">
          <div class="projectInfo">
            <div class="firstCol">
              <p>보안점수</p>
              <div class="percentage">
                <p class="box_number">
                  {project?.ccp_security_point > 0
                    ? project?.ccp_security_point
                    : 0}%
                </p>
              </div>
            </div>
            <div class="secondCol">
              <p>제목: {project.ccp_title}</p>
              <p>점검대상: {project.asg_index__asg_title}</p>
              <p>생성자: {project.plan_planer_info__user_name}</p>
            </div>
            <div class="thirdCol">
              <p>진행상태: {project?.ccp_b_finalized ? "완료" : "진행 중"}</p>
              <p>
                점검일시: {moment(project?.plan_start_date).format(
                  "YYYY MM DD",
                )} ~ {moment(project?.plan_end_date).format("YYYY MM DD")}
              </p>
              <p>
                점검방법: {project?.recheck == 0 ? "신규점겅검" : "이행점검"}
              </p>
            </div>
          </div>
          <div class="buttons">
            <button>결과등록</button>
            <button>결과조회</button>
            <button>보고서생성</button>
            <button>재점검실행</button>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p>No projects available based on the selected criteria.</p>
  {/if}
</main>

<style>
  main {
    width: 94%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f7f9fb;
    border-bottom: 1px solid #e0e0e0;
    padding: 20px;
    margin: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  .form_select {
    display: flex;
    gap: 20px;
  }

  .select_container {
    display: flex;
    flex-direction: column;
  }

  .select_input {
    color: #000000;
    padding: 5px;
    border: none;
    border-radius: 5px;
    border: 1px solid black;
    height: 30px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .select_input:hover {
    background-color: #b0b0b0;
  }
  .select_input option {
    background-color: #fff;
    color: #000000;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f7f9fb;
    border-bottom: 1px solid #e0e0e0;
    padding: 20px;
    margin: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  .headerButton button {
    background-color: #0056b3; /* Darker Blue */
    color: #ffffff;
    border: 1px solid #ffffff;
    border-radius: 5px;
    height: 30px;
    width: 120px;
    cursor: pointer;
  }
  .headerButton button:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }
  .projectContainer {
    width: 100%;
    height: 600px;
    display: flex;
    flex-direction: column;
    margin: 20px 20px;
    border: 1px solid #000000;
    box-shadow:
      rgb(204, 219, 232) 3px 3px 6px 0px inset,
      rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
    overflow-y: auto;
    box-sizing: border-box;
    border-radius: 10px;
  }
  .project {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    height: 120px;
    margin-top: 20px;
  }
  .projectInfo {
    display: flex;
    flex-direction: row;
    gap: 100px;
    margin-left: 20px;
    border-radius: 10px;
    padding: 10px 10px;
    background-color: #fff;
    border: 1px solid rgb(179, 179, 179);
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
  }
  .projectInfo p {
    font-size: 12px;
  }
  .percentage {
    font-size: 12px;
    font-weight: bold;
    padding: 10px;
    border-radius: 8px;
    color: #fff; /* White text for contrast */
    text-align: center;
    width: 50px;
    background-color: #28a745;
  }
  .percentage p {
    font-weight: bold;
  }
  .buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 117px;
    justify-content: space-between;
    margin-right: 20px;
  }
  .buttons button {
    font-size: 10px;
    background-color: #4682b4;
    color: #fff;
    font-weight: 500;
    width: 80px;
    padding: 4px;
    cursor: pointer;
  }
  .firstCol {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
