<script>
  import {
    decryptData,
    getUserName,
  } from "./../../services/login/loginService.js";
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
  import { userData } from "../../stores/user.store.js";

  export let targetData;
  export let setView;
  export let currentView;
  export let wholePage;

  let isAgentUser = ["1", "3", "5"].includes(
    decryptData($userData?.userInfo?.user_roletype_role_index),
  );
  // let isAgentUser = true;

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

    const targetIndex = data.findIndex(
      (item) =>
        item.ccr_item_no__ccc_item_no === targetData?.ccr_item_no__ccc_item_no,
    );

    console.log("targetIndex:", targetIndex);

    // if (targetIndex !== -1) {
    //   const [targetElement] = data.splice(targetIndex, 1);
    //   data.unshift(targetElement);
    // }
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

  let swiperContainer;
  let swiperInstance;
  let menuWrapper;
  let scrollAmount = 0;
  let itemWidth = 146;
  let menuWidth = 100;
  let activeAsset = null;

  $: if (targetData && data && Array.isArray(data) && data.length > 0) {
    activeAsset = data?.find(
      (slide) =>
        slide.ccr_item_no__ccc_item_no === targetData.ccr_item_no__ccc_item_no,
    );

    // Focus on the asset if it exists
    if (activeAsset) {
      setTimeout(() => {
        focusOnAsset(targetData.ccr_item_no__ccc_item_no);
      }, 0);
    }
  }

  function focusOnAsset(assetId) {
    const menuItem = document.querySelector(`.menu-item[value="${assetId}"]`);
    if (menuItem) {
      menuItem.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      setTimeout(() => {
        menuItem.focus();
      }, 300);
    } else {
      console.warn("Menu item not found:", assetId);
    }
  }

  onMount(() => {
    // Ensure swiperContainer is bound
    if (swiperContainer) {
      swiperInstance = new Swiper(swiperContainer, {
        modules: [Navigation, Pagination],
        loop: false, // Avoid layout issues caused by looping
        slidesPerView: 4, // Adjust this value to suit your design
        spaceBetween: 10, // Fine-tune spacing to avoid layout shifts
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    }

    // Initialize menu wrapper for scrolling
    menuWrapper = document.getElementById("menuWrapper");

    return () => {
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
      }
    };
  });

  const handleScroll = (direction) => {
    menuWrapper = document.getElementById("menuWrapper");
    console.log("++menuWrapper:", menuWrapper);
    console.log("++itemWidth:", itemWidth);
    if (!menuWrapper) return; // Ensure menuWrapper is initialized
    const maxScroll = menuWrapper.scrollWidth - menuWidth;
    console.log("++maxScroll:", maxScroll);

    if (direction === "prev") {
      scrollAmount -= itemWidth;
      console.log("++scrollAmount:", scrollAmount);
      if (scrollAmount < 0) scrollAmount = 0;
    } else if (direction === "next") {
      scrollAmount += itemWidth;
      if (scrollAmount > maxScroll) scrollAmount = maxScroll;
    }

    menuWrapper.style.transform = `translateX(-${scrollAmount}px)`; // Template literal corrected
  };

  $: {
    console.log("targetData:", targetData);
    console.log("data:", data);
  }
</script>

<section class="topCon" bind:this={swiperContainer}>
  <div class="menu-container">
    <button
      class="arrow-btn"
      id="prevBtn"
      on:click={() => handleScroll("prev")}
    >
      ◀
    </button>
    <div class="menu-wrapper-container">
      {#if data?.length !== 0}
        <div class="menu-wrapper" id="menuWrapper" bind:this={menuWrapper}>
          {#each data as item, index}
            <div
              value={item.ccr_item_no__ccc_item_no}
              name={item}
              class={`menu-item ${item?.ccr_item_no__ccc_item_no === targetData?.ccr_item_no__ccc_item_no ? "active" : ""} ${item?.fi_fix_status__cvs_index == 2 && "yellow"} ${item?.fi_fix_status__cvs_index == 3 && "green"}  ${item?.fi_fix_status__cvs_index == 4 && "orange"} ${item?.cfr_fix_status__cvs_index == 6 && "blue"}  ${item?.cfr_fix_status__cvs_index == 7 && "red"}`}
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
    <button
      class="arrow-btn"
      id="nextBtn"
      on:click={() => handleScroll("next")}
    >
      ▶
    </button>
  </div>
</section>

<section class="content" style="height: 100vh; overflow: scroll;">
  <div style="height: 100%;">
    <!-- 자산상세 -->
    <div class="section" style="height: 100%;">
      <!-- 등록 -->
      <div class="flex detail" style="height: 100%;">
        <section class="flex col gap-40">
          <article class="flex col">
            <h3 class="title border">조치계획등록</h3>
            <table class="tableForm">
              <colgroup>
                <col style="width:80px;" />
                <col />
              </colgroup>
              <tbody>
                {#if isAgentUser && setView == "result" && Object.keys(targetData?.fix_result).length === 0}
                  <tr>
                    <th>조치방법</th>
                    <td>
                      <select
                        bind:value={sendFixDone["fixed_method"]}
                        style="font-size: 16px;"
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
                    </td>
                  </tr>
                  <tr>
                    <th>조치일정</th>
                    <td>
                      <div class="dateWrap">
                        <div class="date">
                          <input
                            style="font-size: 16px;"
                            type="date"
                            class="datepicker"
                            placeholder="시작일시"
                            bind:value={sendFixDone["fixed_start_date"]}
                          />
                        </div>
                        <img src="./assets/images/icon/dash.svg" />
                        <div class="date">
                          <input
                            style="font-size: 16px;"
                            type="date"
                            class="datepicker"
                            placeholder="종료일시"
                            bind:value={sendFixDone["fixed_end_date"]}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>조치내역</th>
                    <td>
                      <textarea
                        rows="10"
                        bind:value={sendFixDone["fixed_comment"]}
                      ></textarea>
                    </td>
                  </tr>
                  <tr>
                    <th>조치내역</th>
                    <td>
                      <input
                        style="font-size: 16px;"
                        type="file"
                        on:change={(e) => {
                          handleFileUpload(e);
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>조치수행자</th>
                    <td>
                      <select
                        bind:value={sendFixDone["fixed_user_index"]}
                        style="font-size: 16px;"
                      >
                        <option value={""}> 조치담당자</option>
                        {#if usernames?.length !== 0}
                          {#each usernames as username}
                            <option value={username?.user_index}
                              >{username?.user_name}</option
                            >
                          {/each}
                        {/if}
                      </select>
                    </td>
                  </tr>
                {:else if isAgentUser && setView == "result" && Object.keys(targetData?.fix_result).length !== 0}
                  <tr>
                    <th>조치방법</th>
                    <td>
                      <input
                        style="font-size: 16px;"
                        type="text"
                        readonly
                        value={targetData?.fix_result?.[0]
                          ?.cfr_fix_method__cvf_desc}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>조치일정</th>
                    <td>
                      <input
                        style="font-size: 16px;"
                        type="text"
                        readonly
                        value={targetData?.fix_result?.[0]?.cfr_fix_startdate}
                      />
                      <input
                        style="font-size: 16px;"
                        type="text"
                        readonly
                        value={targetData?.fix_result?.[0]?.cfr_fix_enddate}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>조치내역</th>
                    <td>
                      <textarea readonly>
                        {targetData?.fix_result?.[0]?.cfr_fix_etc}
                      </textarea>
                    </td>
                  </tr>
                  <tr>
                    <th>증적자료</th>
                    <td>
                      <input
                        style="font-size: 16px;"
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
                    </td>
                  </tr>
                  <tr>
                    <th>조치수행자</th>
                    <td>
                      <input
                        style="font-size: 16px;"
                        type="text"
                        value={targetData?.fix_result?.[0]
                          ?.user_index__user_name}
                        readonly
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>조치계획승인</th>
                    <td>
                      <select
                        bind:value={sendSetFixDoneApprove["approved"]}
                        style="font-size: 16px;"
                      >
                        <option value={""}>
                          조치계획승인 / 조치계획반려
                        </option>
                        <option value={"1"}> 조치계획승인</option>
                        <option value={"0"}> 조치계획반려</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>조치계획의견</th>
                    <td>
                      <input
                        style="font-size: 16px;"
                        type="text"
                        bind:value={sendSetFixDoneApprove["approved_comment"]}
                      />
                    </td>
                  </tr>
                {:else if isAgentUser && setView == "plan"}
                  <tr>
                    <th>조치방법</th>
                    <td>
                      <input
                        style="font-size: 16px;"
                        type="text"
                        readonly
                        value={targetData?.fix_plan?.[0]
                          ?.cfi_fix_method__cvf_desc ?? ""}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>조치수준</th>
                    <td>
                      <input
                        style="font-size: 16px;"
                        type="text"
                        readonly
                        value={targetData?.fix_plan?.[0]?.cfi_fix_term ?? ""}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>조치일정</th>
                    <td>
                      <div class="dateWrap">
                        <div class="date">
                          <input
                            style="font-size: 16px;"
                            type="text"
                            class="datepicker"
                            readonly
                            value={targetData?.fix_plan?.[0]
                              ?.cfi_fix_startdate ?? ""}
                          />
                          <img src="./assets/images/icon/date.svg" />
                        </div>
                        <img src="./assets/images/icon/dash.svg" />
                        <div class="date">
                          <input
                            style="font-size: 16px;"
                            type="text"
                            class="datepicker"
                            placeholder="종료일시"
                            readonly
                            value={targetData?.fix_plan?.[0]?.cfi_fix_enddate ??
                              ""}
                          />
                          <img src="./assets/images/icon/date.svg" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>조치방법</th>
                    <td>
                      <textarea
                        rows="10"
                        value={targetData?.fix_plan?.[0]?.cfi_fix_etc ?? ""}
                        readonly
                      ></textarea>
                    </td>
                  </tr>
                  <tr>
                    <th>조치담당자</th>
                    <td>
                      <input
                        style="font-size: 16px;"
                        type="text"
                        readonly
                        value={targetData?.fix_plan?.[0]
                          ?.user_index__user_name ?? ""}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>조치계획승인</th>
                    <td>
                      <select
                        bind:value={sendApproveData["approved"]}
                        style="font-size: 16px;"
                      >
                        <option value={""}>
                          조치계획승인 / 조치계획반려
                        </option>
                        <option value={"1"}> 조치계획승인</option>
                        <option value={"0"}> 조치계획반려</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>조치계획의견</th>
                    <td>
                      <input
                        style="font-size: 16px;"
                        type="text"
                        bind:value={sendApproveData["approved_comment"]}
                      />
                    </td>
                  </tr>
                {:else}
                  <tr>
                    <th>조치방법</th>
                    <td>
                      <select
                        bind:value={sendPlanRegisterData["fix_method"]}
                        style="font-size: 16px;"
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
                    </td>
                  </tr>
                  <tr>
                    <th>조치수준</th>
                    <td>
                      <select
                        bind:value={sendPlanRegisterData["fix_level"]}
                        style="font-size: 16px;"
                      >
                        <option value={""}> 긴급 / 단기 / 중기 / 장기 </option>
                        <option value="긴급">긴급</option>
                        <option value="단기">단기</option>
                        <option value="중기">중기</option>
                        <option value="장기">장기</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>조치일정</th>
                    <td>
                      <div class="dateWrap">
                        <div class="date">
                          <input
                            style="font-size: 16px;"
                            type="date"
                            class="datepicker"
                            placeholder="시작일시"
                            bind:value={sendPlanRegisterData["fix_start_date"]}
                          />
                        </div>
                        <img src="./assets/images/icon/dash.svg" />
                        <div class="date">
                          <input
                            style="font-size: 16px;"
                            type="date"
                            class="datepicker"
                            placeholder="종료일시"
                            bind:value={sendPlanRegisterData["fix_end_date"]}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>조치방법</th>
                    <td>
                      <textarea
                        rows="10"
                        bind:value={sendPlanRegisterData["fix_comment"]}
                      ></textarea>
                    </td>
                  </tr>
                  <tr>
                    <th>조치담당자</th>
                    <td>
                      <select
                        bind:value={sendPlanRegisterData["fix_user_index"]}
                        style="font-size: 16px;"
                      >
                        <option value={""}> 조치담당자</option>
                        {#if usernames?.length !== 0}
                          {#each usernames as username}
                            <option value={username?.user_index}
                              >{username?.user_name}</option
                            >
                          {/each}
                        {/if}
                      </select>
                    </td>
                  </tr>
                {/if}
              </tbody>
            </table>
            <div class="flex justify-center btnActionWrap">
              {#if isAgentUser && setView == "plan"}
                <button
                  type="button"
                  class="btn btnBlue btnAction btnSave w220 h50"
                  onclick="modalOpen('alert')"
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
              {:else if isAgentUser && setView == "result" && Object.keys(targetData?.fix_result).length === 0}
                <button
                  type="button"
                  class="btn btnBlue btnAction btnSave w220 h50"
                  onclick="modalOpen('alert')"
                  on:click={setFixDoneRegisterHandler}
                >
                  조치결과등록
                </button>
              {:else if isAgentUser && setView == "result" && Object.keys(targetData?.fix_result).length !== 0}
                <button
                  type="button"
                  class="btn btnBlue btnAction btnSave w220 h50"
                  onclick="modalOpen('alert')"
                  on:click={setFixDoneApproveHandler}
                >
                  의견등록
                </button>
              {:else}
                <button
                  type="button"
                  class="btn btnBlue btnAction btnSave w220 h50"
                  onclick="modalOpen('alert')"
                  on:click={fixPlanRegister}
                >
                  조치계획등록
                </button>
              {/if}
            </div>
          </article>

          {#if historyItemData?.length !== 0}
            <article>
              <h3 class="title border">이전조치이력</h3>
              <div class="tableListWrap nofirstth">
                <table class="tableList hdBorder">
                  <colgroup>
                    <col style="width:120px;" />
                    <col />
                    <col />
                    <col style="width:120px;" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th class="text-center">조치방법</th>
                      <th class="text-center">플랜</th>
                      <th class="text-center">일정</th>
                      <th class="text-center">조치담당자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each historyItemData as data}
                      <tr>
                        <td class="text-center"
                          >{data.cfi_fix_status__cvs_desc}</td
                        >
                        <td class="text-center"
                          >{data.ccr_index__ccp_index__ccp_title}</td
                        >
                        <td class="text-center"
                          >{data.cfi_fix_startdate} {data.cfi_fix_enddate}</td
                        >
                        <td class="text-center">{data.user_index__user_name}</td
                        >
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </article>
          {/if}
        </section>

        <section class="flex col">
          <div class="bg-gray">
            <article class="formWrap font13">
              <div class="formControlWrap">
                <div class="formControl align-start">
                  <!-- svelte-ignore a11y-label-has-associated-control -->
                  <label class="mt-12" style="font-size: 16px;"> 제목 </label>
                  <textarea rows="2" readonly
                    >{targetData?.ccr_item_no__ccc_item_title}
                  </textarea>
                </div>
              </div>
              <div class="formControlWrap">
                <div class="formControl align-start">
                  <!-- svelte-ignore a11y-label-has-associated-control -->
                  <label class="mt-12" style="font-size: 16px;">평가기준</label>
                  <textarea rows="4" readonly style="font-size: 16px;"
                    >{targetData?.ccr_item_no__ccc_item_criteria}</textarea
                  >
                </div>
              </div>
              <div class="formControlWrap">
                <div class="formControl align-start">
                  <!-- svelte-ignore a11y-label-has-associated-control -->
                  <label class="mt-12" style="font-size: 16px;">조치방법</label>
                  <textarea rows="8" readonly style="font-size: 16px;"
                    >{targetData?.ccr_item_no__ccc_mitigation_example}</textarea
                  >
                </div>
              </div>
            </article>
            <div class="flex flex-end btnActionWrap gap-12">
              <!-- <button
                type="button"
                class="btn btnGray w140 h50 golist btnAction"
                on:click={() => {
                  currentView === "default";
                  wholePage = false;
                }}
              >
                목록으로
              </button> -->
              <!-- <button
                type="button"
                class="btn btnBlue btnSave w220 h50 btnAction"
                >조치계획을 등록함</button
              > -->
            </div>

            <article>
              <h3 class="title border">관련자산</h3>
              <div class="tableListWrap nofirstth">
                <table class="tableList hdBorder chasan">
                  <colgroup>
                    <col />
                    <col />
                    <col />
                    <col />
                  </colgroup>
                  <thead>
                    <tr>
                      <th class="text-center">자산명</th>
                      <th class="text-center">아이피주소</th>
                      <th class="text-center">자산그룹</th>
                      <th class="text-center">OS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-center"
                        >{targetData?.ast_uuid__ass_uuid__ast_hostname}</td
                      >
                      <td class="text-center"
                        >{targetData?.ast_uuid__ass_uuid__ast_ipaddr}</td
                      >
                      <td class="text-center"
                        >{targetData?.cct_index__cct_target}</td
                      >
                      <td class="text-center"
                        >{targetData?.ast_uuid__ass_uuid__ast_os}</td
                      >
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  </div>
</section>

<style>
  .menu-item:hover {
    background: blue;
    color: white;
    transition: 0.2s;
  }

  .menu-item.active {
    background: blue;
    color: white;
    transition: 0.2s;
  }
  *,
  th,
  td,
  tr,
  textarea,
  label {
    font-size: 16px;
  }

  th {
    width: 110px;
  }

  .chasan tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }

  .menu-wrapper-container {
    overflow: hidden; /* Prevents Swiper from breaking out of bounds */
  }
  .menu-wrapper {
    display: flex;
    flex-wrap: nowrap; /* Ensure no wrapping of slides */
  }
  .swiper-wrapper {
    display: flex;
    flex-direction: row;
  }

  .swiper-slide {
    flex-shrink: 0; /* Prevents shrinking of slides */
    width: auto; /* or specific widths depending on how many slides you want to show */
  }
  thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }
</style>
