<script>
  let approved = true;
  let osUnix = true;
  let osWindows = false;
  let dbmsSelected = true;
  let webChecked = false;
  let wasChecked = false;
</script>

<div class="container">
  <div class="header">
    <span>등록승인</span>
    <select bind:value="{approved}">
      <option value="{true}">등록승인</option>
      <option value="{false}">등록미승인</option>
    </select>
  </div>

  <div class="checkbox-group">
    <input type="checkbox" bind:checked="{osUnix}" />
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>UNIX</label>
  </div>

  <div class="checkbox-group">
    <input type="checkbox" bind:checked="{osWindows}" />
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>WINDOWS</label>
  </div>

  <div class="checkbox-group">
    <input type="checkbox" bind:checked="{dbmsSelected}" />
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>DBMS</label>
  </div>

  {#if dbmsSelected}
    <div class="input-group">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>DBMS</label>
      <input type="text" placeholder="MYSQL/ORACLE" />
    </div>
    <div class="input-group">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>PW</label>
      <input type="text" />
    </div>
    <div class="input-group">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>IP</label>
      <input type="text" />
    </div>
    <div class="input-group">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>PORT</label>
      <input type="text" />
    </div>
    <div class="input-group">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>DBNAME</label>
      <input type="text" />
    </div>
  {/if}

  <div class="checkbox-group">
    <input type="checkbox" bind:checked="{webChecked}" />
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>WEB</label>
  </div>

  <div class="checkbox-group">
    <input type="checkbox" bind:checked="{wasChecked}" />
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>WAS</label>
  </div>
</div>

<style>
  .container {
    background-color: #f8f9fa; /* Soft beige background */
    padding: 20px;
    width: 320px;
    border-radius: 10px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background-color: #1f4c9e; /* Deep blue background */
    color: white;
    border-radius: 8px;
    font-weight: bold;
  }

  .checkbox-group {
    margin-top: 15px;
    display: flex;
    align-items: center;
  }

  .checkbox-group input[type="checkbox"] {
    margin-right: 12px;
    accent-color: #1f4c9e; /* Matches the deep blue */
  }

  .checkbox-group label {
    font-size: 15px;
    color: #333; /* Dark gray for better contrast */
  }

  .input-group {
    display: flex;
    margin-top: 10px;
    align-items: center;
  }

  .input-group label {
    width: 60px;
    font-size: 15px;
    color: #333;
  }

  .input-group input[type="text"] {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
    color: #333;
    font-size: 14px;
  }

  select {
    padding: 6px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 14px;
    background-color: #fff;
    color: #333;
  }
</style>
