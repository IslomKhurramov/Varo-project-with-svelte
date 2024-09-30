<script>
  import {
    assetDeatilInfo,
    targetSystemList,
    allAssetList,
  } from "../../services/page2/asset.store";
  import { get } from "svelte/store";
  import { setAssetTargetRegister } from "../../services/page2/assetService";
  import { successAlert } from "../../shared/sweetAlert";
  export let cancel;
  export let selectedAsset;

  let foundAsset = null;
  let targetList = [];
  let targets = [];
  /********************************************************************/
  function findSelectedAsset() {
    const assets = $allAssetList;
    foundAsset = assets.find(
      (asset) => asset.ass_uuid === selectedAsset.ass_uuid,
    );
    if (foundAsset) {
      console.log("Found asset:", foundAsset);
      // Initialize targets from selectedAsset's assessment_target_system
      targets = $targetSystemList.map((target) => ({
        ...target,
        selected: foundAsset.assessment_target_system.includes(
          target.cct_target,
        ),
        applied_system: target.applied_system || "",
        pw: target.pw || "",
        ip: target.ip || "",
        port: target.port || "",
        dbname: target.dbname || "",
        usermode: target.usermode || "",
        web_name: target.web_name || "",
        was_name: target.was_name || "",
        installed_path: target.installed_path || "",
      }));
    } else {
      console.warn(
        "Asset not found in allAssetList with UUID:",
        selectedAsset.ass_uuid,
      );
    }
  }
  $: if (selectedAsset) {
    findSelectedAsset();
  }

  $: if (selectedAsset && selectedAsset.assessment_target_system) {
    targetList = selectedAsset.assessment_target_system;
  }
  /******************************************************************/
  // Example function to format the target data based on type
  function prepareTargetData() {
    return targets
      .filter((target) => target.selected)
      .map((target) => {
        const targetData = {};
        switch (target.cct_target) {
          case "UNIX":
            targetData.UNIX = "-t linux";
            break;
          case "WINDOWS":
            targetData.WINDOWS = "-t windows";
            break;
          case "DBMS":
            targetData.DBMS = `-t ${target.applied_system} -u ${target.usermode} -p ${target.pw} -H ${target.ip} -P ${target.port} -D ${target.dbname}`;
            break;
          case "NETWORK":
            targetData.NETWORK = `-u ${target.userid} -p ${target.pw} -H ${target.ip} -P ${target.port}`;
            break;
          case "WEB":
            targetData.WEB = `-t ${target.web_name} -path ${target.installed_path}`;
            break;
          case "WAS":
            targetData.WAS = `-t ${target.was_name} -path ${target.installed_path}`;
            break;
          case "PC":
            targetData.PC = "-t pc";
            break;
          default:
            break;
        }
        return targetData;
      });
  }
  /******************************************************************/
  async function submit(event) {
    event.preventDefault();
    if (!selectedAsset || !selectedAsset.ass_uuid) {
      alert("No valid asset selected");
      return;
    }

    try {
      const preparedTargets = prepareTargetData();

      const payload = {
        asset_uuid: selectedAsset.ass_uuid,
        targets: preparedTargets,
      };

      const response = await setAssetTargetRegister(
        payload.asset_uuid,
        payload.targets,
      );

      if (response.RESULT === "OK") {
        successAlert("Target registered successfully!");
        updateSelectedAsset(); // Sync the updated asset data
        cancel(); // Close the form or reset it
      }
    } catch (error) {
      // Handle errors during submission
      console.error("Submission failed:", error);
      alert("An error occurred while submitting the form: " + error.message);
    }
  }

  /******************************************************************/
  function updateSelectedAsset() {
    const updatedAsset = $allAssetList.find(
      (asset) => asset.ass_uuid === selectedAsset.ass_uuid,
    );

    if (updatedAsset) {
      Object.assign(selectedAsset, updatedAsset);
      console.log("Updated selected asset:", selectedAsset);
    } else {
      console.warn("Asset not found in allAssetList");
    }
  }
</script>

<!-- Form to display and edit the selected asset and its targets -->
<form on:submit={submit} class="container">
  <div class="header_group">
    <div class="header">
      <span>운영제체</span>
      <div class="select">
        <p>{selectedAsset.assessment_target_system}</p>
      </div>
    </div>
    <div class="header">
      <span>자산명</span>
      <div class="select">
        <p>{selectedAsset.ast_hostname}</p>
      </div>
    </div>
    <div class="header">
      <span>아이피주소</span>
      <div class="select">
        <p>{selectedAsset.ast_ipaddr}</p>
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

  <!-- Editable target systems from selectedAsset -->
  {#each targets as target}
    <div class="checkbox-group">
      <input
        type="checkbox"
        bind:checked={target.selected}
        id={target.cct_target}
      />
      <label for={target.cct_target}>{target.cct_target}</label>
    </div>

    {#if target.selected}
      {#if target.cct_target === "DBMS"}
        <div class="input-group">
          <label>Systems</label>
          <input type="text" bind:value={target.applied_system} />
        </div>
        <div class="input-group">
          <label>PW</label>
          <input type="text" bind:value={target.pw} />
        </div>
        <div class="input-group">
          <label>IP</label>
          <input type="text" bind:value={target.ip} />
        </div>
        <div class="input-group">
          <label>PORT</label>
          <input type="text" bind:value={target.port} />
        </div>
        <div class="input-group">
          <label>DBNAME</label>
          <input type="text" bind:value={target.dbname} />
        </div>
        <div class="input-group">
          <label>USERMODE</label>
          <input type="text" bind:value={target.usermode} />
        </div>
      {/if}

      {#if target.cct_target === "NETWORK"}
        <div class="input-group">
          <label>IP</label>
          <input type="text" bind:value={target.ip} />
        </div>
        <div class="input-group">
          <label>PORT</label>
          <input type="text" bind:value={target.port} />
        </div>
        <div class="input-group">
          <label>UserID</label>
          <input type="text" bind:value={target.userid} />
        </div>
        <div class="input-group">
          <label>UserPW</label>
          <input type="text" bind:value={target.pw} />
        </div>
      {/if}

      {#if targetList.cct_target === "WEB" || targetList.cct_target === "WAS"}
        <!-- WEB and WAS inputs -->
        <div class="input-group">
          <label>{targetList.cct_target} Name</label>
          <input
            type="text"
            value={targetList.cct_target === "WEB"
              ? targetList.web_name
              : targetList.was_name}
            on:input={(e) => {
              if (targetList.cct_target === "WEB") {
                targetList.web_name = e.target.value;
              } else {
                targetList.was_name = e.target.value;
              }
            }}
          />
        </div>
        <div class="input-group">
          <label>Installed Path</label>
          <input type="text" bind:value={targetList.installed_path} />
        </div>
      {/if}
    {/if}
  {/each}

  <div class="button-group">
    <button class="btn submit" type="submit">Submit</button>
    <button class="btn cancel" type="button" on:click|preventDefault={cancel}
      >Cancel</button
    >
  </div>
</form>

<style>
  /* CSS styles for the form and inputs */
  .container {
    background-color: #ffffff;
    padding: 15px;
    width: 300px;
    border-radius: 10px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }

  .header_group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    background-color: #0056b3;
    color: white;
    border-radius: 5px;
  }

  .select {
    margin: 8px 0;
  }

  .input-group {
    display: flex;
    margin-top: 4px;
    align-items: center;
  }

  .input-group label {
    width: 60px;
    font-size: 12px;
    color: #333;
  }

  .checkbox-group {
    margin-top: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    font-size: 12px;
  }

  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  .btn {
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 12px;
    cursor: pointer;
  }

  .btn.submit {
    background-color: #28a745;
  }

  .btn.cancel {
    background-color: #dc3545;
  }

  .btn.submit:hover {
    background-color: #218838;
  }

  .btn.cancel:hover {
    background-color: #c82333;
  }
</style>
