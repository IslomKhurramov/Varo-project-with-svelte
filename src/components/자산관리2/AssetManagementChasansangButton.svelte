<script>
  let selected = [];
  $: allSelected = assets.length === selected.length;
  let assets = [];

  function toggleAll() {
    if (allSelected) {
      selected = [];
    } else {
      selected = [...assets];
    }
  }

  for (let i = 0; i <= 15; i++) {
    assets.push({
      secureScore: "90",
      assetGroup: "(자산그룹1)",
      assetData: "2024/07/22 13:11:22",
      operatingSystem: "윈도우 서버 2022",
      assetName: "ABCDEFSDFSDFEWFSDF",
      ipAdress: "192.168.0.01",
      inspectionTarget: "UNIX, DBMS, WEB",
      agentInstallation: "설치됨",
    });
  }

  let filterCriteria = "";
  let selectedCommand = "";
  let keyword = "";
  let commandOutput = "";

  function searchAssets() {
    assets.forEach((asset) => {
      asset.selected = asset.os.includes(filterCriteria);
    });
  }

  function executeCommand() {
    assets.forEach((asset) => {
      if (asset.selected && asset.os.includes(keyword)) {
        asset.result = true;
      } else {
        asset.result = false;
      }
    });
  }
</script>

<main>
  <!-- Main container centered and smaller -->
  <div class="main-container">
    <!-- First Screen: Asset Selection and Filtering -->
    <div class="filter-container">
      <div class="filter">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>Filter by OS:</label>
        <select bind:value={filterCriteria}>
          <option value="">All</option>
          <option value="Windows">Windows</option>
          <option value="UNIX">UNIX</option>
        </select>
        <button on:click={searchAssets}>Search</button>
      </div>
    </div>

    <!-- Second Screen: Command Execution -->
    <div class="command-container">
      <div class="command-section">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>Command:</label>
        <select bind:value={selectedCommand}>
          <option value="임의 명령수행">임의 명령수행</option>
          <!-- Add more command options if needed -->
        </select>

        <textarea bind:value={commandOutput} placeholder="Enter command..."
        ></textarea>
      </div>

      <div class="keyword-section">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>Comparison Keyword:</label>
        <input
          type="text"
          bind:value={keyword}
          placeholder="Enter keyword..."
        />
        <button style="width: 120px;" on:click={executeCommand}>Execute</button>
      </div>
    </div>

    <div class="assets-container">
      <div class="first_check_cont">
        <input
          type="checkbox"
          class="first_checkbox"
          on:click={toggleAll}
          checked={allSelected}
        />
        <p>전체선택</p>
      </div>
      <div class="card_container">
        {#each assets as asset}
          <div class="card">
            <input
              type="checkbox"
              class="card_checkbox"
              bind:group={selected}
              name={asset}
              value={asset}
            />
            <div class="img_container">
              <!-- svelte-ignore a11y-img-redundant-alt -->
              <img src="./images/Picture1.png" alt="Image description" />
              <div class="img_overlay">
                <p>UNIX</p>
                <p>DBMS</p>
              </div>
            </div>
            <div class="info_card">
              <p><strong>이름:</strong> abcdefg</p>
              <p><strong>아피:</strong> 192.168.0.2</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>

<style>
  .main-container {
    margin: 20px auto;
    padding: 20px;
    background-color: #f7f9fb;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .filter-container,
  .command-container {
    margin-bottom: 20px;
  }

  .filter {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .filter label {
    font-weight: bold;
    color: #333;
  }

  .assets-container {
    display: flex;
    flex-direction: column;
  }

  .card_container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(150px, 1fr)
    ); /* Responsive grid */
    gap: 10px;
    row-gap: 20px;
    overflow-y: auto;
    max-height: 300px; /* Limit height */
    padding: 10px;
    box-shadow:
      inset 0 0 35px 5px rgba(0, 0, 0, 0.25),
      inset 0 2px 1px 1px rgba(255, 255, 255, 0.9),
      inset 0 -2px 1px rgba(0, 0, 0, 0.25);
  }

  .card {
    position: relative;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    color: #333;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    padding: 15px;
    width: 75%;
    height: 85px; /* Adjusted height */
    font-size: 12px;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  .card_checkbox {
    top: 5px;
    left: 5px;
    position: absolute;
    cursor: pointer;
    transform: scale(1.2);
  }

  .img_container {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }

  .img_container img {
    width: 40px;
    height: 40px;
    display: block;
    transition: transform 0.3s ease;
  }

  .img_container:hover img {
    transform: scale(1.1);
  }

  .img_overlay {
    color: #000;
    padding: 5px;
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .img_overlay p {
    margin: 0;
    font-size: 10px;
  }

  .info_card {
    padding-top: 5px;
  }

  .info_card p {
    margin: 2px 0;
    font-size: 12px;
    color: #333;
  }

  .first_checkbox {
    width: 13px;
    cursor: pointer;
    transform: scale(1.2);
    margin-top: 10px;
  }

  .first_check_cont {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    width: 100%;
    margin-top: 10px;
  }

  .command-section,
  .keyword-section {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }

  .command-section label,
  .keyword-section label {
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }

  textarea {
    resize: none;
    height: 60px;
    margin-top: 5px;
    border-radius: 8px;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    background-color: #fafafa;
  }

  input[type="text"] {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 14px;
    margin-bottom: 10px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    background-color: #fafafa;
  }

  button {
    padding: 10px 15px;
    background-color: #0056b3;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #005fa3;
  }

  select {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 14px;
    background-color: #fafafa;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  }
</style>
