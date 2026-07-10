export const showAccessDeniedMessage = (action = "perform this action") => {
  alert(`Access denied. You don't have permission to ${action}.`);
};

export const handleAdminApiError = (error, fallbackMessage = "Something went wrong") => {
  const message = error?.message || fallbackMessage;

  if (
    message.toLowerCase().includes("access denied") ||
    message.toLowerCase().includes("forbidden") ||
    message.includes("403")
  ) {
    alert("Access denied. You don't have permission to perform this action.");
    return;
  }

  alert(message);
};