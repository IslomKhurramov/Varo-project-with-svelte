<script>
  let activeTab = "action"; // 'action' or 'protocol'
  let actionActive = false;

  let hostData = [
    {
      name: "A16()",
      ipadd: "192.168.01.1",
      time: "2024.07.07 1:31 오후",
    },
  ];

  let projectsData = [
    {
      checklist: "[ U -53 ] 사용자 shell 점검",
      itemGroup: "[ UNIX ] 계정 관리",
      inspectionCriteria: "하",
      riskLevel: {
        vulnerability:
          " 로그인이 필요하지 않은 계정에 /bin/false(/sbin/nologin) 쉘이 부여되어 있는 경우 ",
        good: " 로그인이 필요하지 않은 계정에 /bin/false(/sbin/nologin) 쉘이 부여되어 있는 경우 ",
      },
      modifyInspectionResults: "",
      inspectionStatus: "2020.12.15",
      evidenceImage: "사용하지 않는 계정에 쉘이 적용되어 있지 않음",
      improve:
        "로그인이 필요하지 않은 계정에 대해 /bin/false(/sbin/nologin) 쉘 부여",
      inprovement:
        "일반적으로 로그인이 불필요한 계정 daemon, bin, sys, adm, listen, nobody, nobody4, noaccess, diag, operator, games, gopher 등 일반적으로 UID 100 이하 60000 이상의 시 스템 계정 해당",
    },
  ];
</script>

<div class="tabs">
  <button
    class:active="{activeTab === 'action'}"
    on:click="{() => (activeTab = 'action')}"
    class="tab"
  >
    액션등록
  </button>
  <button
    class:active="{activeTab === 'protocol'}"
    on:click="{() => (activeTab = 'protocol')}"
    class="tab"
  >
    기본프로토콜
  </button>
</div>

<div class="content">
  {#if activeTab === "action"}
    <!-- 액션등록 Content -->
    <div class="action-registration">
      <label for="actionToggle" class="action-label">액션활성화</label>
      <input
        type="checkbox"
        id="actionToggle"
        bind:checked="{actionActive}"
        class="toggle-switch"
      />
      <button class="save-button">저장하기</button>
    </div>
  {/if}

  {#if activeTab === "protocol"}
    <!-- 기본프로토콜 Content -->
    <div class="protocol-list">
      <div class="modal">
        <div class="first_header">
          <p>[Hostname] : <strong>{hostData[0].name}</strong></p>
          <p>[IpAddress] : <strong>{hostData[0].ipadd}</strong></p>
          <p>[점검일시] : <strong>{hostData[0].time}</strong></p>
        </div>
        <button class="edit-button">결과변경하기</button>
        <table>
          <tr>
            <th>점검항목</th>
            <td>{projectsData[0].checklist}</td>
          </tr>
          <tr>
            <th>항목그룹</th>
            <td>{projectsData[0].itemGroup}</td>
          </tr>
          <tr>
            <th>점검기준</th>
            <td>{projectsData[0].inspectionCriteria}</td>
          </tr>
          <tr>
            <th>위험도</th>
            <td class="lineCol">
              <div>양호 : <span>{projectsData[0].riskLevel.good}</span></div>
              <div>
                취약 : <span>{projectsData[0].riskLevel.vulnerability}</span>
              </div>
            </td>
          </tr>
          <tr>
            <th>점검결과수정</th>
            <td class="line5">
              <div class="line5">
                <p>점검결과:</p>
                <select>
                  <option value="양호">양호</option>
                  <option value="취약">취약</option>
                </select>
              </div>
              <div class="line5">
                <p>점검결과:</p>
                <select>
                  <option value="양호">양호</option>
                  <option value="취약">취약</option>
                </select>
              </div>
              <p class="status">(점검현황/점검결과 적용됨)</p>
            </td>
          </tr>
          <tr>
            <th>정검현황</th>
            <td>{projectsData[0].evidenceImage}</td>
          </tr>
          <tr>
            <th>증적이미지</th>
            <td class="line7">
              <div>[파일변경]:</div>
              <input type="file" class="file-input" />
            </td>
          </tr>
          <tr>
            <th>개선방법</th>
            <td>{projectsData[0].improve}</td>
          </tr>
          <tr>
            <th>개선예시</th>
            <td>{projectsData[0].inprovement}</td>
          </tr>
        </table>
      </div>
    </div>
  {/if}
</div>

<style>
  .tabs {
    display: flex;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
    width: 25%;
  }

  .tab {
    padding: 8px 16px;
    cursor: pointer;
    background-color: #f7f7f7;
    border: none;
    border-right: 2px solid #ccc;
    transition: background-color 0.3s ease;
    font-weight: bold;
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #333;
    border-radius: 4px 4px 0 0;
  }
  .tab:hover,
  .tab.active {
    background-color: #0062cc;
    color: #fff;
  }

  .content {
    border: 1px solid #ccc;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  /* 액션등록 Styles */
  .action-registration {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .action-label {
    font-weight: bold;
    font-size: 16px;
    color: #333;
  }

  .toggle-switch {
    width: 36px;
    height: 18px;
    -webkit-appearance: none;
    appearance: none;
    background-color: #ddd;
    outline: none;
    border-radius: 50px;
    cursor: pointer;
    position: relative;
    transition: background-color 0.2s ease;
  }

  .toggle-switch:checked {
    background-color: #28a745;
  }

  .toggle-switch:before {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    background-color: #fff;
    border-radius: 50%;
    top: 1px;
    left: 1px;
    transition: transform 0.2s ease;
  }

  .toggle-switch:checked:before {
    transform: translateX(18px);
  }

  .save-button {
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
    font-size: 14px;
    font-weight: bold;
  }

  .save-button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  /* 기본프로토콜 Styles */
  .modal {
    border-radius: 10px;
    background-color: #f9f9f9;
    padding: 20px;
    max-width: 700px;
    margin: 0 auto;
  }

  .protocol-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .first_header {
    display: flex;
    flex-direction: row;
    gap: 10px;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .first_header p {
    margin: 0;
  }

  .edit-button {
    align-self: flex-end;
    padding: 8px 12px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .edit-button:hover {
    background-color: #218838;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    margin-bottom: 20px;
  }

  th,
  td {
    border: 1px solid #dddddd;
    padding: 12px 15px;
    text-align: left;
  }

  th {
    background-color: #f1f1f1;
    color: #333;
    font-weight: bold;
    width: 120px;
  }

  .lineCol {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .line5,
  .line7 {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: flex-start;
  }

  .line5 select {
    height: 30px;
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }

  .status {
    font-size: 12px;
    color: #555;
    margin-top: 5px;
  }

  .file-input {
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
