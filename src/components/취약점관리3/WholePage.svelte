<script>
  import { getUserName } from "./../../services/login/loginService.js";
  import { onMount } from "svelte";
  import Modal from "../../shared/Modal.svelte";
  import ModalRegisteredAdmin from "./ModalRegisteredAdmin.svelte";
  import { Swiper, Navigation, Pagination } from "swiper";
  import "swiper/swiper-bundle.min.css";
  import {
    getFixEviDownload,
    getFixHistoryOfItem,
    getVulnsFixWay,
    getVulnsOfAsset,
    setFixApprove,
    setFixDoneApprove,
    setFixDoneRegister,
    setFixPlanRegister,
  } from "../../services/vulns/vulnsService.js";
  import { errorAlert, successAlert } from "../../shared/sweetAlert.js";

  export let plans;
  export let targetData;
  export let setView;

  let isAgentUser = true;

  // let swiperContainer;
  // let swiperInstance;

  // onMount(() => {
  //   swiperInstance = new Swiper(swiperContainer, {
  //     modules: [Navigation, Pagination],
  //     loop: false,
  //     slidesPerView: 8,
  //     spaceBetween: 15,
  //     pagination: {
  //       el: ".swiper-pagination",
  //       clickable: true,
  //     },
  //     navigation: {
  //       nextEl: ".swiper-button-next",
  //       prevEl: ".swiper-button-prev",
  //     },
  //   });
  // });

  let usernames = [];
  let options = [];
  let historyItemData = [];
  let assets = [];

  let sendPlanRegisterData = {
    asset_uuid: "",
    ccr_index: "",
    fix_method: "",
    fix_level: "",
    fix_start_date: "",
    fix_end_date: "",
    fix_comment: "",
    fix_user_index: "",
    fix_step_status: "2",
  };

  let sendApproveData = {
    asset_target_uuid: "",
    plan_index: "",
    approved: "",
    approved_targets: "",
    approved_comment: "",
  };

  let sendFixDone = {
    asset_uuid: "",
    ccr_index: "",
    fixed_method: "",
    fixed_start_date: "",
    fixed_end_date: "",
    fixed_comment: "",
    fixed_user_index: "",
    fixed_evidence_file: "",
  };

  let sendSetFixDoneApprove = {
    asset_target_uuid: "",
    plan_index: "",
    approved: "",
    approved_targets: "",
    approved_comment: "",
  };

  onMount(async () => {
    usernames = await getUserName();
    options = await getVulnsFixWay();
  });

  const fixPlanRegister = async () => {
    try {
      sendPlanRegisterData.asset_uuid = targetData?.ast_uuid;
      sendPlanRegisterData.ccr_index = targetData?.ccr_index;

      const response = await setFixPlanRegister(sendPlanRegisterData);

      successAlert(response);

      sendPlanRegisterData = {
        asset_uuid: "",
        ccr_index: "",
        fix_method: "",
        fix_level: "",
        fix_start_date: "",
        fix_end_date: "",
        fix_comment: "",
        fix_user_index: "",
        fix_step_status: "2",
      };
    } catch (err) {
      console.error("Error fixPlanRegister:", err);
      errorAlert(err?.message);
    }
  };

  function transformVulns(vulns) {
    const transformed = [];

    for (const key in vulns) {
      let currentResult = null;
      let fixPlan = {};
      let fixResult = {};

      vulns[key].forEach((item) => {
        if (item.result) {
          currentResult = item?.result;
        } else {
          if (item.fix_plan) {
            fixPlan = item.fix_plan;
          }
          if (item.fix_result) {
            fixResult = item.fix_result;
          }
        }
      });

      if (currentResult) {
        transformed.push({
          ...currentResult,
          fix_plan: Object.keys(fixPlan).length > 0 ? fixPlan : {},
          fix_result: Object.keys(fixResult).length > 0 ? fixResult : {},
        });
      }
    }

    return transformed;
  }

  $: {
    (async () => {
      if (targetData) {
        historyItemData = await getFixHistoryOfItem({
          asset_uuid: targetData?.ast_uuid,
          ccr_index: targetData?.ccr_index,
          checklist_item_no: targetData?.ccr_item_no__ccc_item_no,
        });
      }
    })();
  }

  let data = [];

  const getData = async () => {
    assets = await getVulnsOfAsset({
      plan_index: targetData?.ccp_index,
      asset_target_uuid: targetData?.ast_uuid,
    });
    data = transformVulns(assets?.vulns);
  };

  $: {
    getData();
  }

  const fixApproveHandler = async (data) => {
    try {
      const result = await setFixApprove(data);
      await successAlert(result);
    } catch (err) {
      errorAlert(err?.message);
    }
  };

  const setFixDoneRegisterHandler = async () => {
    try {
      sendFixDone.asset_uuid = targetData?.ast_uuid;
      sendFixDone.ccr_index = targetData?.ccr_index;
      console.log("=sendFixDone:", sendFixDone);
      const formData = new FormData();

      for (const key in sendFixDone) {
        formData.append(key, sendFixDone[key]);
      }
      const result = await setFixDoneRegister(formData);
      await successAlert(result);
    } catch (err) {
      errorAlert(err?.message);
    }
  };

  const handleFileUpload = (event) => {
    sendFixDone.fixed_evidence_file = event.target.files[0];
  };

  const sampleClick = async (cfr_index, file) => {
    try {
      file = file.split("/").pop();
      console.log("file: ", file);
      await getFixEviDownload(cfr_index, file);
    } catch (error) {
      console.log("Error sampleClick: ", error);
    }
  };

  const setFixDoneApproveHandler = async () => {
    try {
      sendSetFixDoneApprove.asset_target_uuid = targetData?.ast_uuid;
      sendSetFixDoneApprove.plan_index = targetData?.ccp_index;
      sendSetFixDoneApprove.approved_targets = [targetData?.ccr_index];
      console.log("=sendSetFixDoneApprove:", sendSetFixDoneApprove);

      const result = await setFixDoneApprove(sendSetFixDoneApprove);
      await successAlert(result);
      sendSetFixDoneApprove = {
        asset_target_uuid: "",
        plan_index: "",
        approved: "",
        approved_targets: "",
        approved_comment: "",
      };
    } catch (err) {
      errorAlert(err?.message);
    }
  };

  $: {
    console.log("targetData:", targetData);
  }
</script>

<main>
  <div class="swiper_container1">
    <img src="./images/left.png" alt="left" />
    <div class="scroll">
      {#if data?.length !== 0}
        <div class="scroll-container">
          {#each data as item, index}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              class={`slide ${item?.fi_fix_status__cvs_index == 2 && "color1"} ${item?.fi_fix_status__cvs_index == 3 && "color2"}  ${item?.fi_fix_status__cvs_index == 4 && "color4"} ${item?.cfr_fix_status__cvs_index == 6 && "color6"}  ${item?.cfr_fix_status__cvs_index == 7 && "color7"}`}
              on:click={() => {
                targetData = item;
              }}
            >
              {item?.ccr_item_no__ccc_item_no}
            </div>
          {/each}
        </div>
      {/if}
    </div>
    <img
      src="./images/left.png"
      style="transform: rotate(180deg);"
      alt="right"
    />
  </div>
  <div class="main-container">
    <div class="container">
      <div class="header">
        <p>취약점 조치 현황 : 1 / 20</p>
      </div>

      <div class="content">
        <div class="actions">
          <div class="action-header">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>조치계획등록</label>
          </div>

          <div class="action-content">
            {#if isAgentUser && setView == "result" && Object.keys(targetData?.fix_result).length === 0}
              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치방법</label>
                <select
                  bind:value={sendFixDone["fixed_method"]}
                  class="select_input"
                >
                  <option value={""}>
                    조치예정 / 조치완료 / 예외처리 / 대체적용 / 기타
                  </option>
                  {#if options?.length !== 0}
                    {#each options as option}
                      <option value={option?.cvf_index}
                        >{option?.cvf_desc}</option
                      >
                    {/each}
                  {/if}
                </select>
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치일정</label>
                <input
                  class="input"
                  type="date"
                  bind:value={sendFixDone["fixed_start_date"]}
                  placeholder="조치일정을 입력하세요"
                />
                <input
                  class="input"
                  type="date"
                  bind:value={sendFixDone["fixed_end_date"]}
                  placeholder="조치일정을 입력하세요"
                />
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치내역</label>

                <textarea bind:value={sendFixDone["fixed_comment"]}></textarea>
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>증적자료</label>
                <input
                  type="file"
                  on:change={(e) => {
                    handleFileUpload(e);
                  }}
                />
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치수행자</label>
                <select bind:value={sendFixDone["fixed_user_index"]}>
                  <option value={""}> 조치담당자</option>
                  {#if usernames?.length !== 0}
                    {#each usernames as username}
                      <option value={username?.user_index}
                        >{username?.user_name}</option
                      >
                    {/each}
                  {/if}
                </select>
              </div>
            {:else if isAgentUser && setView == "result" && Object.keys(targetData?.fix_result).length !== 0}
              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치방법</label>
                <input
                  type="text"
                  readonly
                  value={targetData?.fix_result?.[0]?.cfr_fix_method__cvf_desc}
                />
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치일정</label>
                <input
                  type="text"
                  readonly
                  value={targetData?.fix_result?.[0]?.cfr_fix_startdate}
                />
                <input
                  type="text"
                  readonly
                  value={targetData?.fix_result?.[0]?.cfr_fix_enddate}
                />
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치내역</label>

                <textarea readonly>
                  {targetData?.fix_result?.[0]?.cfr_fix_etc}
                </textarea>
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>증적자료</label>
                <input
                  type="text"
                  value={targetData?.fix_result?.[0]?.cfr_evidence_file
                    .split("/")
                    .pop() + " ( 다운로드 )"}
                  readonly
                  on:click={() => {
                    sampleClick(
                      targetData?.fix_result?.[0]?.cfr_index,
                      targetData?.fix_result?.[0]?.cfr_evidence_file,
                    );
                  }}
                />
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치수행자</label>
                <input
                  type="text"
                  value={targetData?.fix_result?.[0]?.user_index__user_name}
                  readonly
                />
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치계획승인</label>
                <select bind:value={sendSetFixDoneApprove["approved"]}>
                  <option value={""}> 조치계획승인 / 조치계획반려 </option>
                  <option value={"1"}> 조치계획승인</option>
                  <option value={"0"}> 조치계획반려</option>
                </select>
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치승인자의견 </label>
                <input
                  type="text"
                  bind:value={sendSetFixDoneApprove["approved_comment"]}
                />
              </div>
            {:else if isAgentUser && setView == "plan"}
              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치방법</label>
                <input
                  type="text"
                  readonly
                  value={targetData?.fix_plan?.[0]?.cfi_fix_method__cvf_desc}
                />
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치수준</label>
                <input
                  type="text"
                  readonly
                  value={targetData?.fix_plan?.[0]?.cfi_fix_term}
                />
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치일정</label>
                <input
                  type="text"
                  readonly
                  value={targetData?.fix_plan?.[0]?.cfi_fix_startdate}
                />
                <input
                  type="text"
                  readonly
                  value={targetData?.fix_plan?.[0]?.cfi_fix_enddate}
                />
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치방법</label>

                <textarea
                  value={targetData?.fix_plan?.[0]?.cfi_fix_etc}
                  readonly
                ></textarea>
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치담당자</label>
                <input
                  type="text"
                  readonly
                  value={targetData?.fix_plan?.[0]?.user_index__user_name}
                />
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치계획승인</label>
                <select bind:value={sendApproveData["approved"]}>
                  <option value={""}> 조치계획승인 / 조치계획반려 </option>
                  <option value={"1"}> 조치계획승인</option>
                  <option value={"0"}> 조치계획반려</option>
                </select>
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치승인자의견 </label>
                <input
                  type="text"
                  bind:value={sendApproveData["approved_comment"]}
                />
              </div>
            {:else}
              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치방법</label>
                <select
                  bind:value={sendPlanRegisterData["fix_method"]}
                  class="select_input"
                >
                  <option value={""}>
                    조치예정 / 조치완료 / 예외처리 / 대체적용 / 기타
                  </option>
                  {#if options?.length !== 0}
                    {#each options as option}
                      <option value={option?.cvf_index}
                        >{option?.cvf_desc}</option
                      >
                    {/each}
                  {/if}
                </select>
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치수준</label>
                <select bind:value={sendPlanRegisterData["fix_level"]}>
                  <option value={""}> 긴급 / 단기 / 중기 / 장기 </option>
                  <option value="긴급">긴급</option>
                  <option value="단기">단기</option>
                  <option value="중기">중기</option>
                  <option value="장기">장기</option>
                </select>
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치일정</label>
                <input
                  class="input"
                  type="date"
                  bind:value={sendPlanRegisterData["fix_start_date"]}
                  placeholder="조치일정을 입력하세요"
                />
                <input
                  class="input"
                  type="date"
                  bind:value={sendPlanRegisterData["fix_end_date"]}
                  placeholder="조치일정을 입력하세요"
                />
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치방법</label>

                <textarea bind:value={sendPlanRegisterData["fix_comment"]}
                ></textarea>
              </div>

              <div class="row">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>조치담당자</label>
                <select bind:value={sendPlanRegisterData["fix_user_index"]}>
                  <option value={""}> 조치담당자</option>
                  {#if usernames?.length !== 0}
                    {#each usernames as username}
                      <option value={username?.user_index}
                        >{username?.user_name}</option
                      >
                    {/each}
                  {/if}
                </select>
              </div>
            {/if}
          </div>

          {#if isAgentUser && setView == "plan"}
            <div class="action-footer">
              <button
                class="list-button"
                on:click={async () => {
                  sendApproveData.asset_target_uuid = targetData?.ast_uuid;
                  sendApproveData.plan_index = targetData?.ccp_index;
                  sendApproveData.approved_targets = [targetData?.ccr_index];
                  await fixApproveHandler(sendApproveData);
                  sendApproveData = {
                    asset_target_uuid: "",
                    plan_index: "",
                    approved: "",
                    approved_targets: "",
                    approved_comment: "",
                  };
                }}
              >
                의견등록
              </button>
            </div>
          {:else if isAgentUser && setView == "result" && Object.keys(targetData?.fix_result).length === 0}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <button class="list-button" on:click={setFixDoneRegisterHandler}
              >조치결과등록</button
            >
          {:else if isAgentUser && setView == "result" && Object.keys(targetData?.fix_result).length !== 0}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <button class="list-button" on:click={setFixDoneApproveHandler}
              >의견등록</button
            >
          {:else}
            <div class="action-footer">
              <button class="list-button" on:click={fixPlanRegister}>
                조치계획등록
              </button>
            </div>
          {/if}

          <!-- svelte-ignore a11y-label-has-associated-control -->
          {#if historyItemData?.length !== 0}
            <div class="row">
              <label>이전조치이력</label>
              <div class="table_container">
                <table>
                  <tr class="first_line">
                    <th>조치방법</th>
                    <th>플랜</th>
                    <th>일정</th>
                    <th>조치담당자</th>
                  </tr>

                  {#each historyItemData as data}
                    <tr>
                      <td>{data.cfi_fix_status__cvs_desc}</td>
                      <td>{data.ccr_index__ccp_index__ccp_title}</td>
                      <td>{data.cfi_fix_startdate} {data.cfi_fix_enddate}</td>
                      <td>{data.user_index__user_name}</td>
                    </tr>
                  {/each}
                </table>
              </div>
            </div>
          {/if}
        </div>

        <div class="info">
          <div class="row">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>취약점정보</label>
            <textarea rows="3" readonly>
              ${targetData?.ccr_item_no__ccc_item_criteria}
            </textarea>
          </div>

          <div class="row">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>평가기준</label>
            <textarea rows="3" readonly>
              {targetData?.ccr_item_no__ccc_item_title}
            </textarea>
          </div>
          <div class="row">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>조치방법</label>
            <textarea rows="3" readonly>
              {targetData?.ccr_item_no__ccc_mitigation_example}
            </textarea>
          </div>

          <!-- <div class="row"> -->
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <!-- <label>관련자산</label>
            <textarea class="data3" bind:value={relatedAssets} rows="3" readonly
            ></textarea>
          </div> -->

          <div class="row">
            <label>관련자산</label>
            <div class="table_container">
              <table>
                <tr class="first_line">
                  <th>자산명</th>
                  <th>아이피주소</th>
                  <th>자산그룹</th>
                  <th>OS</th>
                </tr>

                <tr>
                  <td>{targetData?.ast_uuid__ass_uuid__ast_hostname}</td>
                  <td>{targetData?.ast_uuid__ass_uuid__ast_ipaddr}</td>
                  <td>{targetData?.cct_index__cct_target}</td>
                  <td>{targetData?.ast_uuid__ass_uuid__ast_os}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- <button class="register_button">조치계획 등록함</button> -->
    </div>
  </div>

  <!-- <Modal bind:showModal>
    <ModalRegisteredAdmin {closeModal} />
  </Modal> -->
</main>

<style>
  /* Main container centered */
  .main-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    width: 100%;
  }

  .container {
    width: 100%;
    padding: 30px;
    background-color: #f7f9fb;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
    position: relative;
  }

  .header {
    text-align: left;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 10px;
  }

  .select_input:hover {
    background-color: #b0b0b0;
  }

  .content {
    display: flex;
    justify-content: space-between;
  }

  .info {
    width: 55%;
  }

  .row {
    margin-bottom: 10px;
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  textarea {
    width: 100%;
    height: 120px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    resize: none;
    background-color: #f9f9f9;
  }

  input,
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    background-color: #f9f9f9;
  }

  .input1 {
    height: 150px;
  }

  .actions {
    width: 40%;
    height: auto;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #e9e9e9;
  }

  .action-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .action-footer {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .register_button {
    background-color: #28a745;
    padding: 10px;
    font-weight: bold;
    color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    border-radius: 5px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .register_button:hover {
    background-color: #28863e;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .list-button {
    background-color: #007bff; /* Primary button color */
    color: #ffffff;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .list-button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .data3 {
    height: 40px;
  }

  .table_container {
    display: flex;
    justify-content: center;
    width: 94%;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100px;

    margin: 20px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #000000;
  }

  table {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    background: #ffffff;
    font-size: 12px;
  }

  th,
  td {
    border: 1px solid #000000;
    padding: 12px 15px; /* Increased padding for better spacing */
    text-align: left;
    vertical-align: middle; /* Ensure content is vertically centered */
  }

  th {
    background-color: #005fa3; /* Header background color */
    color: #ffffff; /* Header text color */
    position: sticky;
    top: 0;
    z-index: 1;
    text-transform: uppercase; /* Uppercase text for header */
    font-size: 12px;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9; /* Slightly lighter shade for even rows */
  }

  tr:hover {
    background-color: #e0f7fa; /* Soft hover effect */
  }

  /* Swiper Styles */
  .swiper-container {
    width: 100%;
    margin: 20px auto;
    padding: 10px 0;
    background-color: #f0f0f0;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    position: relative;
  }

  .swiper_container1 {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .swiper_container1 img {
    width: 50px;
    height: auto;
  }

  .swiper-wrapper {
    display: flex;
  }

  .swiper-slide {
    height: 50px;
    max-width: 300px;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    background: #fff;
    border-radius: 10px;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 4px 8px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    cursor: pointer;
  }

  .swiper-slide:hover {
    transform: scale(1.1);
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.2),
      0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .swiper-pagination {
    color: #007acc;
  }

  /* Move the left and right navigation buttons outside the swiper container */
  .swiper-button-prev,
  .swiper-button-next {
    color: #007acc;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }

  .swiper-button-prev {
    left: -50px;
  }

  .swiper-button-next {
    right: -50px;
  }

  .scroll {
    width: 100%;
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    white-space: nowrap;
  }

  .scroll-container {
    display: flex; /* Flexbox layout to align items horizontally */
  }

  .slide {
    min-width: 100px; /* Adjust item width as needed */
    padding: 10px;
    background-color: #f7f7f7;
    margin-right: 10px;
    border: 1px solid #ccc;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .color1 {
    background-color: #ffff00;
  }

  .color2 {
    background-color: #92d051;
  }

  .color3 {
    background-color: #fec100;
  }

  /* .color4 {
    background-color: #b4c6e7;
  } */

  .color5 {
    background-color: #b4c6e7;
  }

  .color7 {
    background-color: #c55a11;
  }
</style>
