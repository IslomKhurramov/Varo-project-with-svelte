<script>
  import { targetSystemList } from "../../services/page2/asset.store"; // Ensure this is valid
  import { setAssetTargetRegister } from "../../services/page2/assetService";
  import { successAlert } from "../../shared/sweetAlert";
  import { allAssetList } from "../../services/page2/asset.store"; // Assuming this is valid

  export let cancel;
  export let selectedAsset;

  let targets = {
    UNIX: "",
    WINDOWS: "",
    DBMS: "",
    PC: "",
    NETWORK: "",
    WEB: "",
    WAS: "",
  };

  let dbmsValues = {
    pw: "",
    ip: "",
    port: "",
  };

  let targetData = {
    asset_uuid: selectedAsset.ass_uuid || "",
    targets: [],
  };

  // Prepopulate form based on selectedAsset and ast_buse
  $: if (selectedAsset && selectedAsset.assessment_target_system) {
    targetData.targets = $targetSystemList.map((target) => {
      const assetTarget =
        selectedAsset.targets?.find((t) => t.type === target.cct_target) || {};

      return {
        ...target,
        ast_buse: assetTarget.ast_buse || false, // Reflect ast_buse in checkbox
        ip: assetTarget.ip || "",
        port: assetTarget.port || "",
        dbname: assetTarget.dbname || "",
        username: assetTarget.username || "",
        pw: assetTarget.pw || "",
        installed_path: assetTarget.installed_path || "",
        web_name: assetTarget.web_name || "",
        was_name: assetTarget.was_name || "",
      };
    });
  }
  function check() {
    console.log("Targetlist", $targetSystemList);
  }
  /*************************************************/
  /*************************************************/
  $: if (Object.keys(selectedAsset).length > 0 && !targetData.targets) {
    targetData = { ...selectedAsset };
    console.log("Loaded asset details:", selectedAsset);
  }
  /*************************************************/
  async function submit() {
    if (!selectedAsset.ass_uuid) {
      alert("Asset UUID is missing");
    }

    targets.DBMS = `t dbms_name –u user –p ${dbmsValues.pw} –H ${dbmsValues.ip} –P ${dbmsValues.port} –D dbname –M mode`;

    console.log("sendData:", targets);

    // try {
    //   const response = await setAssetTargetRegister(
    //     selectedAsset.ass_uuid,
    //     targetData,
    //   );
    //   if (response.RESULT === "OK") {
    //     successAlert("registered successfully");
    //     console.log("RESPONSEDATA", response);
    //   } else {
    //     throw new Error();
    //   }
    // } catch (err) {
    //   console.error("Submission failed:", err);
    //   alert("An error occurred while submitting the form: " + err.message);
    // }
  }

  $: {
    console.log("dbmsValues:", dbmsValues);
  }
</script>

<!-- Form to display and edit the selected asset and its targets -->
<form on:submit|preventDefault={submit} class="container">
  <div class="header_group">
    <div class="header">
      <span on:click={check}>운영제체</span>
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
  {#each targetData.targets as target, i}
    <div class="checkbox-group">
      <input
        type="checkbox"
        on:change={(e) => {
          targets.UNIX = e.target.checked ? "-t linux" : "";
        }}
      />
      <label>{target.cct_target}</label>
    </div>

    <!-- {#if target.selected} -->
    {#if target.cct_target === "NETWORK"}
      <div class="input-group">
        <label>IP</label>
        <input type="text" />
      </div>
      <div class="input-group">
        <label>PORT</label>
        <input type="text" />
      </div>
      <div class="input-group">
        <label>USERID</label>
        <input type="text" />
      </div>
      <div class="input-group">
        <label>USERPW</label>
        <input type="text" />
      </div>
      <!-- {/if} -->

      <!-- {#if target.cct_target === "DBMS"} -->
      <div class="input-group">
        <label>DBNAME</label>
        <input type="text" />
      </div>
      <div class="input-group">
        <label>USERMODE</label>
        <input type="text" />
      </div>
      <div class="input-group">
        <label>PW</label>
        <input type="text" bind:value={dbmsValues.pw} />
      </div>
      <div class="input-group">
        <label>IP</label>
        <input type="text" bind:value={dbmsValues.ip} />
      </div>
      <div class="input-group">
        <label>PORT</label>
        <input type="text" bind:value={dbmsValues.port} />
      </div>
      <!-- {/if} -->

      <!-- {#if target.cct_target === "WEB" || target.cct_target === "WAS"} -->
      <div class="input-group">
        <label>APP NAME</label>
        {#if target.cct_target === "WEB"}
          <input type="text" />
        {/if}
        {#if target.cct_target === "WAS"}
          <input type="text" />
        {/if}
      </div>
      <div class="input-group">
        <label>INSTALLED PATH</label>
        <input type="text" />
      </div>
      <!-- {/if} -->
    {/if}
  {/each}

  <div class="button-group">
    <button class="btn submit" type="submit">Submit</button>
    <button class="btn cancel" type="button" on:click|preventDefault={cancel}>
      Cancel
    </button>
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
