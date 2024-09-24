<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  let svg1, svg2;
  let selectedGroupIndex = 0;
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  let data1 = [
    { subCategory: "Asset Value1", value: 20 },
    { subCategory: "Asset Value2", value: 15 },
    { subCategory: "Asset Level1", value: 40 },
    { subCategory: "Asset Level2", value: 35 },
  ];

  let data2 = [
    [
      { category: "자산그룹1", subCategory: "Plan", value: 60 },
      { category: "자산그룹1", subCategory: "Actual", value: 55 },
      { category: "자산그룹1", subCategory: "Forecast", value: 65 },
    ],
    [
      { category: "자산그룹2", subCategory: "Plan", value: 85 },
      { category: "자산그룹2", subCategory: "Actual", value: 58 },
      { category: "자산그룹2", subCategory: "Forecast", value: 96 },
    ],
    [
      { category: "자산그룹3", subCategory: "Plan", value: 36 },
      { category: "자산그룹3", subCategory: "Actual", value: 53 },
      { category: "자산그룹3", subCategory: "Forecast", value: 25 },
    ],
    // Additional data arrays for other groups
  ];

  let chasanGroups = data2.map((group, index) => ({
    chasanGroup: group[0].category,
    index,
  }));

  function drawBarChart(svgElement, dataset) {
    d3.select(svgElement).selectAll("*").remove(); // Clear previous chart content

    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select(svgElement)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
      )
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .rangeRound([0, width])
      .padding(0.1)
      .domain(dataset.map((d) => d.subCategory));

    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(dataset, (d) => d.value)]);

    svg
      .selectAll(".bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.subCategory))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => colorScale(d.subCategory));

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .style("font-size", "14px");

    svg.append("g").call(d3.axisLeft(y)).style("font-size", "14px");

    // Adding labels
    svg
      .selectAll(".label")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.subCategory) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .style("fill", "#333")
      .style("font-size", "12px")
      .text((d) => d.value);
  }

  onMount(() => {
    drawBarChart(svg1, data1);
    drawBarChart(svg2, data2[selectedGroupIndex]);
  });

  $: if (svg2) {
    drawBarChart(svg2, data2[selectedGroupIndex]);
  }
</script>

<main class="container">
  <div class="first_container">
    <div class="first_line1">
      <p>기간선택</p>
      <p class="options">3/6/9/12/전체</p>
    </div>
    <div class="second_line1">
      <svg bind:this={svg1}></svg>
      <p class="chart_title">전체자산 등록 추세</p>
    </div>
  </div>
  <div class="second_container">
    <div class="second_line2">
      <p>
        <select bind:value={selectedGroupIndex} class="dropdown">
          {#each chasanGroups as group}
            <option value={group.index}>{group.chasanGroup}</option>
          {/each}
        </select>
      </p>
      <svg bind:this={svg2}></svg>
    </div>
  </div>
</main>

<style>
  .container {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 20px;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .first_container,
  .second_container {
    flex: 1;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .first_line1 {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 25px;
    margin-bottom: 20px;
  }

  .options {
    font-weight: normal;
    font-size: 14px;
    color: #555;
  }

  .second_line1 {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .chart_title {
    margin-top: 10px;
    font-weight: bold;
    font-size: 16px;
    color: #333;
  }

  .second_container {
    display: flex;
    flex-direction: column;
  }

  .second_line2 {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  svg {
    width: 100%;
    max-height: 300px;
  }

  .dropdown {
    padding: 8px 12px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 14px;
    color: #333;
  }

  p {
    margin: 0;
    font-weight: bold;
    color: #333;
  }
</style>
