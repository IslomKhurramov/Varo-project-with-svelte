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
  import { toggleTooltip } from "../../public/assets/js/common.js";
  import { navigate } from "svelte-routing";
  import RightContainerMenu from "./점검관리1/RightContainerMenu.svelte";
  import { errorAlert, successAlert } from "../shared/sweetAlert";
  import SixthMenu from "./점검관리1/HeaderMenu/SixthMenu.svelte";
  import { setFinalPlanSecurityPoint } from "../services/result/resultService";

  export let selectPageMain;
  export let activeMenu;
  export let plan_index;
  export let dataRefetch;
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
      errorAlert(err?.message);
    } finally {
      loading = false;
    }
  });

  // Function to filter based on the selected criteria
  function filterProjects() {
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
    currentPageNum = 1; // Reset to first page when filtering
  }

  function doesProjectMatchOS(project, os) {
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

  function downloadCSV() {
    const csvRows = [];
    const headers = Object.keys(filteredProjects[0]);
    csvRows.push(headers.join(",")); // Add headers

    for (const row of filteredProjects) {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '\\"'); // Escape quotes
        return `"${escaped}"`; // Wrap in quotes
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create a link to download the file
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "table_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function resetFilters() {
    selectedStatus = "";
    selectedScheduleRange = "";
    selectedOS = "";
    try {
      projectData = await getAllPlanLists();
      projectArray = Object.values(projectData);
      filteredProjects = projectArray;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  const clickSecyurityPoint = async (plan_index) => {
    try {
      if (!plan_index) return false;
      const response = await setFinalPlanSecurityPoint(plan_index);

      projectData = await getAllPlanLists();
      projectArray = Object.values(projectData);
      filteredProjects = projectArray;

      successAlert(response);
    } catch (err) {
      loading = false;
      errorAlert(err?.message);
    }
  };

  let sortField = ""; // No default sort field
  let sortAscending = true; // Default to ascending

  function handleSort(field) {
    if (sortField === field) {
      sortAscending = !sortAscending;
    } else {
      sortField = field;
      sortAscending = true;
    }
    sortProjects();
  }

  function sortProjects() {
    if (!sortField || !filteredProjects) return;

    filteredProjects = [...filteredProjects].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "plan_start_date" || sortField === "plan_end_date") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal === bVal) return 0;
      const comparison = aVal > bVal ? 1 : -1;
      return sortAscending ? comparison : -comparison;
    });
  }

  let currentPageNum = 1;
  let itemsPerPage = 10;
  let totalPages = 0;

  $: {
    if (filteredProjects) {
      totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    }
  }

  $: paginatedProjects = filteredProjects?.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage,
  );

  $: pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPageNum = page;
    }
  }

  $: baseIndex = filteredProjects?.length - (currentPageNum - 1) * itemsPerPage;
</script>

<div
  style="overflow: scroll; height: 100vh; width: calc(100% - 280px);"
  class={`contentsWrap ${tabMenu == "결과등록" && "resultCreate"} ${tabMenu == "결과조회/변경" && "resultView"} ${tabMenu == "보고서생성" && "reportCreate"} ${tabMenu == "이력관리" && "logWrap"}`}
>
  <nav class="tabMenu">
    <ul>
      <li class={tabMenu == "결과등록" && "active"}>
        <a
          href="javascript:void(0)"
          on:click={() => {
            currentPage = FirstMenu;
            tabMenu = "결과등록";
          }}
        >
          결과등록
        </a>
      </li>
      <li class={tabMenu == "결과조회/변경" && "active"}>
        <a
          href="javascript:void(0)"
          on:click={() => {
            currentPage = SecondMenu;
            tabMenu = "결과조회/변경";
          }}
        >
          결과조회/변경
        </a>
      </li>
      <li class={tabMenu == "보고서생성" && "active"}>
        <a
          href="javascript:void(0)"
          on:click={() => {
            currentPage = ThirdMenu;
            tabMenu = "보고서생성";
          }}
        >
          보고서생성
        </a>
      </li>
      <li class={tabMenu == "이력관리" && "active"}>
        <a
          href="javascript:void(0)"
          on:click={() => {
            currentPage = FourthMenu;
            tabMenu = "이력관리";
          }}
        >
          이력관리
        </a>
      </li>
      <li class={tabMenu == "점검프로그램다운로드" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => selectPage(SixthMenu, "점검프로그램다운로드")}
        >
          점검프로그램다운로드
        </a>
      </li>
      {#if tabMenu}
        <li>
          <!-- <a
            href="javascript:void(0);"
            on:click={() => {
              navigate(window.location?.pathname == "/" ? "/page1" : "/");
            }}
          >
            돌아가기
          </a> -->
          <button
            class="btn btnPrimary"
            on:click={() => {
              navigate(window.location?.pathname == "/" ? "/page1" : "/");
            }}
          >
            돌아가기
          </button>
        </li>
      {/if}
    </ul>
  </nav>

  {#if currentPage}
    <svelte:component
      this={currentPage}
      bind:projectIndex
      {plan_index}
      {dataRefetch}
    />
    <!-- {:else if detailPage}
  <svelte:component
    this={currentPage}
    projectIndex={selectedProjectIndex}
    {currentPage}
    bind:tabMenu
  /> -->
  {:else}
    <div class="scroll-div" style="height:calc(-178px + 100vh); padding: 0;">
      <article class="contentArea">
        <section class="filterWrap">
          <div>
            <select
              bind:value={selectedStatus}
              on:change={filterProjects}
              style="width: 170px;"
            >
              <option value="">프로젝트명</option>
              <option value="true">완료된 프로젝트</option>
              <option value="false">진행 중인 프로젝트</option>
            </select>
            <select
              bind:value={selectedScheduleRange}
              on:change={filterProjects}
              style="width: 170px;"
            >
              <option value="">일정범위</option>
              <option value="last7days">Past 7 Days</option>
              <option value="past90days">Past 90 Days</option>
            </select>
            <select
              bind:value={selectedOS}
              on:change={filterProjects}
              style="width: 170px;"
            >
              <option value="">운영체제</option>
              <option value="WINDOWS">Windows</option>
              <option value="UNIX">Unix</option>
              <option value="SECURITY">Security</option>
              <option value="NETWORK">Network</option>
              <option value="DBMS">Dbms</option>
            </select>
            <button
              type="button"
              class="btn btnPrimary"
              on:click={resetFilters}
            >
              <img src="./assets/images/reset.png" alt="search" />
              초기화
            </button>
            <button type="button" class="btn btnPrimary" on:click={downloadCSV}>
              <img src="./assets/images/icon/download.svg" class="excel-img" />
              엑셀 다운로드
            </button>
          </div>
        </section>
        <section>
          <div
            class="tableListWrap"
            style="height: calc(-374px + 100vh); overflow: auto;"
          >
            <table class="tableList">
              <colgroup>
                <col style="width: 4%;" />
                <col style="width:6%;" />
                <col style="width: 13%;" />
                <col style="width:30%;" />
                <col style="width:5%;" />
                <col style="width:5%;" />
                <col style="width:12%;" />
                <col style="width:5%;" />
                <col style="width:2%;" />
              </colgroup>
              <thead>
                <tr>
                  <th class="text-center" style="font-size: 16px;">번호</th>
                  <th class="text-center" style="font-size: 16px;">보안점수</th>
                  <th
                    class="text-center"
                    style="font-size: 16px;"
                    on:click={() => handleSort("ccp_title")}
                    >제목 <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      style="transform: rotate({sortField === 'ccp_title' &&
                      sortAscending
                        ? '0deg'
                        : '180deg'});
                            transition: transform 0.2s;"
                      width="16px"
                      height="16px"
                    >
                      <path
                        d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3 96 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-301.7 32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 480l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l224 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32z"
                        fill={"#0067ff"}
                      />
                    </svg>
                  </th>
                  <th class="text-center" style="font-size: 16px;">점검대상</th>
                  <th class="text-center" style="font-size: 16px;">생성자</th>
                  <th class="text-center" style="font-size: 16px;">진행상태</th>
                  <th
                    class="text-center"
                    style="font-size: 16px;"
                    on:click={() => handleSort("plan_start_date")}
                    >점검일시 <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      style="transform: rotate({sortField ===
                        'plan_start_date' && sortAscending
                        ? '0deg'
                        : '180deg'});
                            transition: transform 0.2s;"
                      width="16px"
                      height="16px"
                    >
                      <path
                        d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3 96 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-301.7 32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 480l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l224 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32z"
                        fill={"#0067ff"}
                      />
                    </svg>
                  </th>
                  <th class="text-center" style="font-size: 16px;">점검방법</th>
                  <th class="text-center" style="font-size: 16px;"></th>
                </tr>
              </thead>
              <tbody>
                {#if paginatedProjects && paginatedProjects?.length !== 0}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  {#each paginatedProjects as project, index}
                    <tr
                      on:click={() => {
                        currentPage = ProjectDetail;
                        projectIndex = project.ccp_index;
                        selectPageMain(RightContainerMenu, project);
                      }}
                    >
                      <td class="text-center">{baseIndex - index}</td>
                      <td class="circleTd">
                        <div
                          class="circle"
                          data-percent="100"
                          data-offset="440"
                        >
                          <svg viewBox="0 0 150 150">
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
                        {parseInt(project?.asset?.["UNIX"] ?? 0) +
                          parseInt(project?.asset?.["WINDOWS"] ?? 0) +
                          parseInt(project?.asset?.["NETWORK"] ?? 0) +
                          parseInt(project?.asset?.["WEB"] ?? 0) +
                          parseInt(project?.asset?.["DBMS"] ?? 0)}대)
                        <div class="tableSummary">
                          ({project?.asset?.["UNIX"]
                            ? `유닉스: ${project?.asset?.["UNIX"]}대, `
                            : ""}
                          {project?.asset?.["WINDOWS"]
                            ? `윈도우: ${project?.asset?.["WINDOWS"]}대, `
                            : ""}
                          {project?.asset?.["NETWORK"]
                            ? `NETWORK: ${project?.asset?.["NETWORK"]}대, `
                            : ""}
                          {project?.asset?.["WEB"]
                            ? `WEB: ${project?.asset?.["WEB"]}대, `
                            : ""}
                          {project?.asset?.["DBMS"]
                            ? `DBMS: ${project?.asset?.["DBMS"]}대`
                            : ""}
                          )
                        </div>
                      </td>
                      <td class="text-center">
                        {project.plan_planer_info__user_name}
                      </td>
                      <td class="text-center">
                        <span class="badge badgePrimary">
                          {project?.ccp_b_finalized ? "완료" : "진행 중"}
                        </span>
                        <!-- <div class="tableSummary">(18/28대, 78% 결과 수집)</div> -->
                      </td>
                      <td class="text-center">
                        {moment(project?.plan_start_date).format("YYYY MM DD")} ~
                        {moment(project?.plan_end_date).format("YYYY MM DD")}
                      </td>
                      <td class="text-center">
                        {project?.recheck == 0 ? "신규점검" : "이행점검"}
                      </td>
                      <td
                        class="tableTootipWrap text-center"
                        style="background: none; position: relative;"
                        on:click={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <button
                          style="width: 100%;"
                          type="button"
                          class="tableTootip"
                          on:click={(e) => {
                            e.stopPropagation();
                            toggleTooltip(e);
                          }}
                        >
                          <img src="./assets/images/icon/options.svg" />
                        </button>
                        <div
                          class="tooltip-modal"
                          style="display: none; right: -16px;"
                        >
                          <ul>
                            <li>
                              <a
                                href="javascript:void(0)"
                                on:click={() => {
                                  currentPage = FirstMenu;
                                  projectIndex = project.ccp_index;
                                  tabMenu = "결과등록";
                                  activeMenu = project.ccp_index;
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
                                  tabMenu = "결과조회/변경";
                                  activeMenu = project.ccp_index;
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
                                  tabMenu = "보고서생성";
                                  activeMenu = project.ccp_index;
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
                                  tabMenu = "이력관리";
                                  activeMenu = project.ccp_index;
                                }}
                              >
                                이력관리
                              </a>
                            </li>
                            <li>
                              <a
                                href="javascript:void(0)"
                                on:click={() =>
                                  clickSecyurityPoint(project.ccp_index)}
                              >
                                보안점수확정
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
          <div class="pagination_box">
            <nav class="pagination">
              <button
                on:click={() => goToPage(currentPageNum - 1)}
                disabled={currentPageNum === 1}
              >
                &lsaquo;
              </button>

              {#each pageNumbers as pageNum}
                <button
                  class={pageNum === currentPageNum ? "selected" : ""}
                  on:click={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              {/each}

              <button
                on:click={() => goToPage(currentPageNum + 1)}
                disabled={currentPageNum === totalPages}
              >
                &rsaquo;
              </button>
            </nav>
          </div>
        </section>
      </article>
    </div>
  {/if}
</div>

<style>
  * {
    font-size: 16px;
  }
  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }
  .btn:hover {
    color: #fff;
    background-color: #0067ff;
  }
  .contentsWrap::-webkit-scrollbar {
    display: none;
  }
  thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }
  .backImage {
    cursor: pointer;
    width: 24px;
  }

  .scroll-div {
    height: 77vh;
    padding-bottom: 60px;
  }

  .excel-img {
    filter: invert(45%) sepia(100%) saturate(550%) hue-rotate(195deg)
      brightness(100%) contrast(98%);
  }

  .pagination_box {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-top: 20px;
    padding: 10px 0;
    background-color: #fff;
    /* box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1); */
  }

  .pagination button {
    border: none !important;
    padding: 8px 12px;
    margin: 0 4px;
    cursor: pointer;
    border-radius: 5px;
  }

  .pagination button.selected {
    background-color: #007bff;
    color: #fff;
  }

  .pagination button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination button:hover:not([disabled]) {
    background-color: #d4d4d4;
  }
</style>
