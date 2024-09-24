import swal from "sweetalert";

// Reusable function for delete confirmation
export function confirmDelete() {
  return swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this file!",
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
export function errorAlert(message) {
  return swal({
    title: "Error!",
    text: message,
    icon: "error",
  });
}
