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
  <div>
    <form action="/action_page.php">
      <select name="cars" id="cars" class="select">
        <option value="volvo" class="option">프로젝트명</option>
      </select>
      <select name="cars" id="cars">
        <option value="volvo">일정범위</option>
      </select>
      <select name="cars" id="cars">
        <option value="volvo">생성자</option>
      </select>
      <select name="cars" id="cars">
        <option value="volvo">결과등록상태</option>
      </select>
    </form>
  </div>
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
            <div class="percentage"><p>80%</p></div>
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
  form {
    margin-left: 20px;
    display: flex;
    flex-direction: row;
    gap: 30px;
    flex-wrap: wrap;
    width: 100%;
  }
  form select {
    width: 150px;
    cursor: pointer;
  }

  header {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    margin-top: 20px;
  }
  .headerButton button {
    background-color: #003366; /* Darker Blue */
    color: #ffffff;
    border: 1px solid #ffffff;
    border-radius: 5px;
    height: 40px;
    margin-top: 13.5px;
    width: 150px;
    cursor: pointer;
  }
  .headerButton button:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }
  .projectContainer {
    width: 100%;
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Ensure content starts at the top */
    align-items: center;
    margin: 20px 20px;
    margin-top: 50px;
    border: 1px solid #000000;
    background: #fff;
    box-shadow: 0 4px 8px rgb(255, 255, 255);
    overflow-y: auto; /* Enable scrolling with proper content visibility */
    padding-top: 10px; /* Optional: Add padding if the content is still too close to the top */
    box-sizing: border-box; /* Include padding and border in the element's total width and height */
  }
  .project {
    background-color: #fff;
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
    padding: 10px 10px;
    background-color: #dedede;
    border: 1px solid rgb(179, 179, 179);
    width: 100%;
    box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .projectInfo p {
    font-size: 12px;
  }
  .percentage {
    width: 50px;
    height: 50px;
    border: 1px solid black;
    background-color: yellow;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .buttons {
    display: flex;
    flex-direction: column;
    margin-left: 5px;
    margin-right: 20px;
    height: 120px;
  }
  .buttons button {
    background-color: #003366;
    color: #fff;
    font-weight: 500;
    width: 80px;
    padding: 4px;
    cursor: pointer;
  }
  .firstCol {
    margin-left: 100px;
  }
</style>
