<script>
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

<div class="modal">
  <div class="first_header">
    <p>[Hostname] : <strong>{hostData[0].name}</strong></p>
    <p>[IpAddress] : <strong>{hostData[0].ipadd}</strong></p>
    <p>[점검일시] : <strong>{hostData[0].time}</strong></p>
  </div>
  <button>결과변경하기</button>
  <table>
    <tr>
      <th>점검항목</th>
      <td>{projectsData[0].checklist}</td>
    </tr>
    <tr>
      <th>항목그룹</th>
      <td>
        {projectsData[0].itemGroup}
      </td>
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
          <select id="">
            <option value="양호">양호</option>
            <option value="취약">취약</option>
          </select>
        </div>
        <div class="line5">
          <p>점검결과:</p>
          <select id="">
            <option value="양호">양호</option>
            <option value="취약">취약</option>
          </select>
        </div>
        <p>(점검현황/점검결과 적용됨)</p>
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
        <input type="file" />
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

<style>
  .first_header {
    display: flex;
    flex-direction: row;
    gap: 10px;
    font-size: 12px;
  }
  table,
  th,
  td {
    border: 1px solid rgb(108, 108, 108);
    border-collapse: collapse;
    font-size: 12px;
  }
  table th {
    width: 120px;
    background-color: #dedede;
    height: 40px;
    font-size: 12px;
  }

  .line5,
  .line7 {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .line5 select {
    height: 28px;
  }

  .lineCol {
    display: flex;
    flex-direction: column;
  }

  table {
    max-width: 700px; /* Make the table width 100% of its container */
  }
</style>
