<script>
  import { scaleLinear, scaleBand } from "d3-scale";
  import { quantize, interpolatePlasma, pie, arc } from "d3";

  let piedata = [
    { ages: "<18", count: 727432 },
    { ages: "18-24", count: 341435 },
    { ages: "25-34", count: 444509 },
    { ages: "35-44", count: 426967 },
    { ages: "45-54", count: 480565 },
    { ages: "55-64", count: 515347 },
    { ages: "≥65", count: 629032 },
  ];

  const pieWidth = 300;
  const pieHeight = pieWidth;
  const fontSize = 10;
  const strokeWidth = 1;
  const strokeLinejoin = "round";
  const outerRadius = Math.min(pieWidth, pieHeight) * 0.5 - 15;
  const innerRadius = 30;
  const labelRadius = (innerRadius + outerRadius) / 2;

  // Generate colors
  let colors = quantize(
    (t) => interpolatePlasma(t * 0.7 + 0.3),
    piedata.length,
  );

  // Create pie layout
  const wedges = pie().value((d) => d.count)(piedata);

  // Create arc generators
  const arcPath = arc().innerRadius(innerRadius).outerRadius(outerRadius);
  const arcLabel = arc().innerRadius(labelRadius).outerRadius(labelRadius);

  // Define four separate datasets
  const data1 = [
    { month: "Jan", measures: 15 },
    { month: "Feb", measures: 10 },
    { month: "Mar", measures: 20 },
  ];

  const data2 = [
    { project: "Project A", status: 70 },
    { project: "Project B", status: 50 },
    { project: "Project C", status: 90 },
  ];

  const data3 = [
    { asset: "Asset 1", securityLevel: 85 },
    { asset: "Asset 2", securityLevel: 78 },
    { asset: "Asset 3", securityLevel: 92 },
  ];

  const data4 = [
    { asset: "Asset A", registration: 100 },
    { asset: "Asset B", registration: 80 },
    { asset: "Asset C", registration: 90 },
  ];

  const padding = { top: 30, right: 10, bottom: 20, left: 50 };

  let width = 250;
  let height = 200;

  $: scales = [
    {
      xScale: scaleBand()
        .domain(data1.map((d) => d.month))
        .range([padding.left, width - padding.right])
        .padding(0.1),
      yScale: scaleLinear()
        .domain([0, Math.max(...data1.map((d) => d.measures))])
        .range([height - padding.bottom, padding.top]),
    },
    {
      xScale: scaleBand()
        .domain(data2.map((d) => d.project))
        .range([padding.left, width - padding.right])
        .padding(0.1),
      yScale: scaleLinear()
        .domain([0, 100])
        .range([height - padding.bottom, padding.top]),
    },
    {
      xScale: scaleBand()
        .domain(data3.map((d) => d.asset))
        .range([padding.left, width - padding.right])
        .padding(0.1),
      yScale: scaleLinear()
        .domain([0, 100])
        .range([height - padding.bottom, padding.top]),
    },
    {
      xScale: scaleBand()
        .domain(data4.map((d) => d.asset))
        .range([padding.left, width - padding.right])
        .padding(0.1),
      yScale: scaleLinear()
        .domain([0, 100])
        .range([height - padding.bottom, padding.top]),
    },
  ];
</script>

<!-- <main>
  <div class="container">
    <header>
      <p>Registered Projects: 10</p>
      <p>Completed Projects: 10</p>
      <p>Registered Assets: 10</p>
      <p>Automatic Registrations: 10</p>
      <p>Manual Registrations: 10</p>
    </header>
    <div class="announcement_container">
      <div class="table">
        <h3>공지사항</h3>
      </div>
      <div class="table">
        <h3>조치사항 알림</h3>
      </div>
      <div class="table">
        <h3>자료실</h3>
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-container">
        <h3>취약점조치현황</h3>
        <div class="pie_container">
          <svg
            {pieWidth}
            {pieHeight}
            viewBox="{-pieWidth / 2} {-pieHeight / 2} {pieWidth} {pieHeight}"
          >
            {#each wedges as wedge, i}
              <path
                fill={colors[i]}
                d={arcPath(wedge)}
                stroke="white"
                stroke-width={strokeWidth}
                stroke-linejoin={strokeLinejoin}
              ></path>
              <text
                transform="translate({arcLabel.centroid(wedge)})"
                dy=".35em"
                text-anchor="middle"
                font-size={fontSize}
                fill="white"
              >
                <tspan x="0" font-weight="bold">{piedata[i].ages}</tspan>
                <tspan x="0" dy="1.2em"
                  >{piedata[i].count.toLocaleString()}</tspan
                >
              </text>
            {/each}
          </svg>
        </div>
      </div>

      <div class="chart-container">
        <h3>월별취약점조치건수</h3>
        <div class="chart">
          <svg>
            <g class="axis y-axis">
              {#each scales[0].yScale.ticks(5) as tick}
                <g
                  class="tick tick-{tick}"
                  transform="translate(0, {scales[0].yScale(tick)})"
                >
                  <line x2="100%"></line>
                  <text y="-4">{tick}</text>
                </g>
              {/each}
            </g>
            <g class="axis x-axis">
              {#each data1 as point, i}
                <g
                  class="tick"
                  transform="translate({scales[0].xScale(
                    point.month,
                  )},{height})"
                >
                  <text x={scales[0].xScale.bandwidth() / 2} y="-4">
                    {point.month}
                  </text>
                </g>
              {/each}
            </g>
            <g class="bars">
              {#each data1 as point}
                <rect
                  x={scales[0].xScale(point.month)}
                  y={scales[0].yScale(point.measures)}
                  width={scales[0].xScale.bandwidth()}
                  height={scales[0].yScale(0) -
                    scales[0].yScale(point.measures)}
                ></rect>
              {/each}
            </g>
          </svg>
        </div>
      </div>

      <div class="chart-container">
        <h3>프로젝트등록현황</h3>
        <div class="chart">
          <svg>
            <g class="axis y-axis">
              {#each scales[1].yScale.ticks(5) as tick}
                <g
                  class="tick tick-{tick}"
                  transform="translate(0, {scales[1].yScale(tick)})"
                >
                  <line x2="100%"></line>
                  <text y="-4">{tick}%</text>
                </g>
              {/each}
            </g>
            <g class="axis x-axis">
              {#each data2 as point, i}
                <g
                  class="tick"
                  transform="translate({scales[1].xScale(
                    point.project,
                  )},{height})"
                >
                  <text x={scales[1].xScale.bandwidth() / 2} y="-4">
                    {point.project}
                  </text>
                </g>
              {/each}
            </g>
            <g class="bars">
              {#each data2 as point}
                <rect
                  x={scales[1].xScale(point.project)}
                  y={scales[1].yScale(point.status)}
                  width={scales[1].xScale.bandwidth()}
                  height={scales[1].yScale(0) - scales[1].yScale(point.status)}
                ></rect>
              {/each}
            </g>
          </svg>
        </div>
      </div>

      <div class="chart-container">
        <h3>전체자산 보안수준</h3>
        <div class="chart">
          <svg>
            <g class="axis y-axis">
              {#each scales[2].yScale.ticks(5) as tick}
                <g
                  class="tick tick-{tick}"
                  transform="translate(0, {scales[2].yScale(tick)})"
                >
                  <line x2="100%"></line>
                  <text y="-4">{tick}%</text>
                </g>
              {/each}
            </g>
            <g class="axis x-axis">
              {#each data3 as point, i}
                <g
                  class="tick"
                  transform="translate({scales[2].xScale(
                    point.asset,
                  )},{height})"
                >
                  <text x={scales[2].xScale.bandwidth() / 2} y="-4">
                    {point.asset}
                  </text>
                </g>
              {/each}
            </g>
            <g class="bars">
              {#each data3 as point}
                <rect
                  x={scales[2].xScale(point.asset)}
                  y={scales[2].yScale(point.securityLevel)}
                  width={scales[2].xScale.bandwidth()}
                  height={scales[2].yScale(0) -
                    scales[2].yScale(point.securityLevel)}
                ></rect>
              {/each}
            </g>
          </svg>
        </div>
      </div>

      <div class="chart-container">
        <h3>자산등록현황</h3>
        <div class="chart">
          <svg>
            <g class="axis y-axis">
              {#each scales[3].yScale.ticks(5) as tick}
                <g
                  class="tick tick-{tick}"
                  transform="translate(0, {scales[3].yScale(tick)})"
                >
                  <line x2="100%"></line>
                  <text y="-4">{tick}%</text>
                </g>
              {/each}
            </g>
            <g class="axis x-axis">
              {#each data4 as point, i}
                <g
                  class="tick"
                  transform="translate({scales[3].xScale(
                    point.asset,
                  )},{height})"
                >
                  <text x={scales[3].xScale.bandwidth() / 2} y="-4">
                    {point.asset}
                  </text>
                </g>
              {/each}
            </g>
            <g class="bars">
              {#each data4 as point}
                <rect
                  x={scales[3].xScale(point.asset)}
                  y={scales[3].yScale(point.registration)}
                  width={scales[3].xScale.bandwidth()}
                  height={scales[3].yScale(0) -
                    scales[3].yScale(point.registration)}
                ></rect>
              {/each}
            </g>
          </svg>
        </div>
      </div>
    </div>
    <div class="announcement_container">
      <div class="table">
        <h3>취약점보유자산 Top5</h3>
      </div>
      <div class="table">
        <h3>취약점 Top5</h3>
      </div>
    </div>
  </div>
</main> -->

<section
  class="dashboard"
  style="overflow: scroll;
    height: calc(100vh - 120px);"
>
  <div class="contentsWrap w100">
    <ul class="countWrap flex">
      <li>
        <div class="count">10개</div>
        <span>등록된프로젝트</span>
      </li>
      <li>
        <div class="count">10개</div>
        <span>완료된프로젝트</span>
      </li>
      <li>
        <div class="count">10개</div>
        <span>등록된자산</span>
      </li>
      <li>
        <div class="count">10개</div>
        <span>자동등록</span>
      </li>
      <li>
        <div class="count">10개</div>
        <span>수동등록</span>
      </li>
    </ul>

    <section class="rowContents col3">
      <article class="contentArea">
        <h4 class="title border">공지사항</h4>
        <div class="tableListWrap nofirstth">
          <table class="tableList hdBorder">
            <colgroup>
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th class="text-center">타이틀명</th>
                <th class="text-center">타이틀명</th>
                <th class="text-center">타이틀명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
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
                <th class="text-center">타이틀명</th>
                <th class="text-center">타이틀명</th>
                <th class="text-center">타이틀명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="contentArea">
        <h4 class="title border">자료실</h4>
        <div class="tableListWrap nofirstth">
          <table class="tableList hdBorder">
            <colgroup>
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th class="text-center">타이틀명</th>
                <th class="text-center">타이틀명</th>
                <th class="text-center">타이틀명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>

    <section class="rowContents">
      <div class="graphWrap">
        <article class="contentArea securityWrap">
          <h4 class="title border">취약점조치현황</h4>
          <div class="circle" data-percent="80" data-offset="345">
            <svg width="" height="" viewBox="0 0 139 139">
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
              <span>80%</span>
            </div>
          </div>
        </article>
        <article class="contentArea">
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
        </article>
      </div>

      <article class="contentArea">
        <div class="flex head title border justify-between">
          <h4>대시보드</h4>
          <ul class="flex barColorGuide">
            <li class="green">월별취약점조치건수</li>
            <li class="blue">전체자산 보안수준</li>
            <li class="yellow">자산등록현황</li>
          </ul>
        </div>
        <div class="barGraphWrap various bottom">
          <div class="bar-graph">
            <div class="flex bar-segment">
              <div class="bar">
                <div
                  class="bar-con green"
                  data-label="-"
                  style="height: 30%;"
                ></div>
              </div>
              <div class="bar">
                <div
                  class="bar-con blue"
                  data-label="-"
                  style="height: 60%;"
                ></div>
              </div>
              <div class="bar">
                <div
                  class="bar-con yellow"
                  data-label="-"
                  style="height: 40%;"
                ></div>
              </div>
            </div>
            <div class="flex bar-segment">
              <div class="bar">
                <div
                  class="bar-con green"
                  data-label="-"
                  style="height: 30%;"
                ></div>
              </div>
              <div class="bar">
                <div
                  class="bar-con blue"
                  data-label="-"
                  style="height: 60%;"
                ></div>
              </div>
              <div class="bar">
                <div
                  class="bar-con yellow"
                  data-label="-"
                  style="height: 40%;"
                ></div>
              </div>
            </div>
            <div class="flex bar-segment">
              <div class="bar">
                <div
                  class="bar-con green"
                  data-label="-"
                  style="height: 30%;"
                ></div>
              </div>
              <div class="bar">
                <div
                  class="bar-con blue"
                  data-label="-"
                  style="height: 60%;"
                ></div>
              </div>
              <div class="bar">
                <div
                  class="bar-con yellow"
                  data-label="-"
                  style="height: 40%;"
                ></div>
              </div>
            </div>
            <div class="flex bar-segment">
              <div class="bar">
                <div
                  class="bar-con green"
                  data-label="-"
                  style="height: 30%;"
                ></div>
              </div>
              <div class="bar">
                <div
                  class="bar-con blue"
                  data-label="-"
                  style="height: 60%;"
                ></div>
              </div>
              <div class="bar">
                <div
                  class="bar-con yellow"
                  data-label="-"
                  style="height: 40%;"
                ></div>
              </div>
            </div>
            <div class="flex bar-segment">
              <div class="bar">
                <div
                  class="bar-con green"
                  data-label="-"
                  style="height: 30%;"
                ></div>
              </div>
              <div class="bar">
                <div
                  class="bar-con blue"
                  data-label="-"
                  style="height: 60%;"
                ></div>
              </div>
              <div class="bar">
                <div
                  class="bar-con yellow"
                  data-label="-"
                  style="height: 40%;"
                ></div>
              </div>
            </div>
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
                <th class="text-center">타이틀명</th>
                <th class="text-center">타이틀명</th>
                <th class="text-center">타이틀명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
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
                <th class="text-center">타이틀명</th>
                <th class="text-center">타이틀명</th>
                <th class="text-center">타이틀명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  </div>
</section>
