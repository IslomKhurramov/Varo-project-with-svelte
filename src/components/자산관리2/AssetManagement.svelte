<script>
  let assetGroup = [];
  for (let i = 1; i <= 25; i++) {
    assetGroup.push({
      assetName: `자산그룹${i}`,
    });
  }

  let assetCard = [];

  let selected = [];
  $: allSelected = assetCard.length === selected.length;

  for (let i = 0; i <= 15; i++) {
    assetCard.push({
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
  function toggleAll() {
    if (allSelected) {
      selected = [];
    } else {
      selected = [...assetCard];
    }
    // selected = allSelected ? [] : [...assetData]; // short version
  }
</script>

<main>
  <div class="select_group">
    <div class="select_container">
      <button class="select_button">자산그룹명</button>
      <select name="asset_group" id="asset_group" class="select_input">
        {#each assetGroup as asset}
          <option value="network_security">{asset.assetName}</option>
        {/each}
      </select>
    </div>

    <div class="select_container">
      <button class="select_button">생성방법</button>
      <select name="creation_method" id="creation_method" class="select_input">
        <option value="automated">기존 그룹에 엑셀 추가 등록 </option>
        <option value="manual">개별자산 선택 등록 </option>
        <option value="hybrid">엑셀과 개별자산 선택 등록 </option>
      </select>
    </div>
  </div>
  <div class="second_container">
    <p>생성방법</p>
    <div class="inside_container">
      <div class="first_line_container">
        <input type="file" />
        <input type="file" />
        <p>대용량업로드(엑셀파일)</p>
      </div>
      <div class="second_line_container">
        <div class="group_container">
          {#each assetGroup as group}
            <p>{group.assetName}</p>
          {/each}
        </div>
        <div class="right_container">
          <div class="option_container">
            <select name="" id="">
              <option value=""></option>
            </select>
            <select name="" id="">
              <option value=""></option>
            </select>
            <select name="" id="">
              <option value=""></option>
            </select>
            <button>button</button>
            <button>저장 </button>
          </div>
          <div class="first_check_cont">
            <input
              type="checkbox"
              class="first_checkbox"
              on:click="{toggleAll}"
              checked="{allSelected}"
            />
            <p>전체선택</p>
          </div>
          <div class="card_container">
            {#each assetCard as asset}
              <div class="card">
                <input
                  type="checkbox"
                  class="card_checkbox"
                  bind:group="{selected}"
                  name="{asset}"
                  value="{asset}"
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
    </div>
  </div>
  <div class="input_buttons">
    <button style="background: #dc3545;">저장하기</button>
  </div>
</main>

<style>
  main {
    width: 100%;
    padding: 20px;
    font-family: "Arial", sans-serif;
    color: lightgray; /* Light text color for readability */
  }

  .select_group {
    display: flex;
    flex-direction: column;
    gap: 20px; /* Space between select elements */
    max-width: 600px;
    margin: 0 auto;
  }

  .select_container {
    display: flex;
    align-items: center;
    background-color: #2e2e2e; /* Slightly lighter than the main background */
    border: 1px solid #3e3e3e;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.6); /* Stronger shadow for a more solid feel */
  }

  .select_button {
    background-color: #4682b4; /* A strong, trustworthy blue */
    color: #ffffff;
    padding: 12px 24px;
    border: none;
    font-size: 14px;
    margin-bottom: 0px;
    font-weight: bold;
    transition: background-color 0.3s ease;
    border-right: 1px solid #3e3e3e;
    flex-shrink: 0;
    width: 140px;
  }

  .select_button:hover {
    background-color: #005a99; /* Darker blue on hover */
  }

  .select_input {
    width: 100%;
    padding: 12px;
    border: none;
    font-size: 14px;
    background-color: #2e2e2e;
    color: #e0e0e0; /* Light text for readability */
    cursor: pointer;
    outline: none;
  }

  .select_input:hover,
  .select_input:focus {
    background-color: #3a3a3a;
  }

  .select_input option {
    background-color: #2e2e2e;
    color: #e0e0e0;
  }

  .second_container {
    display: flex;
    flex-direction: column;
    width: 95%;
    padding: 10px 10px;
    margin-right: 20px;
    padding-right: 20px;
  }

  .inside_container {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #000000;
    background-color: #e0e0e0;
    color: #000000;
  }

  .first_line_container {
    display: flex;
    flex-direction: row;
    padding: 20px;
    gap: 10px;
    background-color: #003366;
    border-radius: 10px;
    color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .second_line_container {
    display: flex;
    flex-direction: row;
    padding: 20px;
    width: 100%;
    gap: 10px;
    max-height: 500px;
  }

  .group_container {
    width: 250px;
    font-style: Roboto sans-serif;
    background-color: #f7f7f7;
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Ensure items start from the top */
    align-items: flex-start; /* Align items to the start of the container */
    overflow-y: auto; /* Enable scrolling if content overflows */
    overflow-x: hidden;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 100%; /* Ensure the height fits within the parent container */
  }

  .group_container p {
    margin: 5px 0; /* Add spacing between the paragraphs */
    padding: 0;
    font-size: 14px;
    color: #000; /* Adjust text color if needed */
    width: 100%; /* Ensure the paragraphs take up the full width */
    box-sizing: border-box; /* Include padding/border in element's width/height */
  }
  .group_container p:hover {
    cursor: pointer;
    background-color: #37a5f3;
  }

  .right_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 650px;
    background-color: #f7f7f7;
    gap: 10px;
    padding: 10px;
    border-radius: 10px;
    margin-right: -35px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .option_container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 5px;
    width: 100%;
    justify-content: center;
  }

  .option_container select {
    width: 120px;
    background-color: #3a3a3a;
    color: #e0e0e0;
    border: none;
    padding: 10px;
    border-radius: 5px;
  }

  .option_container button {
    background-color: #4682b4;
    color: #ffffff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }

  .option_container button:hover {
    background-color: #005a99;
  }

  .card_container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 10px;
    row-gap: 30px;
    justify-content: flex-start;
    overflow-y: auto;
    overflow-x: hidden;
    box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 8px;
  }

  .card {
    position: relative;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    color: #000000;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    padding: 10px;
    width: 150px;
    height: 83px;
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
    align-items: center; /* Center image vertically */
    justify-content: center; /* Center image horizontally */
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
    color: #000000;
    padding: 5px;
    display: flex;
    flex-direction: column;
  }
  .img_overlay p {
    margin: 0;
  }
  .info_card {
    padding-top: 5px;
  }
  .info_card p {
    margin: 2px;
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
  }
  .input_buttons {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    width: 100%;
    margin-top: 10px;
  }

  .input_buttons button {
    background-color: #007bff; /* Primary button color */
    color: #ffffff;
    width: 100px;
    height: 35px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .input_buttons button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
