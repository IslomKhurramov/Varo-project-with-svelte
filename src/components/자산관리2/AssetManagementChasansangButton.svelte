<script>
  let assets = [
    {
      id: 1,
      os: "Windows",
      dbms: "DBMS",
      name: "abcdefg",
      ip: "192.168.0.2",
      selected: false,
      result: false,
    },
    {
      id: 2,
      os: "UNIX",
      dbms: "DBMS",
      name: "abcdefg",
      ip: "192.168.0.2",
      selected: false,
      result: false,
    },
    // Add more assets as needed
  ];

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
        <label>Filter by OS:</label>
        <select bind:value="{filterCriteria}">
          <option value="">All</option>
          <option value="Windows">Windows</option>
          <option value="UNIX">UNIX</option>
        </select>
        <button on:click="{searchAssets}">Search</button>
      </div>
    </div>

    <div class="assets-container">
      {#each assets as asset}
        <div class="asset-card {asset.selected ? 'selected' : ''}">
          <p><strong>{asset.os}</strong></p>
          <p>DBMS: {asset.dbms}</p>
          <p>Name: {asset.name}</p>
          <p>IP: {asset.ip}</p>
        </div>
      {/each}
    </div>

    <!-- Second Screen: Command Execution -->
    <div class="command-container">
      <div class="command-section">
        <label>Command:</label>
        <select bind:value="{selectedCommand}">
          <option value="임의 명령수행">임의 명령수행</option>
          <!-- Add more command options if needed -->
        </select>

        <textarea bind:value="{commandOutput}" placeholder="Enter command..."
        ></textarea>
      </div>

      <div class="keyword-section">
        <label>Comparison Keyword:</label>
        <input
          type="text"
          bind:value="{keyword}"
          placeholder="Enter keyword..."
        />
        <button on:click="{executeCommand}">Execute</button>
      </div>
    </div>

    <div class="assets-container">
      {#each assets as asset}
        <div class="asset-card {asset.result ? 'result' : ''}">
          <p><strong>{asset.os}</strong></p>
          <p>DBMS: {asset.dbms}</p>
          <p>Name: {asset.name}</p>
          <p>IP: {asset.ip}</p>
        </div>
      {/each}
    </div>
  </div>
</main>

<style>
  .main-container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f7f7f7;
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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }

  .asset-card {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    background-color: #fff;
    font-size: 14px;
    text-align: center;
    transition:
      transform 0.3s,
      box-shadow 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .asset-card.selected {
    border: 2px solid #007acc;
    background-color: #e6f2ff;
  }

  .asset-card.result {
    background-color: #fff5e6;
  }

  .asset-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
    background-color: #007acc;
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
