<script>
  import { allTraceByPlan } from "../../services/page7/trace.store";
  function getStrokeColor(score) {
    if (score > 60)
      return "#ff0000"; // Blue
    else if (score > 30)
      return "#00ff00"; // Green
    else return " #0067ff"; // Red
  }

  /*************************/
  export let selectedAsset;
  export let trace_ccc_index;
  export let trace_cct_index;

  /****************************/
  function check() {
    console.log(selectedAsset);
    console.log(trace_ccc_index);
    console.log(trace_cct_index);
  }
</script>

<div class="containerAsset">
  <div class="graphCardWrap col3" style="width:100%;">
    {#each $allTraceByPlan
      .slice()
      .sort((a, b) => new Date(a.plan_start_date || 0) - new Date(b.plan_start_date || 0))
      .slice(0, 5) as asset, index}
      <div class="iconCard">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <article class="graphCard hoverCard" style="min-height: 628px;">
          <div class="contents">
            <div class="graph">
              <div>
                <div
                  class="circle"
                  data-percent={asset.vulnerability_summary
                    .vulnerability_count || 0}
                  data-offset="440"
                >
                  <svg viewBox="0 0 150 150">
                    <circle
                      cx="75"
                      cy="75"
                      r="70"
                      stroke="#fff"
                      stroke-width="10"
                      fill="none"
                    />
                    <circle
                      class="progress"
                      cx="75"
                      cy="75"
                      r="70"
                      stroke={getStrokeColor(
                        asset.vulnerability_summary.vulnerability_count || 0,
                      )}
                      stroke-width="10"
                      fill="none"
                      stroke-dasharray="440"
                      stroke-dashoffset={440 -
                        (440 *
                          (asset.vulnerability_summary.vulnerability_count ||
                            0)) /
                          100}
                      stroke-linecap="round"
                      transform="rotate(-90 75 75)"
                    />
                  </svg>
                  <div class="percent">
                    <span
                      class="number"
                      style="font-size:32px; color: {getStrokeColor(
                        asset.vulnerability_summary.vulnerability_count || 0,
                      )};"
                    >
                      {asset.vulnerability_summary.vulnerability_count > 0
                        ? asset.vulnerability_summary.vulnerability_count
                        : 0}건
                    </span>
                  </div>
                </div>
                <h4 class="name">
                  <div class="title1">취약</div>
                </h4>
              </div>
            </div>

            <div class="text flex col justify-between">
              <ul>
                <li>
                  <span>프로젝트명 : </span>{asset.ccp_title || "데이터 없음"}
                </li>
                <li>
                  <span>점검일시 : </span>
                  {asset.plan_start_date
                    ? new Date(asset.plan_start_date).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "데이터 없음"}
                </li>
                <li>
                  <span>관련시스템 : </span>{asset.asg_index__asg_title ||
                    "데이터 없음"}
                </li>

                <li style="margin-top:15px;"><span>[취약점 요약]</span></li>
                <li>
                  <span>최다자산 : </span>{asset.vulnerability_summary
                    .most_vulnerable_asset || "데이터 없음"}
                </li>
                <li>
                  <span>최다항목 : </span>{asset.vulnerability_summary
                    .most_common_item?.item_code || "데이터 없음"}({asset
                    .vulnerability_summary.most_common_item?.target_type || ""})
                </li>
                <li>
                  <span>취약점수 : </span>{asset.vulnerability_summary
                    .vulnerability_count || "0"}
                </li>
                <li>
                  <span>조치개수 : </span>{asset.vulnerability_summary
                    .fixed_count || "0"}
                </li>

                <!-- Additional Info Section -->
                <li style="margin-top:15px;">
                  <span>[그외 출력가능 정보 ]</span>
                </li>
                <li>
                  <span>점검 계획 시작일 : </span>
                  {asset.plan_start_date
                    ? new Date(asset.plan_start_date).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "데이터 없음"}
                </li>
                <li>
                  <span>점검 계획 종료일 : </span>
                  {asset.fix_end_date
                    ? new Date(asset.fix_end_date).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "데이터 없음"}
                </li>
              </ul>
            </div>
          </div>
        </article>

        <!-- Only show the icon if index is less than 5 -->
        {#if index < 4}
          <img src="assets/images/arrowhead.png" class="icon" />
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  /* General Layout Styles */
  .graphCardWrap.col3 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    row-gap: 30px;
    padding: 20px;
    height: 100%;
    align-items: center;
  }
  .containerAsset {
    height: 75vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px;
    padding-bottom: 40px;
  }
  /* Card and Hover Styles */
  .hoverCard {
    display: flex;
    flex-direction: column;
    background: linear-gradient(145deg, #ffffff, #f1f3f4);
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition:
      transform 0.2s ease,
      box-shadow 0.3s ease;
    width: 320px;
  }
  .hoverCard:hover {
    cursor: pointer;
    transform: scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.2);
  }

  .contents {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  /* Text and Title Styles */
  .text {
    padding: 20px;
    font-size: 16px;
    color: #555;
    line-height: 1.6;
  }
  .name {
    text-align: center;
    margin-top: 10px;
  }
  .title1 {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    margin-bottom: 5px;
  }

  /* Icon Styles */
  .iconCard {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .icon {
    width: 45px;
    height: 45px;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  .iconCard:hover .icon {
    opacity: 1;
  }
  /* Responsive Styles */
  @media (max-width: 1200px) {
    .graphCardWrap.col3 {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (max-width: 992px) {
    .graphCardWrap.col3 {
      grid-template-columns: repeat(2, 1fr);
    }
    .text {
      font-size: 15px;
    }
    .icon {
      width: 40px;
      height: 40px;
    }
  }

  @media (max-width: 768px) {
    .graphCardWrap.col3 {
      grid-template-columns: 1fr;
    }
    .hoverCard {
      max-width: 100%;
    }
    .text {
      font-size: 14px;
      padding: 15px;
    }
    .icon {
      width: 35px;
      height: 35px;
    }
  }

  @media (max-width: 576px) {
    .text {
      font-size: 13px;
      padding: 10px;
    }
    .hoverCard {
      width: 100%;
    }
    .icon {
      width: 30px;
      height: 30px;
    }
  }
</style>
