<script>
  import { getPlanLists } from "../../../services/page1/newInspection";
  import { onMount } from "svelte";

  let selectedPlan = null;
  let planList = [];

  onMount(async () => {
    try {
      planList = await getPlanLists();
    } catch (err) {
      console.error("Error loading asset groups:", err);
    }
  });
</script>

<main>
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
            <p class="button2 width">요약 보고서생성 (양식 향후 지정)</p>
            <div class="report-box">
              <div class="top">
                <h5 class="txt1">보고서유형</h5>
                <h5 class="txt2">보고서목록</h5>
                <div>
                  <h5>생성하기</h5>
                  <h5>보고서삭제</h5>
                </div>
              </div>
              <div class="bottom">
                <div>
                  <h5>파일 (엑셀)</h5>
                </div>
                <div>
                  <h5>파일 (엑셀)</h5>
                  <h5>파일 (엑셀)</h5>
                </div>
                <div>
                  <button class="save_button">보고서생성</button>
                  <button class="save_button">보고서삭제</button>
                </div>
              </div>
            </div>
          </div>
          <div class="first_line">
            <p class="button2 width">상세 보고서생성</p>
            <div class="report-box">
              <div class="top">
                <h5 class="txt1">보고서유형</h5>
                <h5 class="txt2">보고서목록</h5>
                <div>
                  <h5>생성하기</h5>
                  <h5>보고서삭제</h5>
                </div>
              </div>
              <div class="bottom">
                <div>
                  <h5>파일 (엑셀)</h5>
                </div>
                <div>
                  <h5>파일 (엑셀)</h5>
                  <h5>파일 (엑셀)</h5>
                  <h5>파일 (엑셀)</h5>
                  <h5>파일 (엑셀)</h5>
                  <h5>파일 (엑셀)</h5>
                  <h5>파일 (엑셀)</h5>
                </div>
                <div>
                  <button class="save_button">보고서생성</button>
                  <button class="save_button">보고서삭제</button>
                </div>
              </div>
              <div class="bottom word">
                <div>
                  <h5>파일 (엑셀)</h5>
                </div>
                <div>
                  <h5>파일 (엑셀)</h5>
                  <h5>파일 (엑셀)</h5>
                  <h5>파일 (엑셀)</h5>
                  <h5>파일 (엑셀)</h5>
                  <h5>파일 (엑셀)</h5>
                  <h5>파일 (엑셀)</h5>
                </div>
                <div>
                  <button class="save_button">보고서생성</button>
                  <button class="save_button">보고서삭제</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
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

  /* Row Styling */
  .first_line {
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .secondLine {
    width: 100%;
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
    height: 45px;
    margin: 0;
    margin-right: 25px;
    background-color: #e0e0e0;
  }

  .save_button {
    height: 32px;
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

  .thirdCol {
    width: 100%;
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

  .report-box {
    padding: 10px;
    width: 85%;
    display: flex;
    flex-direction: column;
    border: 1px solid #ddddde;
  }

  .report-box .top {
    width: 100%;
    height: 30px;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #ddddde;
  }

  h5 {
    margin: 0;
  }

  .txt1 {
    width: 20%;
  }

  .txt2 {
    width: 60%;
  }

  .top div {
    width: 20%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .bottom {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
  }

  .bottom div:first-child {
    width: 20%;
  }

  .bottom div {
    width: 60%;
    display: flex;
    flex-direction: column;
  }

  .bottom div:last-child {
    width: 20%;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .word {
    padding-top: 10px;
    margin-top: 10px;
    border-top: 1px solid #ddddde;
  }
</style>
