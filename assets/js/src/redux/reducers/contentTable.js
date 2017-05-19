import update from 'immutability-helper';

export default function contentTable(state = {}, action) {
	switch (action.type) {
		case 'SET_SOURCE':
			return update(state, { source: { $set: action.source } });
		case 'SET_LIST_NAME':
			return update(state, { listName: { $set: action.listName } });
		default:
			return state;
	}
}