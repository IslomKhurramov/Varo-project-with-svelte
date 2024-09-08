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
            <div class="div1">
              <select name="" id="">
                <option value=""></option>
              </select>
              <select name="" id="">
                <option value=""></option>
              </select>
              <select name="" id="">
                <option value=""></option>
              </select>
            </div>
            <div class="div2">
              <button>button</button>
              <button>저장</button>
            </div>
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
    <button class="save_button">저장하기</button>
  </div>
</main>

<style>
  main {
    background-color: #f7f9fb;
    width: 100%;
    color: #333; /* Darker text color for better readability */
    box-sizing: border-box;
    overflow-x: hidden; /* Prevent horizontal scroll */
    font-family: "Arial", sans-serif;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  .select_group {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 60%; /* Ensure it doesn’t exceed the container */
    margin: 0 auto;
  }

  .select_container {
    display: flex;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .select_button {
    background-color: #005fa3;
    color: #fff;
    padding: 12px 24px;
    border: none;
    font-size: 12px;
    font-weight: bold;
    transition: background-color 0.3s ease;
    border-right: 1px solid #3e3e3e;
    flex-shrink: 0;
    width: 140px;
  }

  .select_button:hover {
    background-color: #005a99;
  }

  .select_input {
    width: 100%;
    padding: 12px;
    border: none;
    font-size: 12px;
    background-color: #fff;
    color: #000;
    cursor: pointer;
    outline: none;
  }

  .select_input:hover,
  .select_input:focus {
    background-color: #e0e0e0;
  }

  .select_input option {
    background-color: #fff;
    color: #000;
  }

  .second_container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }

  .second_container p {
    color: #333;
    margin-bottom: 10px;
  }

  .inside_container {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    color: #333;
    padding: 20px;
    box-sizing: border-box;
  }

  .first_line_container {
    display: flex;
    flex-direction: row;
    gap: 10px;
    background-color: #005fa3;
    border-radius: 10px;
    color: #fff;
    padding: 15px;
  }

  .first_line_container p {
    margin: 0;
    font-weight: bold;
    color: #f2f3f4;
  }

  .second_line_container {
    display: flex;
    flex-direction: row;
    gap: 35px;
    max-height: 500px;
    overflow-x: hidden; /* Prevent horizontal overflow */
  }

  .group_container {
    width: 250px;
    font-family: "Roboto", sans-serif;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 100%;
  }

  .group_container p {
    margin: 5px 0;
    font-size: 12px;
    color: #333;
    padding: 8px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .group_container p:hover {
    cursor: pointer;
    background-color: #37a5f3;
    color: #fff;
  }

  .right_container {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #fff;
    gap: 10px;
    padding: 20px;
    border-radius: 10px;
    box-sizing: border-box;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow-x: hidden; /* Prevent horizontal overflow */
  }

  .option_container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    width: 100%;
    justify-content: space-between;
  }

  .option_container select {
    width: 120px;
    background-color: #f2f3f4;
    color: #333;
    border: none;
    padding: 10px;
    border-radius: 5px;
  }

  .option_container select:hover {
    background-color: #cccccc;
  }

  .option_container button {
    background-color: #0056b3;
    color: #f2f3f4;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }

  .option_container button:hover {
    background-color: #005a99;
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

  .input_buttons {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    width: 100%;
    margin-top: 20px;
  }

  .save_button {
    background-color: #0056b3;
    color: #fff;
    width: 120px;
    height: 40px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .save_button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
