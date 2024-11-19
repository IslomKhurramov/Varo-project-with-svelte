<script>
  import { onMount } from "svelte";
  import { getPlanLists } from "../../../services/page1/newInspection";
  import {
    getCCEResultUploadStatus,
    getResultUploadStatus,
    getUploadedResultErrors,
    setUploadPlanResult,
  } from "../../../services/result/resultService";
  import ModalDynamic from "../../../shared/ModalDynamic.svelte";
  import ResultPopup from "../ResultPopup.svelte";
  import { errorAlert, successAlert } from "../../../shared/sweetAlert";
  import ResultErrorPopup from "../ResultErrorPopup.svelte";
  import ResultUploadStatusPopup from "../ResultUploadStatusPopup.svelte";

  export let projectIndex;

  // inputs & files
  let jsonInput;
  let txtInput;
  let excelInput;
  let jsonFiles = [];
  let txtFiles = [];
  let excelFiles = [];

  let planList = [];
  let selectedPlan = "";
  let resultStatus = null;
  let resultErrors = null;
  let uploadStatus = null;
  let showModal = false;
  let showErrorModal = false;
  let modalData = null;
  let modalErrorData = null;
  let uploadStatusModalData = null;

  $: if (selectedPlan) {
    (async () => {
      try {
        resultStatus = await getCCEResultUploadStatus(selectedPlan);
        resultErrors = await getUploadedResultErrors(selectedPlan);
        uploadStatus = await getResultUploadStatus(selectedPlan);
      } catch (error) {}
    })();
  }

  onMount(async () => {
    try {
      planList = await getPlanLists();
    } catch (err) {}
  });

  const submitNewSystemCommand = async (target, files) => {
    try {
      const formData = new FormData();

      formData.append("plan_index", selectedPlan);
      formData.append("target_system", target);

      files.forEach((file) => {
        formData.append("result_files", file);
      });

      for (let [key, value] of formData) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            size: value.size,
            type: value.type,
          });
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const response = await setUploadPlanResult(formData);

      await successAlert(response.CODE);

      // navigate(window.location?.pathname == "/" ? "/page1" : "/");
    } catch (error) {
      errorAlert(error?.message);
    }
  };

  const getResultStatus = async () => {
    try {
      uploadStatusModalData = uploadStatus;
    } catch (err) {}
  };

  $: {
    if (projectIndex) selectedPlan = projectIndex;
  }
</script>

<article class="flex contentArea projectTitle">
  <div class="flex">
    <div class="formControlWrap">
      <div class="formControl">
        <label>프로젝트명</label>
        <select bind:value={selectedPlan}>
          <option value="" selected disabled>선택</option>
          {#if planList}
            {#each planList as plan}
              <option value={plan.ccp_index}>{plan.ccp_title}</option>
            {/each}
          {/if}
        </select>
      </div>
    </div>
  </div>
  <div class="flex btnWrap">
    <button
      type="button"
      class={`btn ${resultStatus?.assets_info?.length > 0 ? "btnBlue" : ""}`}
      disabled={!resultStatus?.assets_info?.length > 0}
      on:click={() => {
        showModal = true;
        modalData = resultStatus?.assets_info;
      }}
    >
      등록현황조회
    </button>
    <button
      type="button"
      class={`btn ${resultErrors?.length > 0 ? "btnBlue" : ""}`}
      disabled={!resultErrors?.length > 0}
      on:click={() => {
        showErrorModal = true;
        modalErrorData = resultErrors;
      }}
    >
      에러내역확인
    </button>
  </div>
</article>

<article class="contentArea mt-40">
  <h4 class="title border">전체등록현황</h4>
  <div class="flex semiProgressWrap">
    <h5 style="font-size: 16px;">등록현황</h5>
    <div class="semi-oval-progress">
      <div
        class="progress-bar"
        style={`width: ${(uploadStatus?.uploaded_asset_count / uploadStatus?.total_asset_count) * 100}%;`}
      ></div>
      <div class="progress-text" style="font-size: 16px;">
        <span>{uploadStatus?.uploaded_asset_count ?? 0}</span> / {uploadStatus?.total_asset_count ??
          0}
      </div>
    </div>
    <button
      type="button"
      class={`btn ${selectedPlan ? "btnBlue" : "btnPrimary"}`}
      disabled={!selectedPlan}
      on:click={getResultStatus}>등록내역확인</button
    >
  </div>
</article>

<article class="contentArea mt-40">
  <h4 class="title border">수동등록</h4>
  <div class="formControlWrap fileUploadWrap col">
    <div class="formControl">
      <label style="font-size: 16px;">점검결과파일</label>
      <div class="upload-section">
        <label for="file-upload" class="file-label" style="font-size: 16px;">
          {jsonFiles && jsonFiles.length
            ? `${jsonFiles.length} files uploaded`
            : " JSON 파일 업로드 (UNIX/WINDOWS/DBMS/CLOUD…)"}
        </label>
        <input
          style="font-size: 16px;"
          type="file"
          id="file-upload"
          accept=".json"
          class="file-input"
          multiple
          bind:this={jsonInput}
          on:change={(event) => {
            jsonFiles = Array.from(event.target.files);
          }}
        />
        <button
          id="upload-btn"
          class="upload-btn btn btnPrimary"
          on:click={() => {
            jsonInput.click();
          }}
          disabled={!selectedPlan}
        >
          파일업로드
        </button>
        <button
          class={`btn ${!selectedPlan || !jsonFiles.length ? "btnPrimary" : "btnBlue"} `}
          on:click={() => submitNewSystemCommand("JSON", jsonFiles)}
          disabled={!selectedPlan || !jsonFiles.length}
        >
          저장
        </button>
      </div>
    </div>

    <div class="formControl">
      <label style="font-size: 16px;">네트워크설정파일</label>
      <div class="upload-section">
        <label for="file-upload" class="file-label" style="font-size: 16px;">
          {txtFiles && txtFiles.length
            ? `${txtFiles.length} files uploaded`
            : "설정파일(TXT) 파일 업로드"}
        </label>
        <input
          style="font-size: 16px;"
          type="file"
          id="file-upload"
          accept=".txt"
          class="file-input"
          multiple
          bind:this={txtInput}
          on:change={(event) => {
            txtFiles = Array.from(event.target.files);
          }}
        />
        <button
          id="upload-btn"
          class="upload-btn btn btnPrimary"
          on:click={() => {
            txtInput.click();
          }}
          disabled={!selectedPlan}
        >
          파일업로드
        </button>
        <button
          class={`btn ${!selectedPlan || !txtFiles.length ? "btnPrimary" : "btnBlue"} `}
          on:click={() => submitNewSystemCommand("TXT", txtFiles)}
          disabled={!selectedPlan || !txtFiles.length}
        >
          저장
        </button>
      </div>
    </div>

    <div class="formControl">
      <label style="font-size: 16px;">정보보호시스템</label>
      <div class="upload-section">
        <label for="file-upload" class="file-label" style="font-size: 16px;">
          {excelFiles && excelFiles.length
            ? `${excelFiles.length} files uploaded`
            : "인터뷰파일(EXCEL) 파일 업로드"}
        </label>
        <input
          style="font-size: 16px;"
          type="file"
          id="file-upload"
          accept=".xls,.xlsx"
          class="file-input"
          multiple
          bind:this={excelInput}
          on:change={(event) => {
            excelFiles = Array.from(event.target.files);
          }}
        />
        <button
          id="upload-btn"
          class="upload-btn btn btnPrimary"
          on:click={() => {
            excelInput.click();
          }}
          disabled={!selectedPlan}
        >
          파일업로드
        </button>
        <button
          class={`btn ${!selectedPlan || !excelFiles.length ? "btnPrimary" : "btnBlue"} `}
          on:click={() => submitNewSystemCommand("EXCEL", excelFiles)}
          disabled={!selectedPlan || !excelFiles.length}
        >
          저장
        </button>
      </div>
    </div>
  </div>
</article>

{#if modalData && modalData?.length !== 0}
  <ModalDynamic
    bind:showModal
    modalWidth={80}
    modalHeight={modalData?.length > 10 ? 600 : null}
    bind:modalData
  >
    <ResultPopup bind:modalData />
  </ModalDynamic>
{/if}

{#if modalErrorData && modalErrorData?.length !== 0}
  <ModalDynamic
    bind:showModal={showErrorModal}
    modalWidth={80}
    modalHeight={modalErrorData?.length > 10 ? 600 : null}
    bind:modalData={modalErrorData}
  >
    <ResultErrorPopup bind:modalErrorData />
  </ModalDynamic>
{/if}

{#if uploadStatusModalData && uploadStatusModalData?.length !== 0}
  <ModalDynamic
    bind:showModal={uploadStatusModalData}
    modalWidth={80}
    modalHeight={uploadStatusModalData?.uploaded_status?.length > 10
      ? 600
      : null}
    bind:modalData={uploadStatusModalData}
  >
    <ResultUploadStatusPopup bind:uploadStatusModalData />
  </ModalDynamic>
{/if}

<style>
  * {
    font-size: 16px;
  }
</style>
