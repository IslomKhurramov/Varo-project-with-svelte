<script>
  function getStrokeColor(score) {
    if (score > 60)
      return "#0067ff"; // Blue
    else if (score > 30)
      return "#00ff00"; // Green
    else return "#ff0000"; // Red
  }
  export let third;
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
  {#each third as asset}
    <p class="header_title">{asset.thirdName}({asset.number})</p>
    <div class="graphCardWrap col3" style="width:100%;">
      {#each recentAssets as asset, index}
        <div class="iconCard">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <article class="graphCard hoverCard" style="height: 500px;">
            <div class="contents">
              <div class="graph">
                <div>
                  <div
                    class="circle"
                    data-percent={asset.asset_point_history?.[0]
                      ?.ast_security_point || 0}
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
                        stroke={getStrokeColor(asset.ast_security_point || 0)}
                        stroke-width="10"
                        fill="none"
                        stroke-dasharray="440"
                        stroke-dashoffset={440 -
                          (440 * (asset.ast_security_point || 0)) / 100}
                        stroke-linecap="round"
                        transform="rotate(-90 75 75)"
                      />
                    </svg>
                    <div class="percent">
                      <span
                        class="number"
                        style="font-size:32px; color: {getStrokeColor(
                          asset.ast_security_point || 0,
                        )};"
                      >
                        {asset.ast_security_point > 0
                          ? asset.ast_security_point
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
                    <span>프로젝트명 : </span>{asset.ast_os || "Unknown OS"}
                  </li>
                  <li>
                    <span>점검일시 : </span>{asset.ast_hostname ||
                      "Unknown Hostname"}
                  </li>
                  <li>
                    <span>관련시스템 : </span>{asset.ast_ipaddr || "Unknown IP"}
                  </li>
                  <li style="margin-top:15px;"><span>[취약점 요약]</span></li>
                  <li>
                    <span
                      >최다자산 :
                    </span>{asset.ast_uuid__ast_target__cct_target ||
                      "No Target"}
                  </li>
                  <li>
                    <span>최다항목 : </span>{asset.ast_agent_installed
                      ? "설치됨"
                      : "설치 안됨"}
                  </li>
                  <li>
                    <span>취약점수 : </span>{asset.ast_hostname ||
                      "Unknown Hostname"}
                  </li>
                  <li>
                    <span>조치개수 : </span>{asset.ast_ipaddr || "Unknown IP"}
                  </li>
                  <li style="margin-top:15px;">
                    <span>[그외 출력가능 정보 ]</span>
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <!-- Only show the icon if index is less than 5 -->
          {#if index < 4}
            <img src="images/icons/arrowhead.png" class="icon" />
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .containerAsset {
    height: 77vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px;
  }

  /* Improved Header Style */
  .header_title {
    font-size: 18px;
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
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
    width: 280px;
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
    font-size: 18px;
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
