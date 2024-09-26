<script>
  import { assetDeatilInfo } from "../../../services/page2/asset.store";
  import { setAssetInformationUpdate } from "../../../services/page2/assetService";
  import { successAlert } from "../../../shared/sweetAlert";

  // Reactive subscription to assetDeatilInfo store
  $: assetDetails =
    $assetDeatilInfo.length > 0 ? $assetDeatilInfo[0].asset[0] : {};

  let formData = {
    ass_uuid: "",
    ast_group: "",
    ast_code: "",
    ast_usage: "",
    ast_model: "",
    ast_brand: "",
    ast_os: "",
    ast_ostype: "",
    ast_application: "",
    ast_version: "",
    ast_url: "",
    ast_hostname: "",
    ast_real_hostname: "",
    ast_macaddress: "",
    ast_ipaddr: "",
    ast_ipaddrs: "",
    ast_real_ipaddr: "",
    ast_location: "",
    ast_manager_team: "",
    ast_manager_person: "",
    ast_operator_team: "",
    ast_operator_person: "",
    ast_operator_phone: "",
    ast_isms_target: "",
    ast_confidentiality: "",
    ast_integrity: "",
    ast_availability: "",
    ast_security_point: "",
    ast_security_level: "",
    ast_etc: "",
    ast_approve_status: "",
    ast_activate: "",
    ast_agent_installed: "",
  };

  // Only populate formData if it's uninitialized
  $: if (Object.keys(assetDetails).length > 0 && !formData.ass_uuid) {
    formData = { ...assetDetails };
    console.log("Loaded asset details:", assetDetails);
  }
  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      const response = await setAssetInformationUpdate(formData);
      if (response.success) {
        successAlert("Data updated successfully");
      } else {
        throw new Error();
      }
    } catch (error) {
      errorMessage = `Failed to update asset information: ${error.message}`;
      successMessage = "";
    }
  };
</script>

<main>
  {#if Object.keys(assetDetails).length > 0}
    <form on:submit|preventDefault={handleSubmit}>
      <table>
        <tr>
          <th>분류그룹</th>
          <td><input type="text" bind:value={formData.ast_group} /></td>
          <th>자산코드</th>
          <td><input type="text" bind:value={formData.ast_code} /></td>
          <th>용도</th>
          <td><input type="text" bind:value={formData.ast_usage} /></td>
          <th>자산모델</th>
          <td><input type="text" bind:value={formData.ast_model} /></td>
        </tr>
        <tr>
          <th>점검대상</th>
          <td><input type="text" bind:value={formData.ast_brand} /></td>
          <th>호스트명(관리대장)</th>
          <td><input type="text" bind:value={formData.ast_hostname} /></td>
          <th>아이피주소(관리대장)</th>
          <td><input type="text" bind:value={formData.ast_ipaddr} /></td>
          <th>IP목록전체</th>
          <td><input type="text" bind:value={formData.ast_ipaddrs} /></td>
        </tr>
        <tr>
          <th>어플리케이션</th>
          <td><input type="text" bind:value={formData.ast_application} /></td>
          <th>어플리케이션버전</th>
          <td><input type="text" bind:value={formData.ast_version} /></td>
          <th>URL</th>
          <td><input type="text" bind:value={formData.ast_url} /></td>
          <th>위치</th>
          <td><input type="text" bind:value={formData.ast_location} /></td>
        </tr>
        <tr>
          <th>제조사</th>
          <td><input type="text" bind:value={formData.ast_brand} /></td>
          <th>운영체제</th>
          <td><input type="text" bind:value={formData.ast_os} /></td>
          <th>운영상호스트명</th>
          <td><input type="text" bind:value={formData.ast_real_hostname} /></td>
          <th>운영상 IP</th>
          <td><input type="text" bind:value={formData.ast_real_ipaddr} /></td>
        </tr>
        <tr>
          <th>관리부서</th>
          <td><input type="text" bind:value={formData.ast_manager_team} /></td>
          <th>등급</th>
          <td><input type="text" bind:value={formData.ast_manager_person} /></td
          >
          <th>운영부서</th>
          <td><input type="text" bind:value={formData.ast_operator_team} /></td>
          <th>운영담당자</th>
          <td
            ><input type="text" bind:value={formData.ast_operator_person} /></td
          >
        </tr>
        <tr>
          <th>운영자연락처</th>
          <td><input type="text" bind:value={formData.ast_operator_phone} /></td
          >
          <th>기밀성</th>
          <td
            ><input type="text" bind:value={formData.ast_confidentiality} /></td
          >
          <th>무결성</th>
          <td
            ><input type="checkbox" bind:checked={formData.ast_integrity} /></td
          >
          <th>가용성</th>
          <td
            ><input
              type="checkbox"
              bind:checked={formData.ast_availability}
            /></td
          >
        </tr>
        <tr>
          <th>중요도</th>
          <td><input type="text" bind:value={formData.ast_security_point} /></td
          >
          <th>등급</th>
          <td><input type="text" bind:value={formData.ast_security_level} /></td
          >
          <th>ISMS인증범위</th>
          <td
            ><input
              type="checkbox"
              bind:checked={formData.ast_isms_target}
            /></td
          >
          <th>활성화여부</th>
          <td><input type="checkbox" bind:checked={formData.ast_activate} /></td
          >
        </tr>
      </table>
      <div class="input_container">
        <textarea
          rows="3"
          cols="100"
          placeholder="비고란"
          bind:value={formData.ast_etc}
        ></textarea>
        <div class="group_agent_info">
          {#if formData.ast_agent_installed}
            <div><span>에이전트설치여부:</span> installed</div>
          {:else}
            <div><span>에이전트설치여부:</span>not installed</div>
          {/if}
          <div><span>등록승인여부:</span> {formData.ast_approve_status}</div>
          <div><span>맥주소:</span> {formData.ast_macaddress || "없음"}</div>
        </div>
        <div class="button_container">
          <div class="input_buttons">
            <button style="background: #007bff;" type="submit">Submit</button>
            <button
              style="background: #dc3545;"
              type="reset"
              on:click={() => (formData = { ...assetDetails })}>Reset</button
            >
          </div>
          <button>Cancel</button>
        </div>
      </div>
    </form>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    background-color: #f7f9fb;
    padding: 10px;
    margin-bottom: 40px;
    font-family: "Arial", sans-serif;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  form {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    background: #ffffff;
    font-size: 12px;
  }

  th,
  td {
    padding: 5px; /* Adjusting padding to be smaller */
    border: 1px solid #ddd;
    text-align: left;
    white-space: nowrap; /* Prevent wrapping for header text */
  }

  input,
  textarea {
    width: 100%;
    padding: 3px; /* Smaller padding for inputs */
    border-radius: 3px;
    border: 1px solid #ccc;
    font-size: 12px;
  }

  input[type="text"] {
    padding: 2px; /* Minimized padding for text input */
  }

  th {
    background-color: #f0f0f0;
    font-weight: bold;
    color: #333;
    white-space: nowrap; /* Ensuring text remains in one line */
    text-align: left; /* Aligning text horizontally */
  }

  tr:hover {
    background-color: #e0f7fa; /* Soft hover effect */
  }

  /* Optional styling for better visual appeal */
  td {
    background-color: #fff;
  }

  tr:nth-child(even) td {
    background-color: #f9f9f9; /* Light gray for alternate rows */
  }

  .input_container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #dddddd;
  }

  .input_container textarea {
    margin: 6px;
    width: 99%;
    padding: 3px; /* Smaller padding for textarea */
  }

  .input_buttons {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .button_container button {
    background-color: #007bff; /* Primary button color */
    color: #ffffff;
    width: 100px;
    height: 30px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .button_container button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .button_container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
    padding: 20px;
  }
  .group_agent_info {
    display: flex;
    flex-direction: row;
    gap: 10px;
    font-size: 12px;
  }
</style>
