<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { getAssetRegisterStatus } from "../../services/page2/assetService";
  import { assetRegisterStatus } from "../../services/page2/asset.store";

  let current_day = "";
  let svg1, svg2;
  let selectedGroupIndex = 0;
  export let closeModal;

  async function registerStatus() {
    try {
      const response = await getAssetRegisterStatus(current_day);

      if (response.RESULT === "OK") {
        assetRegisterStatus.set(response.CODE); // Save the entire CODE object
        console.log("status", response.CODE);
      }
    } catch (err) {
      console.error("Error fetching asset register status:", err);
    }
  }
  /*****************************************************************************/
  $: if (current_day) {
    registerStatus();
  }
  onMount(() => {
    registerStatus();
  });
  /**************************************************************************/
  function check() {
    console.log("status", $assetRegisterStatus);
  }

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Draw the bar chart
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

  // Extract total values for the first chart
  function getTotalValues() {
    const assetData = $assetRegisterStatus;
    if (assetData && assetData.total) {
      return assetData.total.map((item) => {
        const key = Object.keys(item)[0]; // Get the first key (3, 6, 9, 12)
        return {
          subCategory: key,
          value: Number(item[key]) || 0, // Convert string to number
        };
      });
    }
    return [];
  }

  // Get selected group data for the second chart
  function getSelectedGroupData(index) {
    const assetData = $assetRegisterStatus;
    if (assetData && assetData.groups) {
      const groupKeys = Object.keys(assetData.groups);
      if (index >= 0 && index < groupKeys.length) {
        const selectedGroupKey = groupKeys[index];
        return assetData.groups[selectedGroupKey].map((item) => {
          const key = Object.keys(item)[0]; // Get the first key (3, 6, 9, 12)
          return {
            subCategory: key,
            value: Number(item[key]) || 0,
          };
        });
      }
    }
    return [];
  }

  // On mount, draw the initial charts
  $: if ($assetRegisterStatus) {
    // Draw both charts with available data when assetRegisterStatus is updated
    drawBarChart(svg1, getTotalValues());
    drawBarChart(svg2, getSelectedGroupData(selectedGroupIndex));
  }

  // Reactively update the second chart when the selected group changes
  $: if (svg2) {
    const selectedGroupData = getSelectedGroupData(selectedGroupIndex);
    drawBarChart(svg2, selectedGroupData);
  }
</script>

<div class="modalContents big content">
  <div class="contents">
    <div class=" containerModal" style="display: flex; flex-direction:column">
      <div class="flex head justify-between">
        <h3 class="title">등록현황</h3>
        <button type="button" class="btnImg" on:click={closeModal}
          ><img src="./assets/images/icon/close.svg" /></button
        >
      </div>
      <div class="containerModal">
        <div class="first_container">
          <div class="first_line1">
            <p>기간선택</p>
            <p class="options">
              <input type="date" bind:value={current_day} />
            </p>
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
                {#if $assetRegisterStatus && $assetRegisterStatus.groups}
                  {#each Object.keys($assetRegisterStatus.groups) as groupTitle, index}
                    <option value={index}>{groupTitle}</option>
                  {/each}
                {:else}
                  <option disabled>No data available</option>
                {/if}
              </select>
            </p>
            <svg bind:this={svg2}></svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .containerModal {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 20px;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
  }

  .first_container,
  .second_container {
    flex: 1;
    background-color: #ffffff;
    height: 100%;
    border-radius: 10px;
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
