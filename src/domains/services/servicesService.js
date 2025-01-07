import dayjs from 'dayjs';

import servicesRepository from './servicesRepository';
import store from '../../infraestructure/store/store';
import notification from '../../common/utils/notification';
import { readItem, addItem, updateItem, deleteItem, setLoading } from './servicesSlice';

import { createdServiceSuccess, createdServiceFail, updatedServiceSuccess, updatedServiceFail, deletedServiceSuccess, deletedServiceFail } from './services.constants';

const dispatch = (action) => store.dispatch(action);

const { read, create, update, deleteService } = {
    read: async ({businessId, page = 1, limit = 10, ...filters}) => {
        try {
            dispatch(setLoading(true));
            const response = await servicesRepository.readAllServices(businessId, page, limit, filters);
            const newData = response.services;

            dispatch(
                readItem({
                    data: newData,
                    page,
                    totalCount: response.totalCount
                })
            );
        } catch (error) {
            console.error('Error reading services with pagination:', error);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    },
    create: async (businessId, newServicePayload) => {
        try {
            dispatch(setLoading(true));
            const response = await servicesRepository.createService(businessId, newServicePayload);
            dispatch(addItem(response));
            notification(createdServiceSuccess);
        } catch (error) {
            notification(createdServiceFail);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    },
    update: async (businessId, updateServicePayload) => {
        try {
            dispatch(setLoading(true));
            const response = await servicesRepository.updateService(businessId, updateServicePayload);
            dispatch(updateItem(response));
            notification(updatedServiceSuccess);
        } catch (error) {
            notification(updatedServiceFail);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    },

    deleteService: async (serviceId) => {
        try {
            dispatch(setLoading(true));
            const response = await servicesRepository.deleteService(serviceId);
            const deletedServiceId = response.deletedService.id;
            dispatch(deleteItem(deletedServiceId)); // Passe o ID do serviço deletado
            notification(deletedServiceSuccess);
        } catch (error) {
            notification(deletedServiceFail);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }
};

const servicesService = {
    read,
    create,
    update,
    deleteService
};

export default servicesService;
