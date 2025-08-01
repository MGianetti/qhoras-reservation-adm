import store from '../../infraestructure/store/store';
import notification from '../../common/utils/notification';

import tagRepository from './tagsRepository.js';
import { readItem, addItem, updateItem, removeItem, setLoading, clearItems } from './tagsSlice.js';

import { createdTagSuccess, createdTagFail, updatedTagSuccess, updatedTagFail, deletedTagSuccess, deletedTagFail } from './tag.constants';

const dispatch = (action) => store.dispatch(action);

const read = async (businessId) => {
    try {
        dispatch(setLoading(true));
        const tags = await tagRepository.readAllTags(businessId);
        dispatch(readItem({ data: tags }));
        return tags;
    } catch (error) {
        console.error('Error fetching tags:', error);
        return false;
    } finally {
        dispatch(setLoading(false));
    }
};

const create = async (businessId, newTag) => {
    try {
        dispatch(setLoading(true));
        const tag = await tagRepository.createTag(businessId, newTag);
        dispatch(addItem(tag));
        notification(createdTagSuccess);
        return tag;
    } catch (error) {
        console.error('Error creating tag:', error);
        notification(createdTagFail);
        return false;
    } finally {
        dispatch(setLoading(false));
    }
};

const update = async (businessId, tagId, updates) => {
    try {
        dispatch(setLoading(true));
        const updated = await tagRepository.updateTag(businessId, tagId, updates);
        dispatch(updateItem(updated));
        notification(updatedTagSuccess);
        return updated;
    } catch (error) {
        console.error('Error updating tag:', error);
        notification(updatedTagFail);
        return false;
    } finally {
        dispatch(setLoading(false));
    }
};

const remove = async (businessId, tagId) => {
    try {
        dispatch(setLoading(true));
        await tagRepository.deleteTag(businessId, tagId);
        dispatch(removeItem({ id: tagId }));
        notification(deletedTagSuccess);
        return true;
    } catch (error) {
        console.error('Error deleting tag:', error);
        notification(deletedTagFail);
        return false;
    } finally {
        dispatch(setLoading(false));
    }
};

export default {
    read,
    create,
    update,
    remove
};
