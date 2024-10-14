<script>
  import moment from "moment";
  import { getAllPlanLists } from "../services/page1/planInfoService";
  import { onMount } from "svelte";
  import { utils, writeFile } from "xlsx";
  import FirstMenu from "./점검관리1/HeaderMenu/FirstMenu.svelte";
  import SecondMenu from "./점검관리1/HeaderMenu/SecondMenu.svelte";
  import ThirdMenu from "./점검관리1/HeaderMenu/ThirdMenu.svelte";
  import FourthMenu from "./점검관리1/HeaderMenu/FourthMenu.svelte";
  import ProjectDetail from "./점검관리1/ProjectDetail.svelte";

  let projectData = {};
  let projectArray = [];
  let filteredProjects = [];
  let loading = true;
  let error = null;
  let currentPage = null;
  let projectIndex = null;
  let tabMenu = null;

  let detailPage = false;
  let selectedProjectIndex = null;

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
    console.log("selectedAgentStatus:", selectedAgentStatus);
    filteredProjects = projectArray.filter((project) => {
      return (
        (selectedStatus === "" ||
          project.ccp_b_finalized.toString() == selectedStatus) &&
        (selectedScheduleRange === "" ||
          doesProjectMatchScheduleRange(
            project.ccp_cdate,
            selectedScheduleRange,
          )) &&
        (selectedOS === "" || doesProjectMatchOS(project, selectedOS)) &&
        (selectedAgentStatus === "" ||
          (selectedAgentStatus === "1" && project.uploaded_result > 0) ||
          (selectedAgentStatus === "0" && project.uploaded_result <= 0))
      );
    });
  }

  function doesProjectMatchOS(project, os) {
    console.log("os:", os);
    if (os === "WINDOWS") {
      return project.asset?.WINDOWS;
    } else if (os === "UNIX") {
      return project.asset?.UNIX;
    } else if (os === "SECURITY") {
      return project.asset?.SECURITY;
    } else if (os === "NETWORK") {
      return project.asset?.NETWORK;
    } else if (os === "DBMS") {
      return project.asset?.DBMS;
    }
    return false;
  }

  // Function to check if the project date matches the selected schedule range
  function doesProjectMatchScheduleRange(projectDate, range) {
    const projectDateObj = new Date(projectDate);
    const now = new Date();

    if (range === "last7days") {
      const last7days = new Date();
      last7days.setDate(now.getDate() - 7);
      return projectDateObj >= last7days && projectDateObj <= now;
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

  const selectPage = (page, menu) => {
    currentPage = page;
    tabMenu = menu;
    // projectIndex = plan_index;
  };

  $: {
    console.log("+tabMenu:", tabMenu);
  }
</script>

<!-- {#if currentPage && !detailPage}
  <div class="container_page1">
    <div class="navbar">
      <div class="header">
        <h3
          on:click={() => selectPage(FirstMenu, "결과등록")}
          class={tabMenu === "결과등록" ? "active" : ""}
        >
          결과등록
        </h3>
        <h3
          on:click={() => selectPage(SecondMenu, "결과조회/변경")}
          class={tabMenu === "결과조회/변경" ? "active" : ""}
        >
          결과조회/변경
        </h3>
        <h3
          on:click={() => selectPage(ThirdMenu, "보고서생성")}
          class={tabMenu === "보고서생성" ? "active" : ""}
        >
          보고서생성
        </h3>
        <h3
          on:click={() => selectPage(FourthMenu, "이력관리")}
          class={tabMenu === "이력관리" ? "active" : ""}
        >
          이력관리
        </h3>
      </div>
    </div>
    <div class="right_menu">
      <svelte:component this={currentPage} bind:projectIndex />
    </div>
  </div>
{:else if detailPage}
  <svelte:component
    this={currentPage}
    projectIndex={selectedProjectIndex}
    {currentPage}
    bind:tabMenu
  />
{:else}
  <header>
    <form action="/action_page.php" class="form_select">
      <div class="select_container">
        <select
          bind:value={selectedStatus}
          on:change={filterProjects}
          class="select_input"
        >
          <option value="">프로젝트명</option>
          <option value="true">완료된 프로젝트</option>
          <option value="false">진행 중인 프로젝트</option>
        </select>
      </div>

      <div class="select_container">
        <select
          bind:value={selectedScheduleRange}
          on:change={filterProjects}
          class="select_input"
        >
          <option value="">일정범위</option>
          <option value="last7days">Past 7 Days</option>
          <option value="past90days">Past 90 Days</option>
        </select>
      </div>

      <div class="select_container">
        <select
          bind:value={selectedOS}
          on:change={filterProjects}
          class="select_input"
        >
          <option value="">운영체제</option>
          <option value="WINDOWS">Windows</option>
          <option value="UNIX">Unix</option>
          <option value="SECURITY">Security</option>
          <option value="NETWORK">Network</option>
          <option value="DBMS">Dbms</option>
        </select>
      </div>

      <div class="select_container">
        <select
          bind:value={selectedAgentStatus}
          on:change={filterProjects}
          class="select_input"
        >
          <option value="">결과등록상태</option>
          <option value="1">Registered</option>
          <option value="0">Pending</option>
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
            <div
              class="projectInfo"
              on:click={() => {
                currentPage = ProjectDetail;
                projectIndex = project.ccp_index;
              }}
            >
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
              <button
                on:click={() => {
                  currentPage = FirstMenu;
                  projectIndex = project.ccp_index;
                }}
              >
                결과등록
              </button>
              <button
                on:click={() => {
                  currentPage = SecondMenu;
                  projectIndex = project.ccp_index;
                }}
              >
                결과조회
              </button>
              <button
                on:click={() => {
                  currentPage = ThirdMenu;
                  projectIndex = project.ccp_index;
                }}
              >
                보고서생성
              </button>
              <button
                on:click={() => {
                  currentPage = FourthMenu;
                  projectIndex = project.ccp_index;
                }}
              >
                이력관리
              </button>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p>No projects available based on the selected criteria.</p>
    {/if}
  </main>
{/if} -->

{#if currentPage & !detailPage}
  <div>1</div>
{:else if detailPage}
  <div>2</div>
{:else}
  <div class="contentsWrap">
    <nav class="tabMenu">
      <ul>
        <li><a href="./inspection_result_create.html">결과등록</a></li>
        <li><a href="./inspection_result_view.html">결과조회/변경</a></li>
        <li><a href="./inspection_report_create.html">보고서생성</a></li>
        <li><a href="./inspection_log.html">이력관리</a></li>
      </ul>
    </nav>

    <article class="contentArea">
      <section class="filterWrap">
        <div>
          <select bind:value={selectedStatus} on:change={filterProjects}>
            <option value="">프로젝트명</option>
            <option value="true">완료된 프로젝트</option>
            <option value="false">진행 중인 프로젝트</option>
          </select>
          <select bind:value={selectedScheduleRange} on:change={filterProjects}>
            <option value="">일정범위</option>
            <option value="last7days">Past 7 Days</option>
            <option value="past90days">Past 90 Days</option>
          </select>
          <select bind:value={selectedOS} on:change={filterProjects}>
            <option value="">운영체제</option>
            <option value="WINDOWS">Windows</option>
            <option value="UNIX">Unix</option>
            <option value="SECURITY">Security</option>
            <option value="NETWORK">Network</option>
            <option value="DBMS">Dbms</option>
          </select>
          <select bind:value={selectedAgentStatus} on:change={filterProjects}>
            <option value="">결과등록상태</option>
            <option value="1">Registered</option>
            <option value="0">Pending</option>
          </select>
          <!-- <button type="button" class="btn btnPrimary">
            <img src="./assets/images/icon/search.svg" /> 조회
          </button> -->
          <button type="button" class="btn btnPrimary">
            <img src="./assets/images/icon/download.svg" />
            엑셀 다운로드
          </button>
        </div>
      </section>
      <section>
        <div class="tableListWrap">
          <table class="tableList">
            <colgroup>
              <col style="width:100px;" />
              <col />
              <col style="width:200px;" />
              <col style="width:100px;" />
              <col />
              <col />
              <col style="width:190px;" />
              <col style="width:30px;" />
            </colgroup>
            <thead>
              <tr>
                <th>보안점수</th>
                <th>제목</th>
                <th>점검대상</th>
                <th>생성자</th>
                <th>진행상태</th>
                <th>점검일시</th>
                <th>점검방법</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {#if filteredProjects && filteredProjects?.length !== 0}
                {#each filteredProjects as project, index}
                  <tr>
                    <td class="circleTd">
                      <div class="circle" data-percent="100" data-offset="440">
                        <svg width="" height="" viewBox="0 0 150 150">
                          <circle
                            cx="75"
                            cy="75"
                            r="70"
                            stroke={"#F2F2F2"}
                            stroke-width="10"
                            fill="none"
                          />
                          <circle
                            class="progress"
                            cx="75"
                            cy="75"
                            r="70"
                            stroke={project?.ccp_security_point > 0
                              ? project?.ccp_security_point <= 33
                                ? "#FF1500"
                                : project?.ccp_security_point <= 66
                                  ? "#4AC93F"
                                  : "#0067FF"
                              : "#0067FF"}
                            stroke-width="10"
                            fill="none"
                            stroke-dasharray="440"
                            stroke-dashoffset="440"
                            stroke-linecap="round"
                            transform="rotate(-90 75 75)"
                            style={`stroke: ${
                              project?.ccp_security_point > 0
                                ? project?.ccp_security_point <= 33
                                  ? "#FF1500"
                                  : project?.ccp_security_point <= 66
                                    ? "#4AC93F"
                                    : "#0067FF"
                                : "#0067FF"
                            }; stroke-dashoffset: ${
                              440 -
                              (440 *
                                parseInt(
                                  project?.ccp_security_point > 0
                                    ? project?.ccp_security_point
                                    : 0,
                                )) /
                                100
                            };`}
                          />
                        </svg>
                        <div class="percent">
                          <span
                            >{project?.ccp_security_point > 0
                              ? project?.ccp_security_point
                              : 0}%</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="textoverflowLine1">
                      {project.ccp_title}
                    </td>
                    <td>
                      {project?.asg_index__asg_title} (총
                      {parseInt(project?.asset["UNIX"] ?? 0) +
                        parseInt(project?.asset["WINDOWS"] ?? 0) +
                        parseInt(project?.asset["NETWORK"] ?? 0) +
                        parseInt(project?.asset["WEB"] ?? 0) +
                        parseInt(project?.asset["DBMS"] ?? 0)}대)
                      <div class="tableSummary">
                        (유닉스:{project?.asset["UNIX"]}대, 윈도우: {project
                          ?.asset["WINDOWS"]}대, NETWORK: {project?.asset[
                          "NETWORK"
                        ]}대, WEB: {project?.asset["WEB"]}대, DBMS: {project
                          ?.asset["DBMS"]}대)
                      </div>
                    </td>
                    <td> {project.plan_planer_info__user_name} </td>
                    <td>
                      <span class="badge badgePrimary">
                        {project?.ccp_b_finalized ? "완료" : "진행 중"}
                      </span>
                      <div class="tableSummary">(18/28대, 78% 결과 수집)</div>
                    </td>
                    <td>
                      {moment(project?.plan_start_date).format("YYYY MM DD")} ~ {moment(
                        project?.plan_end_date,
                      ).format("YYYY MM DD")}
                    </td>
                    <td>
                      {project?.recheck == 0 ? "신규점겅검" : "이행점검"}
                    </td>
                    <td class="tableTootipWrap">
                      <button
                        type="button"
                        class="tableTootip"
                        onclick="toggleTooltip(this)"
                        ><img src="./assets/images/icon/options.svg" /></button
                      >
                      <div class="tooltip-modal" style="display: none;">
                        <ul>
                          <li>
                            <a
                              href="javascript:void(0)"
                              on:click={() => {
                                currentPage = FirstMenu;
                                projectIndex = project.ccp_index;
                              }}
                            >
                              결과등록
                            </a>
                          </li>
                          <li>
                            <a
                              href="javascript:void(0)"
                              on:click={() => {
                                currentPage = SecondMenu;
                                projectIndex = project.ccp_index;
                              }}
                            >
                              결과조회
                            </a>
                          </li>
                          <li>
                            <a
                              href="javascript:void(0)"
                              on:click={() => {
                                currentPage = ThirdMenu;
                                projectIndex = project.ccp_index;
                              }}
                            >
                              보고서생성
                            </a>
                          </li>
                          <li>
                            <a
                              href="javascript:void(0)"
                              on:click={() => {
                                currentPage = FourthMenu;
                                projectIndex = project.ccp_index;
                              }}
                            >
                              이력관리
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
        <!-- <div class="paginationWrap">
          <div class="totalCount">Total Projects: <span>146</span></div>
          <div class="pagination">
            <a href="" class="active">1</a>
            <a href="">2</a>
            <a href="">...</a>
            <a href="">4</a>
            <a href="">&gt;</a>
          </div>
        </div> -->
      </section>
    </article>
  </div>
{/if}
