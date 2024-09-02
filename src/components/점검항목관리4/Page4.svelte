<script>
  import AddChecklistButton4 from "./AddChecklistButton4.svelte";
  import EditItem from "./EditItem.svelte";
  import ItemPage from "./ItemPage.svelte";

  let currentView = "default";
  let currentPage = null;
  let activeMenu = null;
  let assets = ["주요정보통신기반시설 (2021) (520개)"];
  let editingIndex = null;

  const addProject = () => {
    const newProjectNumber = assets.length + 1;
    assets = [...assets, `자산그룹${newProjectNumber}`];
    editingIndex = assets.length - 1;
  };

  const selectPage = (page, menu) => {
    currentPage = page;
    activeMenu = menu;
  };

  function toggleView() {
    currentView = currentView === "default" ? "newView" : "default";
    currentPage = null;
  }

  function finishEditing(index, event) {
    editingIndex = null;
    assets[index] = event.target.value || assets[index];
  }

  function handleKeydown(event, index) {
    if (event.key === "Enter") {
      finishEditing(index, event);
    }
  }
</script>

<main class="container">
  <div class="container_aside">
    <aside>
      <div class="add_delete_container">
        <button class="menu_button add_button" on:click="{addProject}"
          >항목추가</button
        >
        <button class="menu_button delete_button">항목삭제</button>
      </div>

      {#each assets as asset, index}
        <div class="chasanGroup_button">
          <a
            href="#"
            on:click="{() => selectPage(ItemPage, asset)}"
            class="{activeMenu === asset ? 'active' : ''}"
          >
            <i class="fa fa-user-o" aria-hidden="true"></i>
            {#if editingIndex === index}
              <input
                type="text"
                value="{asset}"
                on:blur="{(event) => finishEditing(index, event)}"
                on:keydown="{(event) => handleKeydown(event, index)}"
                autofocus
              />
            {:else}
              {asset}
            {/if}
          </a>
          <button
            class="asset_button"
            style="width: 112px;"
            on:click="{() => selectPage(EditItem, '항목편집')}">항목편집</button
          >
        </div>
      {/each}
    </aside>
  </div>
  <div class="right_menu">
    <header class="header">
      <div class="header_option">
        <button on:click="{toggleView}" class="toggle_button">
          <span class="arrow">&#9662;</span>
        </button>
        <form action="/action_page.php" class="form_select">
          <div class="select_container">
            <select
              name="approval_status"
              id="approval_status"
              class="select_input"
            >
              <option value="pending">점검그룹</option>
              <option value="approved">운영체제</option>
              <option value="rejected">에이전트여부</option>
              <option value="rejected">등록승인여부</option>
            </select>
          </div>
          <div class="select_container">
            <select name="asset_group" id="asset_group" class="select_input">
              <option value="network">점검대상</option>
              <option value="endpoint">Endpoint Security</option>
              <option value="cloud">Cloud Security</option>
            </select>
          </div>
          <div class="select_container">
            <select
              name="operating_system"
              id="operating_system"
              class="select_input"
            >
              <option value="windows">점검항목</option>
              <option value="linux">Linux</option>
              <option value="macos">macOS</option>
            </select>
          </div>
          <div class="select_container">
            <select name="agent_status" id="agent_status" class="select_input">
              <option value="active">위험도</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </form>
      </div>
      <div class="header_button">
        <p>자산명</p>
        <p>엑셀다운로드</p>
      </div>
    </header>

    <div class="second_line">
      <button>전체선택</button>
      <button>선택해제</button>
      <button>선택항목저장</button>
      <button on:click="{() => selectPage(AddChecklistButton4, '항목편집')}"
        >점검항목추가</button
      >
    </div>

    <div class="swiper_container">
      {#if currentPage}
        <svelte:component this="{currentPage}" />
      {/if}
    </div>
  </div>
</main>

<style>
  /* Container and Layout Styles */
  .container_aside {
    min-height: 100vh;
    background-color: #34495e;
    padding: 20px;
    width: 20%;
  }

  .container {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .right_menu {
    width: 80%;
    min-height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: #ecf0f1;
    padding: 20px;
    box-sizing: border-box;
  }

  /* Sidebar Styles */
  aside {
    color: #ecf0f1;
    font-size: 16px;
    padding-right: 20px;
  }

  .add_delete_container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .chasanGroup_button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  /* Sidebar Links */
  aside a {
    padding: 8px 0;

    font-size: 14px;
    color: #fff;
    display: block;

    font-weight: 600;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  aside a:hover,
  aside a.active {
    background-color: #53677a;
  }

  aside a i {
    margin-right: 10px;
  }

  /* Buttons */
  .menu_button,
  .asset_button {
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    padding: 10px 15px;
    transition:
      background-color 0.3s ease,
      box-shadow 0.3s ease;
    background-color: #2c3e50;
    color: #ecf0f1;
  }

  .add_button {
    background-color: #2980b9;
  }

  .delete_button {
    background-color: #e74c3c;
  }
  .add_button:hover {
    background-color: #1f6391;
  }

  .delete_button:hover {
    background-color: #c0392b;
  }
  .menu_button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .asset_button {
    background-color: #1abc9c;
    padding: 8px 12px;
    margin-left: 10px;
  }
  .asset_button:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  /* Header Styles */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .header_option {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .header_button {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 40px;
  }

  /* Form and Select Styles */
  .form_select {
    display: flex;
    gap: 20px;
  }

  .select_container {
    display: flex;
    flex-direction: column;
  }

  .select_input {
    color: #34495e;
    padding: 10px;
    border: 1px solid #bdc3c7;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    background-color: #ecf0f1;
    transition:
      background-color 0.3s ease,
      border-color 0.3s ease;
  }

  .select_input:hover {
    background-color: #e0e0e0;
    border-color: #3498db;
  }

  .select_input:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(52, 152, 219, 0.5);
    border-color: #3498db;
  }

  /* Header Buttons */
  .header_button p {
    color: #34495e;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .header_button p:hover {
    color: #3498db;
    text-decoration: underline;
  }

  /* Dropdown Arrow */
  .arrow {
    color: #ffffff;
  }

  /* Toggle Button */
  .toggle_button {
    background-color: #007acc;
    color: #ffffff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  .toggle_button:hover {
    background-color: #005fa3;
  }

  /* Second Line Styles */
  .second_line {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
    padding-right: 20px;
  }

  .second_line button {
    background-color: #3498db;
    color: #ffffff;
    border-radius: 5px;
    height: 36px;
    width: 140px;
    cursor: pointer;
    font-size: 14px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .second_line button:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
</style>
