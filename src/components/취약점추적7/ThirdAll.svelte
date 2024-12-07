<script>
  import { allTraceByThird } from "../../services/page7/trace.store";
  function getStrokeColor(score) {
    if (score > 60)
      return "#ff0000"; // Blue
    else if (score > 30)
      return "#00ff00"; // Green
    else return "#0067ff"; // Red
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
  let filteredAssetsOfThird = [
    {
      ast_security_point: 85,
      ast_uuid__ast_target__cct_target: "Web Server",
      asg_index__asg_title: "Finance Servers",
      ast_os: "Windows Server 2019",
      ast_hostname: "2024.04.04",
      ast_ipaddr: "2000대",
      ast_agent_installed: true,
    },
    {
      ast_security_point: 12,
      ast_uuid__ast_target__cct_target: "Web Server",
      asg_index__asg_title: "Finance Servers",
      ast_os: "Windows Server 2019",
      ast_hostname: "2024.04.04",
      ast_ipaddr: "2000대",
      ast_agent_installed: true,
    },
    {
      ast_security_point: 1500,
      ast_uuid__ast_target__cct_target: "Web Server",
      asg_index__asg_title: "Finance Servers",
      ast_os: "Windows Server 2019",
      ast_hostname: "2024.04.04",
      ast_ipaddr: "2000대",
      ast_agent_installed: true,
    },
    {
      ast_security_point: 85,
      ast_uuid__ast_target__cct_target: "Web Server",
      asg_index__asg_title: "Finance Servers",
      ast_os: "Windows Server 2019",
      ast_hostname: "2024.04.04",
      ast_ipaddr: "2000대",
      ast_agent_installed: true,
    },
    {
      ast_security_point: 900,
      ast_uuid__ast_target__cct_target: "Web Server",
      asg_index__asg_title: "Finance Servers",
      ast_os: "Windows Server 2019",
      ast_hostname: "2024.04.04",
      ast_ipaddr: "2000대",
      ast_agent_installed: true,
    },
  ];
  $: recentAssets = filteredAssetsOfThird.slice(-5);
</script>

<div class="containerAsset">
  {#each $allTraceByThird
    .slice()
    .sort((a, b) => new Date(a.plan_start_date || 0) - new Date(b.plan_start_date || 0)) as asset}
    <p class="header_title">{asset.cct_target}</p>
    <div class="graphCardWrap col3" style="width:100%;">
      {#if asset.plans && Array.isArray(asset.plans) && asset.plans.length > 0}
        {#each asset.plans as plan, index}
          <div class="iconCard">
            <article class="graphCard hoverCard" style="height: 400px;">
              <div class="contents">
                <div class="graph">
                  <div>
                    <div
                      class="circle"
                      data-percent={plan.vulnerability_summary
                        .total_vulnerabilities || 0}
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
                            plan.vulnerability_summary.total_vulnerabilities ||
                              0,
                          )}
                          stroke-width="10"
                          fill="none"
                          stroke-dasharray="440"
                          stroke-dashoffset={440 -
                            (440 *
                              (plan.vulnerability_summary
                                .total_vulnerabilities || 0)) /
                              100}
                          stroke-linecap="round"
                          transform="rotate(-90 75 75)"
                        />
                      </svg>
                      <div class="percent">
                        <span
                          class="number"
                          style="font-size:32px; color: {getStrokeColor(
                            plan.total_vulnerabilities || 0,
                          )};"
                        >
                          {plan.vulnerability_summary.total_vulnerabilities > 0
                            ? plan.vulnerability_summary.total_vulnerabilities
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
                      <span>프로젝트명 : </span>{plan.ccp_title ||
                        "Unknown Project"}
                    </li>
                    <li>
                      <span>점검일시 : </span>
                      {plan.ccp_cdate
                        ? new Date(plan.ccp_cdate).toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Unknown"}
                    </li>
                    <li>
                      <span>관련시스템 : </span>
                      {plan.system_count || "Unknown System"}대
                    </li>
                    <li>
                      <span>최다자산 : </span>
                      {plan.vulnerability_summary?.most_vulnerable_host ||
                        "No Asset"}
                    </li>
                    <li>
                      <span>취약점수 : </span>{plan.vulnerability_summary
                        .total_vulnerabilities || 0}건
                    </li>
                    <li>
                      <span>조치개수 : </span>{plan.vulnerability_summary
                        .fixed_count || 0}건
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        {/each}
      {:else}
        <div class="no-data-message">
          <p>사용 가능한 데이터가 없습니다</p>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .no-data-message {
    text-align: center; /* Center the text */
    font-style: italic; /* Italicize the text for emphasis */
    color: #777; /* Light gray color for the message */
    padding: 20px; /* Add some padding around the text */
  }
  .containerAsset {
    height: 77vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px;
  }

  /* Improved Header Style */
  .header_title {
    font-size: 16px;
    display: block;
    border-bottom: 1px solid #929397;
    color: #626677;
    font-weight: 500;
    margin: 10px 0 15px;
    padding: 0 10px;
  }

  /* Align Icon Properly */
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

  /* General Layout Styles */
  .graphCardWrap.col3 {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    position: relative;
    padding: 20px;
    align-items: center;
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
