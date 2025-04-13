const errorsHandler = (error) => {
  console.error(
    `Error in request ${error.config?.method.toUpperCase()} ${error.config?.url}`,
  );

  if (error.response) {
    console.error("Error data:", error.response.data);
    console.error("Error status:", error.response.status);
    console.error("Error headers:", error.response.headers);
  } else if (error.request) {
    console.error("No response received:", error.request);
  } else {
    console.error("Error Message:", error.message);
  }

  if (!error.response) {
    console.error("Network error: Check internet connection or server status.");
  }

  throw error;
};

export default errorsHandler;
