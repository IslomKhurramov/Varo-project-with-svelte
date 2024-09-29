<script>
  export let modalData;
</script>

<div class="modal">
  <button class="modify-button">결과변경하기</button>
  <table>
    <tr>
      <th>점검항목</th>
      <td
        >[{modalData?.ccr_item_no__ccc_item_no}] {modalData?.ccr_item_no__ccc_item_title}</td
      >
    </tr>
    <tr>
      <th>점검대상</th>
      <td>
        {modalData?.ccr_item_no__ccc_target_system}
      </td>
    </tr>
    <tr>
      <th>항목그룹</th>
      <td
        >[{modalData?.ast_uuid__ast_target__cct_target}] {modalData?.ccr_item_no__ccc_item_group}</td
      >
    </tr>
    <tr>
      <th>위험도</th>
      <td>{modalData?.ccr_item_no__ccc_item_level}</td>
    </tr>
    <tr>
      <th>점검기준</th>
      <td class="lineCol">
        <div>
          양호: <span> {@html modalData?.ccr_item_no__ccc_item_criteria} </span>
        </div>
      </td>
    </tr>
    <tr>
      <th>점검내용</th>
      <td class="lineCol">
        <div>
          <span> {modalData?.ccr_item_no__ccc_check_content} </span>
        </div>
      </td>
    </tr>
    <tr>
      <th>점검목적</th>
      <td class="lineCol">
        <div>
          <span> {modalData?.ccr_item_no__ccc_check_purpose} </span>
        </div>
      </td>
    </tr>
    <tr>
      <th>보안위협</th>
      <td class="lineCol">
        <div>
          <span> {modalData?.ccr_item_no__ccc_security_threat} </span>
        </div>
      </td>
    </tr>
    <tr>
      <th>영향도</th>
      <td class="lineCol">
        <div>
          <span> {modalData?.ccr_item_no__ccc_impact} </span>
        </div>
      </td>
    </tr>

    <tr>
      <th>점검결과수정</th>
      <td class="line5">
        <div class="line5">
          <p>점검결과:</p>
          <select>
            <option
              value="양호"
              selected={modalData?.ccr_item_result === "양호"}
            >
              양호
            </option>
            <option
              value="취약"
              selected={modalData?.ccr_item_result === "취약"}
            >
              취약
            </option>
            <option
              value="예외처리"
              selected={modalData?.ccr_item_result === "예외처리"}
            >
              예외처리
            </option>
            <option
              value="해당없음"
              selected={modalData?.ccr_item_result === "해당없음"}
            >
              해당없음
            </option>
          </select>
        </div>
        <div class="line5">
          <p>수정범위:</p>
          <select>
            <option value="전체항목">해당항목만</option>
            <option value="전체항목">전체항목</option>
          </select>
        </div>
        <p>(점검현황/점검결과 적용됨)</p>
      </td>
    </tr>
    <tr>
      <th>점검현황</th>
      <td>{modalData?.ccr_item_status}</td>
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
      <td>{modalData?.ccr_item_no__ccc_mitigation_method}</td>
    </tr>
    <tr>
      <th>개선예시</th>
      <td>{@html modalData?.ccr_item_no__ccc_mitigation_example}</td>
    </tr>
  </table>
</div>

<style>
  .modal {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 700px;
    margin: 20px auto;
    font-family: Arial, sans-serif;
  }

  .first_header {
    display: flex;
    gap: 15px;
    font-size: 12px;
    margin-bottom: 15px;
  }

  .modify-button {
    background-color: #007bff;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
    font-size: 12px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .modify-button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    margin-bottom: 20px;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 12px 15px;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #005fa3;
    font-weight: bold;
    color: #ffffff;
    width: 160px;
  }

  .lineCol {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .line5,
  .line7 {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .line5 select {
    height: 30px;
    padding: 0 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 14px;
  }

  .line7 input[type="file"] {
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 5px;
  }
</style>
