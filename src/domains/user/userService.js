import userRepository from './userRepository';
import store from '../../infraestructure/store/store';
import notification from '../../common/utils/notification';
import { readItem, clearItems, setLoading, setEmployees } from './userSlice';
import { setUser } from '../../infraestructure/auth/authSlice';

import { updatedUserConfigSuccess, updatedUserConfigFail, companyUpdatedSuccess, companyUpdatedFail } from './user.constants';

const dispatch = (action) => store.dispatch(action);

const { read, updateUserConfig, updateCompany, readBusinessEmployees } = {
    read: async (businessId) => {
        try {
            dispatch(setLoading(true));
            const scheduleResponse = await userRepository.readSchedule(businessId);
            const userConfigResponse = await userRepository.readUserConfig(businessId);

            dispatch(readItem({ schedule: scheduleResponse, suggestionTime: userConfigResponse.suggestionTime }));
        } catch (error) {
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    },
    updateUserConfig: async (businessId, updateUserConfigPayload) => {
        try {
            dispatch(setLoading(true));
            const { schedule, userConfig } = await userRepository.updateUserConfig(businessId, updateUserConfigPayload);
            dispatch(clearItems());
            dispatch(readItem({ schedule, suggestionTime: userConfig.suggestionTime }));
            notification(updatedUserConfigSuccess);
        } catch (error) {
            notification(updatedUserConfigFail);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    },
    readBusinessEmployees: async (businessId) => {
        try {
            dispatch(setLoading(true));
            const response = await userRepository.readBusinessEmployees(businessId);
            dispatch(setEmployees(response));
            notification(companyUpdatedSuccess);
        } catch (error) {
            notification(companyUpdatedFail);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    },
    updateCompany: async (businessId, updateCompanyPayload) => {
        try {
            dispatch(setLoading(true));
            const response = await userRepository.updateCompany(businessId, updateCompanyPayload);
            dispatch(setUser(response));
            notification(companyUpdatedSuccess);
        } catch (error) {
            notification(companyUpdatedFail);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }
};

const userService = {
    read,
    updateUserConfig,
    updateCompany,
    readBusinessEmployees
};

export default userService;
