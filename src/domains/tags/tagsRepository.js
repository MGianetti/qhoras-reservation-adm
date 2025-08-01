import makeRequest from '../../common/utils/makeRequest';
import apiService from '../../infraestructure/api/apiService';
import endpoints from '../../infraestructure/api/endpoints.constants';

const readAllTags = (businessId) => makeRequest(() => apiService.get(endpoints.read.tags.replace('${BUSINESS-ID}', businessId)));

const createTag = (businessId, tagData) => makeRequest(() => apiService.post(endpoints.create.tags.replace('${BUSINESS-ID}', businessId), tagData));

const updateTag = (businessId, tagId, tagData) =>
    makeRequest(() => apiService.put(endpoints.update.tags.replace('${BUSINESS-ID}', businessId).replace('${TAG-ID}', tagId), tagData));

const deleteTag = (businessId, tagId) => makeRequest(() => apiService.delete(endpoints.delete.tags.replace('${BUSINESS-ID}', businessId).replace('${TAG-ID}', tagId)));

export default {
    readAllTags,
    createTag,
    updateTag,
    deleteTag
};
