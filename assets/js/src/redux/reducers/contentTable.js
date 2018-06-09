import update from 'immutability-helper';

export default function contentTable(state = {}, action) {
	switch (action.type) {
		case 'SET_SOURCE':
			return update(state, { source: { $set: action.source } });
		case 'SET_LIST_NAME':
			return update(state, { listName: { $set: action.listName } });
		case 'SET_PREFIX_NAME':
			return update(state, { prefixName: { $set: action.prefixName } });
		case 'SET_GROUP_NAME':
			return update(state, { groupName: { $set: action.groupName } });
		case 'SET_CONTENT_TYPES_PREFIX':
			return update(state, { useContentTypePrefix: { $set: action.use } });
		case 'SET_LISTS_PREFIX':
			return update(state, { useListPrefix: { $set: action.use } });
		default:
			return state;
	}
}