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
        <div class="asset-card" class:selected="{asset.selected}">
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
        <div class="asset-card" class:result="{asset.result}">
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
  /* Main container centered and reduced in size */
  .main-container {
    max-width: 800px;
    margin: 0 auto;
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
  }

  .assets-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }

  .asset-card {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    background-color: white;
    font-size: 12px;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    text-align: center;
  }

  .asset-card.selected {
    border: 2px solid #003366;
    background-color: #e0f7ff;
  }

  .asset-card.result {
    background-color: #fff3cd;
  }

  .asset-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .command-section,
  .keyword-section {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }

  textarea {
    resize: none;
    height: 50px;
    margin-top: 5px;
    border-radius: 5px;
    padding: 8px;
    font-size: 12px;
  }

  input[type="text"] {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 12px;
    margin-bottom: 10px;
  }

  button {
    padding: 8px 12px;
    background-color: #003366;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #003366;
  }

  select {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 12px;
  }
</style>
