<script>
  import { setLicenseUpdate } from "../../../services/page6/serviceArticle";
    import { errorAlert, successAlert } from "../../../shared/sweetAlert";

  let textareaContent = "";
  let inspectionInformation = null;
  let error = null;

  async function handleFileUpload(event) {
    inspectionInformation = event.target.files[0];

    if (!inspectionInformation) {
      await errorAlert("라이센스 파일을 선택하세요!");
      return;
    }

    const formData = new FormData();
    formData.append("file", inspectionInformation);

    console.log("FormData tarkibi:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1].name || pair[1]}`);
    }

    try {
      const response = await setLicenseUpdate(formData);
      if (response.RESULT === "OK") {
        await successAlert(response.CODE);
      } else {
        await errorAlert(response.CODE);
      }
    } catch (err) {
      console.error("Fayl yuklashda xatolik:", err.message);
      await errorAlert(err.message || "Fayl yuklashda xatolik yuz berdi");
    }
  }

  async function submitNewSystemCommand() {
    const formData = new FormData();
    formData.append("textareaContent", textareaContent);

    try {
      const response = await setLicenseUpdate(formData);
      if (response.RESULT === "OK") {
        await successAlert(response.CODE);
      } else {
        await errorAlert(response.CODE);
      }
    } catch (err) {
      error = err.message;
      await errorAlert(error);
    }
  }
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
            accept=""
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
    width: 180px;
  }

  .btn {
    padding: 8px 16px;
  }
</style>
