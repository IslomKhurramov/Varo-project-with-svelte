<script>
  import {
    assetDeatilInfo,
    targetSystemList,
  } from "../../services/page2/asset.store";

  export let cancel;
  export let selectedAsset;

  let osUnix = false;
  let osWindows = false;
  let dbmsSelected = false;
  let webChecked = false;
  let wasChecked = false;
  function check() {
    console.log("selected asset", selectedAsset);
  }
</script>

<div class="container">
  <div class="header_group">
    <div class="header">
      <span on:click={check}>운영제체</span>
      <div class="select">
        <p>
          {selectedAsset.assessment_target_system}
        </p>
      </div>
    </div>
    <div class="header">
      <span>자산명</span>
      <div class="select">
        <p>
          {selectedAsset.ast_hostname}
        </p>
      </div>
    </div>
    <div class="header">
      <span>아이피주소</span>
      <div class="select">
        <p>
          {selectedAsset.ast_ipaddr}
        </p>
      </div>
    </div>
    <div class="header">
      <span>승인여부</span>
      <select class="select" bind:value={selectedAsset.ast_approve_status}>
        <option value={1}>등록승인</option>
        <option value={0}>등록미승인</option>
      </select>
    </div>
  </div>

  <div class="checkbox-group">
    <input type="checkbox" bind:checked={osUnix} id="osUnix" />
    <label for="osUnix">UNIX</label>
  </div>
  {#if osUnix}
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
    <input type="checkbox" bind:checked={osWindows} id="osWindows" />
    <label for="osWindows">WINDOWS</label>
  </div>
  {#if osWindows}
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
    <input type="checkbox" bind:checked={dbmsSelected} id="dbmsSelected" />
    <label for="dbmsSelected">DBMS</label>
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
    <input type="checkbox" bind:checked={webChecked} id="webChecked" />
    <label for="webChecked">WEB</label>
  </div>
  {#if webChecked}
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
    <input type="checkbox" bind:checked={wasChecked} id="wasChecked" />
    <label for="wasChecked">WAS</label>
  </div>
  {#if wasChecked}
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
  <div class="button-group">
    <button class="btn submit">Submit</button>
    <button class="btn cancel" on:click|preventDefault={cancel}>Cancel</button>
  </div>
</div>

<style>
  .container {
    background-color: #ffffff; /* Clean white background */
    padding: 15px; /* Reduced padding */
    width: 300px; /* Smaller width */
    border-radius: 10px; /* Slightly smaller radius */
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }

  .header_group {
    display: flex;
    flex-direction: column;
    gap: 4px; /* Reduced gap */
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px; /* Reduced padding */
    background-color: #0056b3; /* Bootstrap primary color */
    color: white;
    border-radius: 6px; /* Smaller radius */
    font-weight: bold;
    font-size: 12px; /* Smaller font size */
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }

  .header span {
    font-size: 12px; /* Smaller font size */
  }

  .checkbox-group {
    margin-top: 4px; /* Reduced margin */
    display: flex;
    align-items: center;
    font-size: 12px; /* Smaller font size */
  }

  .checkbox-group input[type="checkbox"] {
    margin-right: 8px; /* Reduced margin */
    accent-color: #0056b3; /* Bootstrap primary color */
  }

  .input-group {
    display: flex;
    margin-top: 4px; /* Reduced margin */
    align-items: center;
  }

  .input-group label {
    width: 60px; /* Reduced width */
    font-size: 12px; /* Smaller font size */
    color: #333;
  }

  .input-group input[type="text"] {
    flex: 1;
    padding: 6px; /* Reduced padding */
    border: 1px solid #ccc;
    border-radius: 6px; /* Smaller radius */
    background-color: #f8f9fa; /* Light gray background */
    color: #333;
    font-size: 12px; /* Smaller font size */
    transition: border-color 0.3s;
  }

  .input-group input[type="text"]:focus {
    border-color: #0056b3; /* Highlight border on focus */
    outline: none;
  }

  .select {
    border-radius: 6px; /* Smaller radius */
    border: 1px solid #ccc;
    font-size: 12px; /* Smaller font size */
    width: 160px; /* Reduced width */
    height: 28px; /* Reduced height */
    background-color: #fff;
    color: #333;
    text-align: center;
  }

  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 15px; /* Reduced margin */
  }

  .btn {
    padding: 8px 12px; /* Reduced padding */
    border: none;
    border-radius: 6px; /* Smaller radius */
    color: white;
    font-size: 12px; /* Smaller font size */
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .btn.submit {
    background-color: #28a745; /* Bootstrap success color */
  }

  .btn.cancel {
    background-color: #dc3545; /* Bootstrap danger color */
  }

  .btn.submit:hover {
    background-color: #218838; /* Darken on hover */
  }

  .btn.cancel:hover {
    background-color: #c82333; /* Darken on hover */
  }
</style>
