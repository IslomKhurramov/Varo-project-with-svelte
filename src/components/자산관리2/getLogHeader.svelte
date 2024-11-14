<script>
  export let searchFilters;
  export let search;
  export let searchDataHandler;
</script>

<section class="filterWrap" style="margin-bottom: 0px;">
  <div>
    <select
      id="project"
      bind:value={search.plan_index}
      on:change={searchDataHandler}
    >
      <option value="" selected disabled>프로젝트명</option>
      {#if searchFilters?.plans && searchFilters?.plans?.length !== 0}
        {#each searchFilters?.plans as plan}
          <option value={plan.ccp_index}>{plan.ccp_title}</option>
        {/each}
      {/if}
    </select>
    <select
      id="project"
      bind:value={search.asset_name}
      on:change={searchDataHandler}
    >
      <option value="" selected disabled>자산명</option>

      <option>자산명</option>
      <option>Plan</option>
    </select>
    <select
      id="target"
      bind:value={search.order_user}
      on:change={searchDataHandler}
    >
      <option value="" selected>수행자</option>
      {#if searchFilters?.users && searchFilters?.users?.length !== 0}
        {#each searchFilters?.users as user}
          <option value={user.user_name}>{user.user_name}</option>
        {/each}
      {/if}
    </select>
    <div class="dateWrap">
      <div class="date">
        <input
          type="date"
          class="datepicker"
          placeholder="시작일시"
          bind:value={search.search_start_date}
          on:change={searchDataHandler}
        />
      </div>
      <img src="./assets/images/icon/dash.svg" />
      <div class="date">
        <input
          type="date"
          class="datepicker"
          placeholder="종료일시"
          bind:value={search.search_end_date}
          on:change={searchDataHandler}
        />
      </div>
    </div>
    <!-- <button type="button" class="btn btnPrimary"
      ><img src="./assets/images/icon/search.svg" />조회</button
    > -->
  </div>
</section>

<style>
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
