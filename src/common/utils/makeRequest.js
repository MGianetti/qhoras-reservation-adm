import errorsHandler from "./errorsHandler";

const makeRequest = async (requestFunction, requestData) => {
  try {
    const response = await requestFunction(requestData);
    return response.data;
  } catch (error) {
    errorsHandler(error);
  }
};

export default makeRequest;
