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
