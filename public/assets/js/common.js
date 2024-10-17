window.onload = function () {
  document.querySelectorAll(".circle").forEach((circle) => {
    const percent = parseInt(circle.getAttribute("data-percent"));
    const setoffset = parseInt(circle.getAttribute("data-offset"));
    const progressCircle = circle.querySelector(".progress");
    const fixColor = circle.getAttribute("data-color");
    let color;

    // 퍼센트 값에 따른 색상 설정
    if (percent <= 33) {
      color = "#FF1500"; // 빨간색
    } else if (percent <= 66) {
      color = "#4AC93F"; // 초록색
    } else {
      color = "#0067FF"; // 파란색
    }
    if (fixColor === "primary") {
      color = "#0067FF"; // 파란색
    }

    // 색상 및 게이지 업데이트
    const offset = setoffset - (setoffset * percent) / 100; // 게이지 채워지는 부분 계산
    progressCircle.style.stroke = color;
    progressCircle.style.strokeDashoffset = offset;
  });

  /** 파일 업로드 */
  const fileInput = document.getElementById("file-upload");
  const uploadBtn = document.getElementById("upload-btn");

  // Upload 버튼 클릭 시 파일 선택 창 열기
  uploadBtn.addEventListener("click", function () {
    fileInput.click(); // 파일 선택 창 열기
  });

  // 파일 선택 시 선택된 파일명을 엑셀파일업로드 라벨에 표시
  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
      document.querySelector(".file-label").textContent =
        fileInput.files[0].name;
    }
  });
};

export function toggleNav(e) {
  const menu = document.querySelector(".headerWrap");
  if (menu.classList.contains("on")) {
    menu.classList.remove("on");
    menu.classList.add("off");
  } else {
    menu.classList.remove("off");
    menu.classList.add("on");
  }
}

function modalOpen(type) {
  const modal = document.querySelector(".modalWrap." + type);
  const sidebar = document.querySelector(".sideMenu");
  // console.log(modal);
  if (modal.classList.contains("active")) {
    modal.classList.remove("active");
    if (type === "newgroup") {
      sidebar.classList.remove(type);
    }
  } else {
    if (type === "newgroup") {
      sidebar.classList.add(type);
    }
    modal.classList.add("active");
  }
}

export function toggleMenu(e) {
  console.log("toggleMenu:", e);
  const element = e.currentTarget;
  if (element.classList.contains("active")) {
    element.classList.remove("active");
  } else {
    element.classList.add("active");
  }
}

function toggleTooltip(button) {
  const tooltip = button.nextElementSibling;
  console.log(button);
  console.log(tooltip);

  // 툴팁이 없는 경우 오류 방지
  if (!tooltip) {
    console.error("Tooltip element not found.");
    return;
  }

  const allTooltips = document.querySelectorAll(".tooltip-modal");

  // 다른 모든 툴팁 숨기기
  allTooltips.forEach((tip) => {
    if (tip !== tooltip) {
      tip.style.display = "none";
    }
  });

  // 클릭한 툴팁 토글
  if (tooltip.style.display === "none" || tooltip.style.display === "") {
    tooltip.style.display = "block";

    document.addEventListener("click", function handleOutsideClick(event) {
      if (!tooltip.contains(event.target) && !button.contains(event.target)) {
        tooltip.style.display = "none";
        document.removeEventListener("click", handleOutsideClick);
      }
    });
  } else {
    tooltip.style.display = "none";
  }
}

function showContentByType() {
  const selectedValue = document.getElementById("commandSelect").value;
  const formControls = document.querySelectorAll(".formControlWrap.type");

  formControls.forEach((control) => {
    if (control.getAttribute("type") === selectedValue) {
      control.style.display = "flex";
    } else {
      control.style.display = "none";
    }
  });
}
