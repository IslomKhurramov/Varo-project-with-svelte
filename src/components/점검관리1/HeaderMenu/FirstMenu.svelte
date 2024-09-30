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

  // inputs & files
  let jsonInput;
  let txtInput;
  let excelInput;
  let jsonFiles = [];
  let txtFiles = [];
  let excelFiles = [];

  let planList = [];
  let selectedPlan = null;
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }

  onMount(async () => {
    try {
      planList = await getPlanLists();
    } catch (err) {
      console.error("Error loading asset groups:", err);
    }
  });

  const submitNewSystemCommand = async (target, files) => {
    try {
      console.log("files", files, typeof files);
      const formData = new FormData();

      formData.append("plan_index", selectedPlan);
      formData.append("target_system", target);

      files.forEach((file) => {
        formData.append("result_files", file);
      });

      const response = await setUploadPlanResult(formData);

      await successAlert(response.CODE);

      // navigate(window.location?.pathname == "/" ? "/page1" : "/");
    } catch (error) {
      console.error("Error submitNewSystemCommand new plan:", error);
      errorAlert(error?.message);
    }
  };

  const getResultStatus = async () => {
    try {
      uploadStatusModalData = uploadStatus;
    } catch (err) {
      console.error("Error changeItemResult:", err);
    }
  };

  $: {
    console.log("uploadStatus:", uploadStatus);
    console.log("uploadStatusModalData:", uploadStatusModalData);
  }
</script>

<div class="container_page">
  <div class="header">
    {#if resultStatus?.assets_info?.length > 0}
      <button
        on:click={() => {
          showModal = true;
          modalData = resultStatus?.assets_info;
        }}
      >
        등록현황조회
      </button>
    {:else}
      <button style="background-color:  #33333342;">등록현황조회</button>
    {/if}

    {#if resultErrors?.length > 0}
      <button
        on:click={() => {
          showErrorModal = true;
          modalErrorData = resultErrors;
        }}
      >
        에러내역확인
      </button>
    {:else}
      <button style="background-color:  #33333342;">에러내역확인</button>
    {/if}

    <!-- <button>등록결과조회</button> -->
  </div>

  <div class="table_center">
    <div class="table_container">
      <div class="secondLine">
        <div class="thirdCol">
          <div class="first_line">
            <p class="button2 width">프로젝트명</p>
            <div class="row">
              <select class="dropdown" bind:value={selectedPlan}>
                <option value="" selected disabled>선택</option>
                {#if planList}
                  {#each planList as plan}
                    <option value={plan.ccp_index}>{plan.ccp_title}</option>
                  {/each}
                {/if}
              </select>
            </div>
          </div>
          <div class="first_line">
            <p class="button1 width">자동</p>
            <p class="button2 width">에이전트결과</p>
            <input
              class="input"
              placeholder={`점검대상 ${uploadStatus?.total_asset_count ?? 0}대중 ${uploadStatus?.uploaded_asset_count ?? 0}대 업로드 완료`}
              readonly
            />
            <button
              class="save_button"
              disabled={!selectedPlan}
              on:click={getResultStatus}
            >
              등록내역확인
            </button>
          </div>
          <div class="first_line">
            <p class="button1 width">수동</p>
            <p class="button2">점겸결과파일</p>
            <span class="span_at">
              {jsonFiles && jsonFiles.length
                ? `${jsonFiles.length} files uploaded`
                : " JSON 파일 업로드 (UNIX/WINDOWS/DBMS/CLOUD…)"}
            </span>
            <input
              bind:this={jsonInput}
              on:change={(event) => {
                jsonFiles = Array.from(event.target.files);
              }}
              class="upload"
              type="file"
              accept=".json"
              multiple
              hidden
            />
            <button
              class="save_button"
              on:click={() => {
                jsonInput.click();
              }}
              disabled={!selectedPlan}
            >
              파일업로드
            </button>
            <button
              class="save_button"
              on:click={() => submitNewSystemCommand("JSON", jsonFiles)}
              disabled={!selectedPlan || !jsonFiles.length}
            >
              저장
            </button>
          </div>
          <div class="first_line">
            <p class="button1 width">수동</p>
            <p class="button2">네트워크설정파일</p>
            <span class="span_at">
              {txtFiles && txtFiles.length
                ? `${txtFiles.length} files uploaded`
                : "설정파일(TXT) 파일 업로드"}
            </span>
            <input
              bind:this={txtInput}
              on:change={(event) => {
                txtFiles = Array.from(event.target.files);
              }}
              class="upload"
              type="file"
              accept=".txt"
              multiple
              hidden
            />
            <button
              class="save_button"
              on:click={() => {
                txtInput.click();
              }}
              disabled={!selectedPlan}
            >
              파일업로드
            </button>
            <button
              class="save_button"
              on:click={() => submitNewSystemCommand("TXT", txtFiles)}
              disabled={!selectedPlan || !txtFiles.length}
            >
              저장
            </button>
          </div>
          <div class="first_line">
            <p class="button1 width">수동</p>
            <p class="button2">정보보호시스템</p>
            <span class="span_at">
              {excelFiles && excelFiles.length
                ? `${excelFiles.length} files uploaded`
                : "인터뷰파일(EXCEL) 파일 업로드"}
            </span>
            <input
              bind:this={excelInput}
              on:change={(event) => {
                excelFiles = Array.from(event.target.files);
              }}
              class="upload"
              type="file"
              accept=".xls,.xlsx"
              multiple
              hidden
            />
            <button
              class="save_button"
              on:click={() => {
                excelInput.click();
              }}
              disabled={!selectedPlan}
            >
              파일업로드
            </button>
            <button
              class="save_button"
              on:click={() => submitNewSystemCommand("EXCEL", excelFiles)}
              disabled={!selectedPlan || !excelFiles.length}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{#if modalData}
  <ModalDynamic
    bind:showModal
    modalWidth={60}
    modalHeight={modalData?.length > 10 ? 70 : null}
  >
    <ResultPopup bind:modalData />
  </ModalDynamic>
{/if}

{#if modalErrorData}
  <ModalDynamic
    bind:showModal={showErrorModal}
    modalWidth={80}
    modalHeight={modalErrorData?.length > 10 ? 70 : null}
  >
    <ResultErrorPopup bind:modalErrorData />
  </ModalDynamic>
{/if}

{#if uploadStatusModalData}
  <ModalDynamic
    bind:showModal={uploadStatusModalData}
    modalWidth={80}
    modalHeight={uploadStatusModalData?.uploaded_status?.length > 10
      ? 70
      : null}
  >
    <ResultUploadStatusPopup bind:uploadStatusModalData />
  </ModalDynamic>
{/if}

<style>
  /* Main Container */
  .container_page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    width: 100%;
  }

  /* Header Buttons */
  .header {
    display: flex;
    gap: 12px;
    margin-bottom: 10px;
    width: 100%;
    justify-content: flex-end;
  }

  .header button {
    background-color: #0056b3;
    color: #ffffff;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: bold;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .header button:hover {
    background-color: #003366;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  /* Table Centering */
  .table_center {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Table Container Styling */
  .table_container {
    width: 100%;
    padding: 10px;
    background-color: #f7f9fb;
    border-radius: 10px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #dddddd;
    margin-bottom: 30px;
  }

  .word {
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 10px;
  }

  /* Row Styling */
  .first_line,
  .secondLine {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
  }
  .secondLine {
    align-items: center;
    justify-content: center;
  }

  /* Button Styling */
  .button1,
  .button2 {
    background-color: #f0f0f0;
    color: #333333;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    border-radius: 5px;
    padding: 8px 12px;
    width: 150px;
    text-align: center;
    border: 1px solid #cccccc;
  }

  .button2 {
    background-color: #e0e0e0;
  }

  /* Input Styling */
  .input {
    flex-grow: 0.7;
    background-color: #f9f9f9;
    border: 1px solid #cccccc;
    border-radius: 5px;
    padding: 8px;
    font-size: 12px;
    color: #555555;
  }

  .input[readonly] {
    color: #666666;
  }

  .upload {
    border: none;
    background-color: transparent;
    font-size: 12px;
    color: #333333;
    cursor: pointer;
  }

  /* Save Button Styling */
  .save_button {
    background-color: #0056b3;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    font-size: 12px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .save_button:hover {
    background-color: #003366;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .span_at {
    width: 260px;
    font-size: 12px;
    color: #666666;
    display: flex;
    align-items: center;
  }

  /* Column Layout */
  .thirdCol {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .row {
    width: 70%;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .label {
    flex-shrink: 0;
    width: 150px;
    padding: 5px 0;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
  }

  .dropdown {
    flex: 1;
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    transition: border-color 0.3s ease;
    appearance: none;
    background-color: #fff;
  }

  .dropdown:focus {
    border-color: #2980b9;
    outline: none;
  }

  button:disabled {
    background-color: #838383;
  }
</style>
