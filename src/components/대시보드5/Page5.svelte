<script>
  import { dashboardData } from "./../../services/dashboard/dashboard.js";
  import moment from "moment";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  let data = null;
  let loading = true;

  onMount(async () => {
    try {
      loading = true;
      data = await dashboardData();
      loading = false;
    } catch (err) {
      alert(err?.message);
      loading = false;
    }
  });
</script>

{#if loading}
  <div class="loading-overlay">
    <div class="loading-spinner"></div>
  </div>
{:else}
  <section
    class="dashboard"
    style="overflow: scroll;
    height: calc(100vh - 120px);"
  >
    <div class="contentsWrap w100">
      <ul class="countWrap flex">
        <li>
          <div class="count">{data?.projects?.total ?? 0}개</div>
          <span>등록된프로젝트</span>
        </li>
        <li>
          <div class="count">{data?.projects?.completed ?? 0}개</div>
          <span>완료된프로젝트</span>
        </li>
        <li>
          <div class="count">{data?.assets?.total ?? 0}개</div>
          <span>등록된자산</span>
        </li>
        <li>
          <div class="count">{data?.assets?.automatic ?? 0}개</div>
          <span>자동등록</span>
        </li>
        <li>
          <div class="count">{data?.assets?.manual ?? 0}개</div>
          <span>수동등록</span>
        </li>
      </ul>

      <section class="rowContents col3">
        <article class="contentArea">
          <h4
            class="title border"
            style="display: flex; justify-content: space-between;"
          >
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            공지사항
            <span
              on:click={() => navigate("/page6?tab=Notice")}
              style="cursor: pointer;"
            >
              전체
            </span>
          </h4>
          <div class="tableListWrap nofirstth">
            <table class="tableList hdBorder">
              <colgroup>
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th class="text-center">제목</th>
                  <th class="text-center">작성자</th>
                  <th class="text-center">조회수</th>
                </tr>
              </thead>
              <tbody>
                {#if data?.board?.notices.length !== 0}
                  {#each data?.board?.notices as article}
                    <tr
                      on:click={() => {
                        navigate(`/page6?tab=Notice&id=${article?.art_index}`);
                      }}
                    >
                      <td class="text-center" style="font-size: 16px;"
                        >{article?.title ?? "-"}</td
                      >
                      <td class="text-center" style="font-size: 16px;"
                        >{article?.writer__user_name ?? "-"}</td
                      >
                      <td class="text-center" style="font-size: 16px;"
                        >{article?.view_count ?? 0}</td
                      >
                    </tr>
                  {/each}
                {/if}
              </tbody>
            </table>
          </div>
        </article>

        <article class="contentArea">
          <h4 class="title border">조치사항 알림</h4>
          <div class="tableListWrap nofirstth">
            <table class="tableList hdBorder">
              <colgroup>
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th class="text-center">항목</th>
                  <th class="text-center">결과</th>
                  <th class="text-center">담당자</th>
                </tr>
              </thead>
              <tbody>
                {#if data?.vulnerability_fix_notifications?.length !== 0}
                  {#each data?.vulnerability_fix_notifications as notify}
                    <tr>
                      <td class="text-center" style="font-size: 16px;"
                        >{notify?.ccr_index__ccr_item_no__ccc_item_no ??
                          "-"}</td
                      >
                      <td class="text-center" style="font-size: 16px;"
                        >{notify?.cfi_fix_status__cvs_desc ?? "-"}</td
                      >
                      <td class="text-center" style="font-size: 16px;"
                        >{notify?.user_index__user_name ?? 0}</td
                      >
                    </tr>
                  {/each}
                {/if}
              </tbody>
            </table>
          </div>
        </article>

        <article class="contentArea">
          <h4
            class="title border"
            style="display: flex; justify-content: space-between;"
          >
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            자료실
            <span
              on:click={() => navigate("/page6?tab=Dataroom")}
              style="cursor: pointer;"
            >
              전체
            </span>
          </h4>

          <div class="tableListWrap nofirstth">
            <table class="tableList hdBorder">
              <colgroup>
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th class="text-center">제목</th>
                  <th class="text-center">작성자</th>
                  <th class="text-center">조회수</th>
                </tr>
              </thead>
              <tbody>
                {#if data?.board?.dataroom?.length !== 0}
                  {#each data?.board?.dataroom as article}
                    <tr
                      on:click={() =>
                        navigate(
                          `/page6?tab=Dataroom&id=${article?.art_index}`,
                        )}
                    >
                      <td class="text-center" style="font-size: 16px;"
                        >{article?.title ?? "-"}</td
                      >
                      <td class="text-center" style="font-size: 16px;"
                        >{article?.writer__user_name ?? "-"}</td
                      >
                      <td class="text-center" style="font-size: 16px;"
                        >{article?.view_count ?? 0}</td
                      >
                    </tr>
                  {/each}
                {/if}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section class="rowContents">
        <div class="graphWrap">
          <article class="contentArea securityWrap">
            <h4 class="title border">전체보안수준</h4>
            <div
              class="circle"
              data-percent={data?.security_metrics?.overall_security_rate ?? 0}
              data-offset="345"
            >
              <svg width="100%" height="100%" viewBox="0 0 139 139">
                <circle
                  cx="75"
                  cy="75"
                  r="55"
                  stroke="#F2F2F2"
                  stroke-width="18"
                  fill="none"
                />
                <circle
                  class="progress"
                  cx="75"
                  cy="75"
                  r="55"
                  stroke="#0067ff"
                  stroke-width="18"
                  fill="none"
                  stroke-dasharray="345"
                  stroke-linecap="round"
                  transform="rotate(-90 75 75)"
                />
              </svg>
              <div class="percent">
                <span
                  >{data?.security_metrics?.overall_security_rate ?? 0}%</span
                >
              </div>
            </div>
          </article>
          <article class="contentArea securityWrap">
            <h4 class="title border">취약점조치현황</h4>
            <div
              class="circle"
              data-percent={data?.security_metrics?.vulnerability_fix_rate ?? 0}
              data-offset="345"
            >
              <svg width="100%" height="100%" viewBox="0 0 139 139">
                <circle
                  cx="75"
                  cy="75"
                  r="55"
                  stroke="#F2F2F2"
                  stroke-width="18"
                  fill="none"
                />
                <circle
                  class="progress"
                  cx="75"
                  cy="75"
                  r="55"
                  stroke="#0067ff"
                  stroke-width="18"
                  fill="none"
                  stroke-dasharray="345"
                  stroke-linecap="round"
                  transform="rotate(-90 75 75)"
                />
              </svg>
              <div class="percent">
                <span
                  >{data?.security_metrics?.vulnerability_fix_rate ?? 0}%</span
                >
              </div>
            </div>
          </article>
          <!-- <article class="contentArea">
          <h4 class="title border">결과 등록 현황</h4>
          <div class="barGraphWrap h220 bottom">
            <div class="bar-graph">
              <div class="bar" data-label="text" style="height: 30%;"></div>
              <div class="bar" data-label="text" style="height: 40%;"></div>
              <div class="bar" data-label="text" style="height: 50%;"></div>
              <div class="bar" data-label="text" style="height: 60%;"></div>
              <div class="bar" data-label="text" style="height: 70%;"></div>
              <div
                class="bar active"
                data-label="text"
                style="height: 80%;"
              ></div>
              <div class="bar" data-label="text" style="height: 100%;"></div>
            </div>
          </div>
        </article> -->
        </div>

        <article class="contentArea">
          <div class="flex head title border justify-between">
            <h4>대시보드</h4>
            <ul class="flex barColorGuide">
              <li class="green" style="font-size: 16px;">월별취약점조치건수</li>
              <li class="blue" style="font-size: 16px;">전체자산 보안수준</li>
              <li class="yellow" style="font-size: 16px;">자산등록현황</li>
            </ul>
          </div>
          <div class="barGraphWrap various bottom">
            <div class="bar-graph">
              {#if data?.monthly_stats}
                {#each data?.monthly_stats as stats}
                  <div class="flex bar-segment">
                    <div class="bar">
                      <div
                        class="bar-con green"
                        data-label={moment(stats?.month).format("YY") ?? "-"}
                        style="height: {stats?.vulnerability_fixes ?? '-'}%;"
                      ></div>
                    </div>
                    <div class="bar">
                      <div
                        class="bar-con blue"
                        data-label="-"
                        style="height: {stats?.asset_security_levels?.all ??
                          '-'}%;"
                      ></div>
                    </div>
                    <div class="bar">
                      <div
                        class="bar-con yellow"
                        data-label={moment(stats?.month).format("MM") ?? "-"}
                        style="height: {stats?.asset_registration?.all ??
                          '-'}%;"
                      ></div>
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </div>
        </article>
      </section>

      <section class="rowContents col2">
        <article class="contentArea">
          <h4 class="title border">취약점보유자산 Top5</h4>
          <div class="tableListWrap nofirstth">
            <table class="tableList hdBorder">
              <colgroup>
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th class="text-center">자산</th>
                  <th class="text-center">아이피주소</th>
                  <th class="text-center">취약점수</th>
                </tr>
              </thead>
              <tbody>
                {#if data.top_vulnerable_assets}
                  {#each data.top_vulnerable_assets as assets}
                    <tr>
                      <td class="text-center" style="font-size: 16px;"
                        >{assets?.ast_uuid__ass_uuid__ast_hostname ?? "-"}</td
                      >
                      <td class="text-center" style="font-size: 16px;"
                        >{assets?.ast_uuid__ass_uuid__ast_ipaddr ?? "-"}</td
                      >
                      <td class="text-center" style="font-size: 16px;"
                        >{assets?.total_vulnerabilities ?? "-"}</td
                      >
                    </tr>
                  {/each}
                {/if}
              </tbody>
            </table>
          </div>
        </article>

        <article class="contentArea">
          <h4 class="title border">취약점 Top5</h4>
          <div class="tableListWrap nofirstth">
            <table class="tableList hdBorder">
              <colgroup>
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th class="text-center">제목</th>
                  <th class="text-center">위험도</th>
                  <th class="text-center">취약점수</th>
                </tr>
              </thead>
              <tbody>
                {#if data.top_vulnerabilities}
                  {#each data.top_vulnerabilities as assets}
                    <tr>
                      <td style="font-size: 16px;"
                        >[{assets.ccc_item_no}] {assets?.ccc_item_title ??
                          "-"}</td
                      >
                      <td class="text-center" style="font-size: 16px;"
                        >{assets?.ccc_item_level ?? "-"}</td
                      >
                      <td class="text-center" style="font-size: 16px;"
                        >{assets?.total_vulnerabilities ?? "-"}</td
                      >
                    </tr>
                  {/each}
                {/if}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  </section>
{/if}

<style>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(167, 167, 167, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; /* Ensure it sits above other content */
  }

  .loading-spinner {
    border: 8px solid #f3f3f3; /* Light grey */
    border-top: 8px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
  }

  /* Spinner animation */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  *,
  table,
  th,
  td {
    font-size: 16px;
  }

  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }

  td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
