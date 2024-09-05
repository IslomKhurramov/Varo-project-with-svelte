<script>
  let projects = [
    {
      projectTitle: "varo",
      inspectionTarget: "자산그룹1",
      constructor: "홍길동",
      progress: "점검진행진행중",
      inspectionDate: "date",
      inspectionMethod: "정기점검",
    },
    {
      projectTitle: "varo",
      inspectionTarget: "자산그룹1",
      constructor: "홍길동",
      progress: "점검진행진행중",
      inspectionDate: "date",
      inspectionMethod: "정기점검",
    },
    {
      projectTitle: "varo",
      inspectionTarget: "자산그룹1",
      constructor: "홍길동",
      progress: "점검진행진행중",
      inspectionDate: "date",
      inspectionMethod: "정기점검",
    },
    {
      projectTitle: "varo",
      inspectionTarget: "자산그룹1",
      constructor: "홍길동",
      progress: "점검진행진행중",
      inspectionDate: "date",
      inspectionMethod: "정기점검",
    },
    {
      projectTitle: "varo",
      inspectionTarget: "자산그룹1",
      constructor: "홍길동",
      progress: "점검진행진행중",
      inspectionDate: "date",
      inspectionMethod: "정기점검",
    },
    {
      projectTitle: "varo",
      inspectionTarget: "자산그룹1",
      constructor: "홍길동",
      progress: "점검진행진행중",
      inspectionDate: "date",
      inspectionMethod: "정기점검",
    },
    {
      projectTitle: "varo",
      inspectionTarget: "자산그룹1",
      constructor: "홍길동",
      progress: "점검진행진행중",
      inspectionDate: "date",
      inspectionMethod: "정기점검",
    },
  ];
</script>

<header>
  <form action="/action_page.php" class="form_select">
    <div class="select_container">
      <select name="approval_status" id="approval_status" class="select_input">
        <option value="pending">프로젝트명</option>
        <option value="approved">운영체제</option>
        <option value="rejected">에이전트여부</option>
        <option value="rejected">등록승인여부</option>
      </select>
    </div>
    <div class="select_container">
      <select name="asset_group" id="asset_group" class="select_input">
        <option value="network">일정범위</option>
        <option value="endpoint">Endpoint Security</option>
        <option value="cloud">Cloud Security</option>
      </select>
    </div>
    <div class="select_container">
      <select
        name="operating_system"
        id="operating_system"
        class="select_input"
      >
        <option value="windows">생성자</option>
        <option value="linux">Linux</option>
        <option value="macos">macOS</option>
      </select>
    </div>
    <div class="select_container">
      <select name="agent_status" id="agent_status" class="select_input">
        <option value="active">결과등록상태</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  </form>

  <div class="headerButton">
    <button> 프로그램다운로드 </button>
    <button> 엑셀다운로드 </button>
  </div>
</header>

<main>
  <div class="projectContainer">
    {#each projects as project, index}
      <div class="project">
        <div class="projectInfo">
          <div class="firstCol">
            <p>보안점수</p>
            <div class="percentage"><p class="box_number">80%</p></div>
          </div>
          <div class="secondCol">
            <p>제목: {project.projectTitle}</p>
            <p>점검대상: {project.inspectionTarget}</p>
            <p>생성자: {project.constructor}</p>
          </div>
          <div class="thirdCol">
            <p>진행상태: {project.progress}</p>
            <p>점검일시: {project.date}</p>
            <p>점검방법: {project.inspectionMethod}</p>
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
