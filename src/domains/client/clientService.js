import clientRepository from "./clientRepository";
import store from "../../infraestructure/store/store";
import notification from "../../common/utils/notification";
import { readItem, addItem, updateItem, setLoading } from "./clientSlice";

import {
  createdClientSuccess,
  createdClientFail,
  updatedClientSuccess,
  updatedClientFail,
} from "./client.constants";

const dispatch = (action) => store.dispatch(action);

const read = async ({ businessId, page = 1, limit = 10, search = "" }) => {
  try {
    dispatch(setLoading(true));
    const response = await clientRepository.readAllClients(
      businessId,
      page,
      limit,
      search,
    );
    const newData = response.clients;
    dispatch(
      readItem({
        data: newData,
        page: response.page,
        totalCount: response.totalCount,
        search,
      }),
    );
    return {
      data: newData,
      pagination: {
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        search,
        page,
      },
    };
  } catch (error) {
    console.error("Error reading clients with pagination:", error);
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

const create = async (businessId, newClientPayload) => {
  try {
    dispatch(setLoading(true));
    const response = await clientRepository.createClient(
      businessId,
      newClientPayload,
    );
    dispatch(addItem(response));
    notification(createdClientSuccess);
  } catch (error) {
    notification(createdClientFail);
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

const update = async (clientId, updateClientPayload) => {
  try {
    dispatch(setLoading(true));
    const response = await clientRepository.updateClient(
      clientId,
      updateClientPayload,
    );
    dispatch(updateItem(response));
    notification(updatedClientSuccess);
  } catch (error) {
    notification(updatedClientFail);
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

// Criando o objeto com as funções definidas acima
const clientService = {
  read,
  create,
  update,
};

export default clientService;
