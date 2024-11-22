<script>
  import { targetSystemList } from "../../services/page2/asset.store"; // Ensure this is valid
  import { setAssetTargetRegister } from "../../services/page2/assetService";
  import { successAlert } from "../../shared/sweetAlert";
  import { allAssetList } from "../../services/page2/asset.store"; // Assuming this is valid

  export let cancel;
  export let selectedAsset;
  let isDbmsChecked = false;
  let isNetworkChecked = false;
  let isWebChecked = false;
  let isWasChecked = false;
  let modifiedTargets = {};

  let targets = {
    UNIX: "",
    WINDOWS: "",
    DBMS: "",
    PC: "",
    NETWORK: "",
    WEB: "",
    WAS: "",
    SECURITY: "",
    CLOUD: "",
  };

  let dbmsValues = {
    pw: "",
    ip: "",
    port: "",
    userid: "",
    dbname: "",
    usermode: "",
  };
  let network = { userid: "", userpw: "", ipaddress: "", port: "" };
  let web = { webApplicatioName: "", installedPath: "" };
  let was = { webApplicatioName: "", installedPath: "" };

  let targetData = {
    asset_uuid: selectedAsset.ass_uuid || "",
    targets: [],
  };

  // Reactive statement to populate targets based on selectedAsset
  $: if (selectedAsset) {
    if (
      selectedAsset.assessment_target_system &&
      selectedAsset.assessment_target_system.length > 0
    ) {
      // Populate targets from selectedAsset if available
      targetData.targets = $targetSystemList.map((target) => {
        const assetTarget =
          selectedAsset.targets?.find((t) => t.type === target.cct_target) ||
          {};

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
    } else {
      // If assessment_target_system is empty, initialize from targetSystemList
      targetData.targets = $targetSystemList.map((target) => ({
        ...target,
        ast_buse: false, // Default checkbox state
        ip: "",
        port: "",
        dbname: "",
        username: "",
        pw: "",
        installed_path: "",
        web_name: "",
        was_name: "",
      }));
    }
  }
  /****************************************************************************/
  function handleCheckboxChange(target) {
    return function (e) {
      const isChecked = e.target.checked;

      // Update only the target being modified
      if (isChecked) {
        // Add or update the target's value in modifiedTargets when checked
        switch (target.cct_target) {
          case "UNIX":
            modifiedTargets.UNIX = isChecked ? "-t linux" : "";
            break;
          case "WINDOWS":
            modifiedTargets.WINDOWS = isChecked ? "-t windows" : "";
            break;
          case "SECURITY":
            modifiedTargets.SECURITY = isChecked ? "-t security" : "";
            break;
          case "CLOUD":
            modifiedTargets.CLOUD = isChecked ? "-t cloud" : "";
            break;
          case "DBMS":
            modifiedTargets.DBMS = isChecked
              ? `-t ${dbmsValues.applied_system} -u ${dbmsValues.usermode} -p ${dbmsValues.pw} -H ${dbmsValues.ip} -P ${dbmsValues.port} -D ${dbmsValues.dbname}`
              : "";
            isDbmsChecked = isChecked; // Toggle DBMS inputs visibility
            break;
          case "NETWORK":
            modifiedTargets.NETWORK = isChecked
              ? `-u ${network.userid} -p ${network.userpw} -H ${network.ipaddress} -P ${network.port}`
              : "";
            isNetworkChecked = isChecked; // Toggle NETWORK inputs visibility
            break;
          case "WEB":
            modifiedTargets.WEB = isChecked
              ? `-t ${web.webApplicatioName} -path ${web.installedPath}`
              : "";
            isWebChecked = isChecked; // Toggle WEB inputs visibility
            break;
          case "WAS":
            modifiedTargets.WAS = isChecked
              ? `-t ${was.webApplicatioName} -path ${was.installedPath}`
              : "";
            isWasChecked = isChecked; // Toggle WAS inputs visibility
            break;
          case "PC":
            modifiedTargets.PC = isChecked ? "-t pc" : "";
            break;
        }
      } else {
        // If unchecked, set its value to an empty string in modifiedTargets
        modifiedTargets[target.cct_target] = "";
        if (target.cct_target === "DBMS") isDbmsChecked = false;
        if (target.cct_target === "NETWORK") isNetworkChecked = false;
        if (target.cct_target === "WEB") isWebChecked = false;
        if (target.cct_target === "WAS") isWasChecked = false;
      }
    };
  }

  function prepareTargetData() {
    // We only want to send modifiedTargets (either checked or unchecked)
    return Object.entries(modifiedTargets)
      .filter(([_, value]) => value !== undefined) // Include only those that were modified
      .map(([key, value]) => {
        const targetData = {};
        targetData[key] = value; // Assign the value (either the checked data or "")
        return targetData;
      });
  }
  /*******************************************************************************/

  /*************************************************/
  /*************************************************/
  $: if (Object.keys(selectedAsset).length > 0 && !targetData.targets) {
    targetData = { ...selectedAsset };
  }

  /*************************************************/
  async function submit() {
    if (!selectedAsset.ass_uuid) {
      alert("Asset UUID is missing");
      return;
    }
    const preparedTargets = prepareTargetData();

    const payload = {
      asset_uuid: selectedAsset.ass_uuid,
      targets: preparedTargets,
    };

    try {
      const response = await setAssetTargetRegister(payload);

      if (response.RESULT === "OK") {
        successAlert("성공적으로 등록되었습니다");
        window.location.reload();
        cancel();
      } else {
        throw new Error(`API error: ${response.CODE}`);
      }
    } catch (err) {
      alert("An error occurred while submitting the form: " + err.message);
    }
  }
  /****************************************************************************/

  function isTargetChecked(cct_target) {
    // Check if the target is present in modifiedTargets
    if (modifiedTargets[cct_target]) {
      return !!modifiedTargets[cct_target];
    }
    // Fall back to checking initial state from selectedAsset
    return selectedAsset.assessment_target_system?.some(
      (target) => target[cct_target],
    );
  }
</script>

<!-- Form to display and edit the selected asset and its targets -->
<form on:submit|preventDefault={submit} class="container">
  <div class="bg-gray">
    <article class="formWrap xs font13">
      <div class="formControlWrap">
        <div class="formControl">
          <label>운영제체</label>
          <div class="input-like">
            {#if selectedAsset.assessment_target_system && Array.isArray(selectedAsset.assessment_target_system)}
              {#each selectedAsset.assessment_target_system as target}
                {#if target && typeof target === "object"}
                  {#each Object.entries(target) as [key, value]}
                    {#if value}
                      <span class="data-item">{key}</span>
                    {/if}
                  {/each}
                {/if}
              {/each}
            {/if}
          </div>
        </div>
      </div>

      <div class="formControlWrap">
        <div class="formControl">
          <label>자산명</label>
          <div class="input-like">
            <p>{selectedAsset.ast_hostname}</p>
          </div>
        </div>
      </div>
      <div class="formControlWrap">
        <div class="formControl">
          <label>아이피주소</label>
          <div class="input-like">
            <p>{selectedAsset.ast_ipaddr}</p>
          </div>
        </div>
      </div>
      <div class="formControlWrap">
        <div class="formControl">
          <label>승인여부</label>
          <div class="input-like">
            {#if selectedAsset.ast_approve_status === 1}
              <p>승인</p>
            {:else}
              <p>미승인</p>
            {/if}
          </div>
        </div>
      </div>

      <!-- Editable target systems from selectedAsset -->
      {#each targetData.targets as target}
        <div class="checkbox-group">
          <input
            type="checkbox"
            checked={isTargetChecked(target.cct_target)}
            on:change={handleCheckboxChange(target)}
          />
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label>{target.cct_target}</label>
        </div>
        {#if target.cct_target === "NETWORK" && isNetworkChecked}
          <div class="input-group">
            <!-- svelte-ignore a11y-label-has-associated-control -->

            <label>IP</label>
            <input type="text" bind:value={network.ipaddress} />
          </div>
          <div class="input-group">
            <!-- svelte-ignore a11y-label-has-associated-control -->

            <label>PORT</label>
            <input type="text" bind:value={network.port} />
          </div>
          <div class="input-group">
            <!-- svelte-ignore a11y-label-has-associated-control -->

            <label>USERID</label>
            <input type="text" bind:value={network.userid} />
          </div>
          <div class="input-group">
            <!-- svelte-ignore a11y-label-has-associated-control -->

            <label>USERPW</label>
            <input type="text" bind:value={network.userpw} />
          </div>
        {/if}

        {#if target.cct_target === "DBMS" && isDbmsChecked}
          <div class="input-group">
            <!-- svelte-ignore a11y-label-has-associated-control -->

            <label>DBNAME</label>
            <input type="text" bind:value={dbmsValues.dbname} />
          </div>
          <div class="input-group">
            <!-- svelte-ignore a11y-label-has-associated-control -->

            <label>USERMODE</label>
            <input type="text" bind:value={dbmsValues.usermode} />
          </div>
          <div class="input-group">
            <!-- svelte-ignore a11y-label-has-associated-control -->

            <label>PW</label>
            <input type="text" bind:value={dbmsValues.pw} />
          </div>
          <div class="input-group">
            <!-- svelte-ignore a11y-label-has-associated-control -->

            <label>IP</label>
            <input type="text" bind:value={dbmsValues.ip} />
          </div>
          <div class="input-group">
            <!-- svelte-ignore a11y-label-has-associated-control -->

            <label>PORT</label>
            <input type="text" bind:value={dbmsValues.port} />
          </div>
        {/if}

        {#if (target.cct_target === "WEB" || target.cct_target === "WAS") && (target.cct_target === "WEB" ? isWebChecked : isWasChecked)}
          {#if target.cct_target === "WEB"}
            <div class="input-group">
              <!-- svelte-ignore a11y-label-has-associated-control -->

              <label>APP NAME</label>
              <input type="text" bind:value={web.webApplicatioName} />
            </div>
            <div class="input-group">
              <!-- svelte-ignore a11y-label-has-associated-control -->

              <label>INSTALLED PATH</label>
              <input type="text" bind:value={web.installedPath} />
            </div>
          {/if}
          {#if target.cct_target === "WAS"}
            <div class="input-group">
              <!-- svelte-ignore a11y-label-has-associated-control -->

              <label>APP NAME</label>
              <input type="text" bind:value={was.webApplicatioName} />
            </div>
            <div class="input-group">
              <!-- svelte-ignore a11y-label-has-associated-control -->

              <label>INSTALLED PATH</label>
              <input type="text" bind:value={was.installedPath} />
            </div>
          {/if}
        {/if}
      {/each}
    </article>
    <div class="button-group">
      <button class="btn submit" type="submit">저장하기</button>
      <button class="btn cancel" type="button" on:click|preventDefault={cancel}>
        취소
      </button>
    </div>
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
    z-index: 99999;
  }

  .header_group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .input-like {
    display: inline-block; /* Keeps the element inline */
    border: 1px solid #ccc; /* Border similar to an input */
    border-radius: 4px; /* Rounded corners */
    padding: 10px; /* Padding inside the element */
    width: 100%; /* Full width, or adjust as needed */
    max-width: 400px; /* Optional max width */
    background-color: #ffffff; /* White background */
    color: #333; /* Text color */
    font-size: 16px; /* Font size */
    cursor: default; /* Cursor changes to default */
    user-select: none; /* Prevent text selection */
    overflow: hidden; /* Hide overflow */
  }

  .data-item {
    display: inline-block; /* Ensure items are in-line */
    white-space: nowrap; /* Prevent text wrapping */
    overflow: hidden; /* Hide overflowed content */
    text-overflow: ellipsis; /* Add ellipsis for overflow */
    margin-right: 10px; /* Space between items */
    font-size: 13px;
  }

  .input-like p {
    margin: 0;
    font-size: 13px; /* Prevent text wrapping */
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
