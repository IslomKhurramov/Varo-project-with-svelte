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

export function toggleMenu(e) {
  console.log("toggleMenu:", e);
  const element = e.currentTarget;
  if (element.classList.contains("active")) {
    element.classList.remove("active");
  } else {
    element.classList.add("active");
  }
}

export function toggleTooltip(event) {
  const button = event.currentTarget;
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
