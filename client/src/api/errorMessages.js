export const getErrorMessage = (error) => {
  const data = error.response?.data;
  if (!data) return "Operation Failed";
  const backendMessage = data?.message;
  if (!backendMessage) return error.response?.data || "Operation Failed";

  let arrayOfMessages;
  if (Array.isArray(backendMessage.errors)) {
    arrayOfMessages = backendMessage.errors.map((err) => err.msg).join("\n");
  }
  if (arrayOfMessages) {
    return arrayOfMessages;
  } else {
    return error.response?.data?.message || "Something went wrong";
  }
};
