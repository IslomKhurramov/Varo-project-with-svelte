<script>
  export let toggleView;
  export let searchFilters;
  export let search;
</script>

<div class="header_option">
  <button class="toggle_button">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span class="arrow" on:click={toggleView}>&#9662;</span>
  </button>
  <form class="form_select">
    <div class="select_container">
      <select
        name="approval_status"
        id="approval_status"
        class="select_input"
        bind:value={search.plan_index}
      >
        <option value="" disabled selected hidden>자산명</option>
        {#if searchFilters?.plans && searchFilters?.plans?.length !== 0}
          {#each searchFilters?.plans as plan}
            <option class="group_option" value={plan.ccp_index}
              >{plan.ccp_title}</option
            >
          {/each}
        {/if}
      </select>
    </div>
    <div class="select_container">
      <select
        name="asset_group"
        id="asset_group"
        bind:value={search.order_user}
        class="select_input"
      >
        <option value="" disabled selected hidden>수행자</option>
        {#if searchFilters?.users && searchFilters?.users?.length !== 0}
          {#each searchFilters?.users as user}
            <option value={user.user_name}>{user.user_name}</option>
          {/each}
        {/if}
      </select>
    </div>
    <div class="select_container">
      <div class="select_input">
        <div class="date_container">
          <div>날짜:</div>
          <input type="date" bind:value={search.search_start_date} />~
          <input type="date" bind:value={search.search_end_date} />
        </div>
      </div>
    </div>
  </form>
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Arial", sans-serif;
  }

  .header_option {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  /* Form and Select Styles */
  .form_select {
    display: flex;
    gap: 15px;
  }

  .select_container {
    display: flex;
    flex-direction: column;
  }

  .select_input {
    color: #333;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    background-color: #ffffff;
    transition:
      border-color 0.3s ease,
      box-shadow 0.3s ease;
  }

  .select_input:hover {
    border-color: #007acc;
  }

  .select_input:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 122, 204, 0.5);
    border-color: #007acc;
  }

  /* Dropdown Arrow */
  .arrow {
    color: #ffffff;
  }

  /* Toggle Button */
  .toggle_button {
    background-color: #0056b3;
    color: #ffffff;
    padding: 10px;
    border: none;
    height: 30px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  .toggle_button:hover {
    background-color: #005fa3;
  }

  .group_option {
    height: 120px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .date_container {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
  }
</style>
