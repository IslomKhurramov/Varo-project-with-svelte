import { navigate } from "svelte-routing";
import swal from "sweetalert";
import { userData } from "../stores/user.store";

export function confirmDelete2(dataName) {
  return swal({
    title: `현재 선택된 그룹 "${dataName}"을(를) 삭제하시겠습니까?`,
    text: "삭제 후에는 복구할 수 없습니다!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
}
export function confirmDelete() {
  return swal({
    title: "정말 삭제하시겠습니까?",
    text: "삭제 후에는 복구할 수 없습니다!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
}
export function confirmDeleteLast() {
  return swal({
    title: "정말 삭제하시겠습니까?",
    text: "삭제 후에는 복구할 수 없습니다!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
}

export function confirmSureDelete() {
  return swal({
    title: "정말 삭제하시겠습니까?",
    text: "삭제시 데이터를 복원할수 없습니다. 계속 진행하시겠습니까?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
}

// Reusable function for unactivate confirmation
export function confirmUnactivate() {
  return swal({
    title: "Are you sure?",
    text: "This will deactivate the asset. You can re-activate it later.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });
}

// Reusable function for success alerts
export function successAlert(message) {
  return swal({
    title: "Success!",
    text: message,
    icon: "success",
  });
}

// Reusable function for error alerts
export async function errorAlert(message) {
  const willRedirect = await swal({
    title: "Error!",
    text: message,
    icon: "error",
    button: {
      text: "OK",
      className: "custom-confirm-btn",
    },
  });

  if (willRedirect && message.includes("로그인")) {
    localStorage.removeItem("userInfo");
    document.cookie =
      "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    userData.set({
      isLoggedIn: false,
      userInfo: null,
    });
    navigate("/login");
  }
}

export function warningAlert(message) {
  return swal({
    title: "Warning!",
    text: message,
    icon: "warning",
    button: {
      text: "OK",
      className: "custom-warning-btn", // Optional: Add custom styling
    },
  });
}
