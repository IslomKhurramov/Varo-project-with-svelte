<script>
  let textareaContent = ``;
  const sampleClick = async () => {
    try {
      await getPlanCommandExcel(selectedCheckList);
    } catch (error) {}
  };

  const handleFileUpload = (event) => {
    inspectionInformation = event.target.files[0];
  };

  const submitNewSystemCommand = async () => {
    try {
      if (assetInsertData.start_date)
        assetInsertData.start_date = moment(assetInsertData.start_date).format(
          "YYYY-MM-DD h:mm:ss",
        );
      if (assetInsertData.end_date)
        assetInsertData.end_date = moment(assetInsertData.end_date).format(
          "YYYY-MM-DD h:mm:ss",
        );

      const response = await setNewSystemCommand(assetInsertData);

      await successAlert(response.CODE);

      navigate(window.location?.pathname == "/" ? "/page6" : "/");
    } catch (error) {
      errorAlert(error?.message);
    }
  };
</script>

<section class="container">
  <article class="contentArea">
    <div class="formControl noLabel">
      <textarea bind:value={textareaContent} rows="10" style="resize: none;"
      ></textarea>
    </div>
    <div class="formControlWrap">
      <div class="formControl">
        <div class="upload-section">
          <label for="file-upload" class="file-label">
            <span style="font-size: 14px;"> 라이센스 업데이트</span>
            <img src="./assets/images/icon/download.svg" style="" />
          </label>
          <input
            type="file"
            id="file-upload"
            accept=".xls,.xlsx"
            class="file-input"
            on:change={(event) => handleFileUpload(event)}
          />
          <button id="upload-btn" class="upload-btn btn btnPrimary">
            라이선스 파일 등록 (File Upload)
          </button>
          <button
            type="button"
            class="btn btnBlue btnSave"
            on:click={submitNewSystemCommand}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  </article>
</section>

<style>
  * {
    font-size: 16px;
    box-sizing: border-box;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  .contentArea {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }

  textarea {
    width: 100%;
    height: 120px;
    padding: 10px;
    font-size: 18px;
    border: 1px solid #ccc;
    color: #333;
    resize: none;
  }

  .formControlWrap {
    padding: 20px;
  }

  .upload-section {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .file-label {
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    line-height: 1.5;
    justify-content: space-between;
    width: 180px; /* Kenglikni kengaytirdik */
  }

  .btn {
    padding: 8px 16px;
  }
</style>
